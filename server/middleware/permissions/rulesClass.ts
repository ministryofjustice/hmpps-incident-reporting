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

  constructor(user: Express.User | undefined) {
    this.activeCaseloadId = user?.activeCaseLoad?.caseLoadId ?? 'NO-CURRENT-CASELOAD'
    this.caseloadIds = new Set(user?.caseLoads?.map(caseLoad => caseLoad.caseLoadId) ?? [])

    const roles = new Set(user?.roles ?? [])
    // choose user type in descending abilities/trust based on role set
    if (roles.has(roleApproveReject)) {
      this.isDataWarden = true
    } else if (roles.has(roleReadWrite)) {
      this.isReportingOfficer = true
    } else if (roles.has(roleReadOnly)) {
      this.isHqViewer = true
    }
    // access to PECS is additionally granted to any user type
    if (roles.has(rolePecs)) {
      this.hasPecsAccess = true
    }
  }

  readonly isDataWarden: boolean = false

  readonly isReportingOfficer: boolean = false

  readonly isHqViewer: boolean = false

  readonly hasPecsAccess: boolean = false

  /** Has *some* role granting access to service */
  get canAccessService(): boolean {
    // TODO: will management reporting need a separate role?
    return this.isHqViewer || this.isReportingOfficer || this.isDataWarden
  }

  /** Can view this report */
  canViewReport(report: ReportBasic): boolean {
    return (
      // has minimal roles
      this.canAccessService &&
      // if PECS region, user has specific PECS role?
      ((isPecsRegionCode(report.location) && this.hasPecsAccess) ||
        // otherwise user has caseload?
        this.caseloadIds.has(report.location))
    )
  }

  private couldCreateReportInLocationIfActiveInService(location: string): boolean {
    return (
      // if PECS region, requires data warden and PECS role
      (isPecsRegionCode(location) && this.isDataWarden && this.hasPecsAccess) ||
      // otherwise requires reporting officer and caseload
      (this.caseloadIds.has(location) && this.isReportingOfficer)
    )
  }

  /** Can create new report in given prison or PECS region */
  canCreateReportInLocation(location: string): boolean {
    return this.couldCreateReportInLocationIfActiveInService(location) && isLocationActiveInService(location)
  }

  /** Could have created new report in DPS if given prison was active or PECS regions are enabled */
  canCreateReportInLocationInNomisOnly(location: string): boolean {
    return this.couldCreateReportInLocationIfActiveInService(location) && !isLocationActiveInService(location)
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
      // if PECS region, requires data warden and PECS role
      (isPecsRegionCode(report.location) && this.isDataWarden && this.hasPecsAccess) ||
      // otherwise requires reporting officer and caseload
      (this.caseloadIds.has(report.location) && this.isReportingOfficer)
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
      this.isDataWarden &&
      // if PECS region, requires PECS role
      ((isPecsRegionCode(report.location) && this.hasPecsAccess) ||
        // otherwise requires caseload
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
