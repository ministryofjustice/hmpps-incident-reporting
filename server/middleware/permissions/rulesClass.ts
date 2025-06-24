import type { NextFunction, Request, Response } from 'express'

import { roleReadOnly, roleReadWrite, roleApproveReject, rolePecs } from '../../data/constants'
import type { ReportBasic } from '../../data/incidentReportingApi'
import { isPecsRegionCode } from '../../data/pecsRegions'
import { isLocationActiveInService } from './locationActiveInService'
import { prisonReportTransitions, pecsReportTransitions } from './statusTransitions'
import type { UserAction } from './userActions'
import type { UserType } from './userType'

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
      this.userType = 'dataWarden'
    } else if (roles.has(roleReadWrite)) {
      this.userType = 'reportingOfficer'
    } else if (roles.has(roleReadOnly)) {
      this.userType = 'hqViewer'
    }

    // access to PECS is additionally granted to any user type
    if (roles.has(rolePecs)) {
      this.hasPecsAccess = true
    }
  }

  readonly userType: UserType | null = null

  get isDataWarden(): boolean {
    return this.userType === 'dataWarden'
  }

  get isReportingOfficer(): boolean {
    return this.userType === 'reportingOfficer'
  }

  get isHqViewer(): boolean {
    return this.userType === 'hqViewer'
  }

  readonly hasPecsAccess: boolean = false

  /** Has *some* role granting access to service */
  get canAccessService(): boolean {
    // TODO: will management reporting need a separate role?
    return this.isHqViewer || this.isReportingOfficer || this.isDataWarden
  }

  /** Can view this report */
  canViewReport(report: ReportBasic): boolean {
    // TODO: remove
    return this.allowedActionsOnReport(report).has('view')
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

  /** Can edit this report */
  canEditReport(report: ReportBasic): boolean {
    // TODO: remove
    return this.allowedActionsOnReport(report).has('edit')
  }

  /** Could have edited this report in DPS if prison was active or PECS regions are enabled */
  canEditReportInNomisOnly(report: ReportBasic): boolean {
    // TODO: remove
    return this.allowedActionsOnReport(report, 'nomis').has('edit')
  }

  /** Can approve or reject this report */
  canApproveOrRejectReport(report: ReportBasic): boolean {
    // TODO: remove
    return this.allowedActionsOnReport(report).has('close')
  }

  /** Could have approved or rejected this report in DPS if prison was active or PECS regions are enabled */
  canApproveOrRejectReportInNomisOnly(report: ReportBasic): boolean {
    // TODO: remove
    return this.allowedActionsOnReport(report, 'nomis').has('close')
  }

  /**
   * Returns the set of user actions allowed on this report.
   * Actions that change a report are permitted either only on DPS or only in NOMIS.
   * Set `where` to “nomis” to get actions that would have been allowed if the location were active in DPS –
   * this indicates that users should go to NOMIS to complete their intended work.
   */
  allowedActionsOnReport(report: ReportBasic, where: 'dps' | 'nomis' = 'dps'): ReadonlySet<UserAction> {
    const isPecsReport = isPecsRegionCode(report.location)
    const { userType, canAccessService, hasPecsAccess } = this
    const canAccessLocation = isPecsReport ? hasPecsAccess : this.caseloadIds.has(report.location)
    const locationIsActive = isLocationActiveInService(report.location)

    if (!canAccessService || !canAccessLocation) {
      // insufficient roles or caseloads
      return new Set<UserAction>()
    }

    const allowedActions = new Set<UserAction>(['view'])

    if ((where === 'dps' && !locationIsActive) || (where === 'nomis' && locationIsActive)) {
      // only modifiable in nomis
      return allowedActions
    }

    const transitions = isPecsReport ? pecsReportTransitions : prisonReportTransitions
    const nonViewAllowedActions = transitions[userType]?.[report.status] ?? {}
    Object.keys(nonViewAllowedActions).forEach((action: UserAction) => allowedActions.add(action))

    // TODO: require valid report for certain actions

    return allowedActions
  }
}
