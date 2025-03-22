import type { Request, RequestHandler, Response, NextFunction } from 'express'
import { Forbidden } from 'http-errors'

import config from '../config'
import { roleReadOnly, roleReadWrite, roleApproveReject, rolePecs } from '../data/constants'
import type { ReportBasic } from '../data/incidentReportingApi'
import { isPecsRegionCode } from '../data/pecsRegions'

/**
 * Per-request class to check whether the user is allowed to perform a given action.
 * Always available on res.locals.permissions even if user is not authenticated or is missing roles.
 *
 * See roles constants for explanation of their permissions.
 */
export class Permissions {
  /** Current user’s active caseload */
  private readonly activeCaseloadId: string

  /** Current user’s caseloads */
  private readonly caseloadIds: Set<string>

  /** Current user’s roles */
  private readonly roles: Set<string>

  constructor(user: Express.User | undefined) {
    this.activeCaseloadId = user?.activeCaseLoad?.caseLoadId ?? 'NONE'
    this.caseloadIds = new Set(user?.caseLoads?.map(caseLoad => caseLoad.caseLoadId) ?? [])
    this.roles = new Set(user?.roles ?? [])
    this.canAccessService = [roleReadWrite, roleApproveReject, roleReadOnly].some(role => this.roles.has(role))
    this.canCreateReport = [roleReadWrite, roleApproveReject].some(role => this.roles.has(role))
  }

  /** Has some role granting access to service */
  readonly canAccessService: boolean

  /** Can view this report at all */
  canViewReport(report: ReportBasic): boolean {
    return (
      // has minimal roles
      this.canAccessService &&
      // if PECS region, user has specific PECS role?
      ((isPecsRegionCode(report.location) && this.roles.has(rolePecs)) ||
        // otherwise user has caseload?
        this.caseloadIds.has(report.location))
    )
  }

  /** Can create new report (ignoring caseload!) */
  readonly canCreateReport: boolean

  /** Can create new report in given prison or PECS region */
  canCreateReportInLocation(code: string): boolean {
    return (
      // has minimal roles
      this.canCreateReport &&
      // if PECS region, are PECS reports enabled and user can edit PECS reports (has approver & PECS roles)?
      ((isPecsRegionCode(code) &&
        config.activeForPecsRegions &&
        this.roles.has(roleApproveReject) &&
        this.roles.has(rolePecs)) ||
        // otherwise is prison enabled and user has caseload?
        (isPrisonActiveInService(code) && this.caseloadIds.has(code)))
    )
  }

  /** Can create new report in active caseload prison */
  get canCreateReportInActiveCaseload(): boolean {
    return this.canCreateReportInLocation(this.activeCaseloadId)
  }

  /** Can edit this report */
  canEditReport(report: ReportBasic): boolean {
    return (
      // has minimal roles
      this.canCreateReport &&
      // if PECS region, are PECS reports enabled and user can edit PECS reports (has approver & PECS roles)?
      ((isPecsRegionCode(report.location) &&
        config.activeForPecsRegions &&
        this.roles.has(roleApproveReject) &&
        this.roles.has(rolePecs)) ||
        // otherwise is prison enabled and user has caseload?
        (isPrisonActiveInService(report.location) && this.caseloadIds.has(report.location)))
    )
  }

  /** Could have edited this report in DPS if prison was active or PECS regions are enabled */
  canEditReportInNomisOnly(report: ReportBasic): boolean {
    return (
      // has minimal roles
      this.canCreateReport &&
      // if PECS region and user can edit PECS reports (has approver & PECS roles), but PECS reports are inactive in service
      ((isPecsRegionCode(report.location) &&
        this.roles.has(roleApproveReject) &&
        this.roles.has(rolePecs) &&
        !config.activeForPecsRegions) ||
        // has caseload but prison is inactive in service
        (this.caseloadIds.has(report.location) && !isPrisonActiveInService(report.location)))
    )
  }

  /** Can approve or reject this report */
  canApproveOrRejectReport(report: ReportBasic): boolean {
    return (
      // has specific approve role
      this.roles.has(roleApproveReject) &&
      // if PECS region, are PECS reports enabled and user has PECS role?
      ((isPecsRegionCode(report.location) && config.activeForPecsRegions && this.roles.has(rolePecs)) ||
        // otherwise is prison enabled and user has caseload?
        (isPrisonActiveInService(report.location) && this.caseloadIds.has(report.location)))
    )
  }
}

/**
 * Whether given prison should have full access to incident report on DPS, ie. the service has been rolled out there.
 * Otherwise, users are expected to continue using NOMIS.
 */
export function isPrisonActiveInService(prisonId: string): boolean {
  // empty list permits none
  if (config.activePrisons.length === 0) {
    return false
  }
  // list with only "***" permits all
  if (config.activePrisons.length === 1 && config.activePrisons[0] === '***') {
    return true
  }
  // otherwise actually check
  return config.activePrisons.includes(prisonId)
}

export function setupPermissions(_req: Request, res: Response, next: NextFunction): void {
  res.locals.permissions = new Permissions(res.locals.user)
  next()
}

/**
 * If condition evaluates to _true_, sends Forbidden (403) error to next request handler which logs user out.
 * Must come after setupPermissions() middleware.
 *
 * TODO: a better alternative could be to show them instructions about getting access
 */
export function logoutIf(condition: (permissions: Permissions, res: Response) => boolean): RequestHandler {
  return (_req: Request, res: Response, next: NextFunction): void => {
    const { permissions } = res.locals

    if (condition(permissions, res)) {
      next(new Forbidden())
      return
    }

    next()
  }
}
