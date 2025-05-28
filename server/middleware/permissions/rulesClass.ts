import type { NextFunction, Request, Response } from 'express'

import { roleReadOnly, roleReadWrite, roleApproveReject, rolePecs } from '../../data/constants'
import type { ReportBasic } from '../../data/incidentReportingApi'
import { isPecsRegionCode } from '../../data/pecsRegions'
import { isLocationActiveInService } from './locationActiveInService'

/**
 * Per-request class to check whether the user is allowed to perform a given action.
 * Always available on res.locals.permissions even if user is not authenticated or is missing roles.
 *
 * See roles constants for explanation of their permissions.
 */
// eslint-disable-next-line import/prefer-default-export
export class Permissions {
  /** Creates an instance of this class for the current user */
  static middleware(_req: Request, res: Response, next: NextFunction): void {
    res.locals.permissions = new Permissions(res.locals.user)
    next()
  }

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

  private couldCreateReportInLocationIfActiveInService(code: string): boolean {
    return (
      // has minimal roles
      this.canCreateReport &&
      // if PECS region, can user edit PECS reports (has approver & PECS roles)?
      ((isPecsRegionCode(code) && this.roles.has(roleApproveReject) && this.roles.has(rolePecs)) ||
        // otherwise does user have caseload but isn't a data warden?
        (this.caseloadIds.has(code) && !this.roles.has(roleApproveReject)))
    )
  }

  /** Can create new report in given prison or PECS region */
  canCreateReportInLocation(code: string): boolean {
    return this.couldCreateReportInLocationIfActiveInService(code) && isLocationActiveInService(code)
  }

  /** Could have created new report in DPS if given prison was active or PECS regions are enabled */
  canCreateReportInLocationInNomisOnly(code: string): boolean {
    return this.couldCreateReportInLocationIfActiveInService(code) && !isLocationActiveInService(code)
  }

  /** Can create new report in active caseload prison */
  get canCreateReportInActiveCaseload(): boolean {
    return this.canCreateReportInLocation(this.activeCaseloadId)
  }

  /** Could have created new report in active caseload prison were it enabled */
  get canCreateReportInActiveCaseloadInNomisOnly(): boolean {
    return this.canCreateReportInLocationInNomisOnly(this.activeCaseloadId)
  }

  private couldEditReportIfLocationActiveInService(report: ReportBasic): boolean {
    return (
      // has minimal roles
      this.canCreateReport &&
      // if PECS region, can user edit PECS reports (has approver & PECS roles)?
      ((isPecsRegionCode(report.location) && this.roles.has(roleApproveReject) && this.roles.has(rolePecs)) ||
        // otherwise does user have caseload but isn't a data warden?
        (this.caseloadIds.has(report.location) && !this.roles.has(roleApproveReject)))
    )
  }

  /** Can edit this report */
  canEditReport(report: ReportBasic): boolean {
    return this.couldEditReportIfLocationActiveInService(report) && isLocationActiveInService(report.location)
  }

  /** Could have edited this report in DPS if prison was active or PECS regions are enabled */
  canEditReportInNomisOnly(report: ReportBasic): boolean {
    return this.couldEditReportIfLocationActiveInService(report) && !isLocationActiveInService(report.location)
  }

  private couldApproveOrRejectReportIfLocationActiveInService(report: ReportBasic): boolean {
    return (
      // has specific approve role
      this.roles.has(roleApproveReject) &&
      // if PECS region, does user have PECS role?
      ((isPecsRegionCode(report.location) && this.roles.has(rolePecs)) ||
        // otherwise does user have caseload?
        this.caseloadIds.has(report.location))
    )
  }

  /** Can approve or reject this report */
  canApproveOrRejectReport(report: ReportBasic): boolean {
    return (
      this.couldApproveOrRejectReportIfLocationActiveInService(report) && isLocationActiveInService(report.location)
    )
  }

  /** Could have approved or rejected this report in DPS if prison was active or PECS regions are enabled */
  canApproveOrRejectReportInNomisOnly(report: ReportBasic): boolean {
    return (
      this.couldApproveOrRejectReportIfLocationActiveInService(report) && !isLocationActiveInService(report.location)
    )
  }
}
