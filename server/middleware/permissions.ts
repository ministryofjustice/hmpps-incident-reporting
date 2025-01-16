import type { Request, RequestHandler, Response, NextFunction } from 'express'
import { Forbidden } from 'http-errors'

import config from '../config'
import { roleReadOnly, roleReadWrite, roleApproveReject } from '../data/constants'
import type { ReportBasic } from '../data/incidentReportingApi'

/**
 * Per-request class to check whether the user is allowed to perform a given action.
 * Always available on res.locals.permissions even if user is not authenticated or is missing roles.
 *
 * See roles constants for explanation of their permissions.
 */
export class Permissions {
  /** Current user’s caseloads */
  private readonly caseloadIds: Set<string>

  /** Current user’s roles */
  private readonly roles: Set<string>

  constructor(user: Express.User | undefined) {
    this.caseloadIds = new Set(user?.caseLoads?.map(caseLoad => caseLoad.caseLoadId) ?? [])
    this.roles = new Set(user?.roles ?? [])
    this.canAccessService = [roleReadWrite, roleApproveReject, roleReadOnly].some(role => this.roles.has(role))
    this.canCreateReport = [roleReadWrite, roleApproveReject].some(role => this.roles.has(role))
  }

  /** Has some role granting access to service */
  readonly canAccessService: boolean

  /** Can view this report at all */
  canViewReport(report: ReportBasic): boolean {
    return this.canAccessService && this.caseloadIds.has(report.location)
    // TODO: decide what happens to PECS reports
  }

  /** Can create new report */
  readonly canCreateReport: boolean

  /** Can edit this report */
  canEditReport(report: ReportBasic): boolean {
    return this.canCreateReport && isPrisonActiveInService(report.location) && this.caseloadIds.has(report.location)
    // TODO: decide what happens to PECS reports
  }

  /** Could have edited this report in DPS if prison was active */
  canEditReportInNomisOnly(report: ReportBasic): boolean {
    return this.canCreateReport && !isPrisonActiveInService(report.location) && this.caseloadIds.has(report.location)
    // TODO: decide what happens to PECS reports
  }

  /** Can approve or reject this report */
  canApproveOrRejectReport(report: ReportBasic): boolean {
    return (
      this.roles.has(roleApproveReject) &&
      isPrisonActiveInService(report.location) &&
      this.caseloadIds.has(report.location)
    )
    // TODO: decide what happens to PECS reports
  }
}

/**
 * Whether given prison should have full access to incident report on DPS, ie. the service has been rolled out there.
 * Otherwise, they are expected to continue using NOMIS.
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
