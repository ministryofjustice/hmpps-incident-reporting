import type { Express, NextFunction, Request, Response } from 'express'

import { roleReadOnly, roleReadWrite, roleApproveReject, rolePecs, roleAdmin } from '../../data/constants'
import type { ReportBasic } from '../../data/incidentReportingApi'
import { isPecsRegionCode, pecsRegions } from '../../data/pecsRegions'
import { isLocationActiveInService } from './locationActiveInService'
import { type ReportTransitions, prisonReportTransitions, pecsReportTransitions } from './statusTransitions'
import type { UserAction } from './userActions'
import type { UserType } from './userType'

/**
 * Per-request class to check whether the user is allowed to perform a given action.
 * Always available on res.locals.permissions even if user is not authenticated or is missing roles.
 *
 * See roles constants for explanation of their permissions.
 */
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
      this.userType = 'DATA_WARDEN'
    } else if (roles.has(roleReadWrite)) {
      this.userType = 'REPORTING_OFFICER'
    } else if (roles.has(roleReadOnly)) {
      this.userType = 'HQ_VIEWER'
    }

    // access to PECS is additionally granted to any user type
    if (roles.has(rolePecs)) {
      this.hasPecsAccess = true
    }

    // access to Admin screens is additionally granted to any user type
    if (roles.has(roleAdmin)) {
      this.hasAdminAccess = true
    }
  }

  readonly userType: UserType | null = null

  get isDataWarden(): boolean {
    return this.userType === 'DATA_WARDEN'
  }

  get isReportingOfficer(): boolean {
    return this.userType === 'REPORTING_OFFICER'
  }

  get isHqViewer(): boolean {
    return this.userType === 'HQ_VIEWER'
  }

  readonly hasPecsAccess: boolean = false

  readonly hasAdminAccess: boolean = false

  /** Has *some* role granting access to service */
  get canAccessService(): boolean {
    // TODO: will management reporting need a separate role?
    return this.isHqViewer || this.isReportingOfficer || this.isDataWarden
  }

  /** Can create new report in given prison or PECS region */
  canCreateReportInLocation(location: string): boolean {
    return this.allowedActionsOnReport({ status: 'DRAFT', location }).has('EDIT')
  }

  /** Could have created a new report in DPS if given prison was active or PECS regions are enabled */
  canCreateReportInLocationInNomisOnly(location: string): boolean {
    return this.allowedActionsOnReport({ status: 'DRAFT', location }, 'nomis').has('EDIT')
  }

  /** Can create new report in active caseload prison */
  get canCreateReportInActiveCaseload(): boolean {
    return this.canCreateReportInLocation(this.activeCaseloadId)
  }

  /** Could have created new report in active caseload prison were it enabled */
  get canCreateReportInActiveCaseloadInNomisOnly(): boolean {
    return this.canCreateReportInLocationInNomisOnly(this.activeCaseloadId)
  }

  /** Can create a new PECS report - at least one PECS region is active and turned on in service */
  get canCreatePecsReport(): boolean {
    const activePecsRegions = pecsRegions.filter(pecsRegion => pecsRegion.active)

    // Need to loop through all active PECS regions to check if any of them allow creating a report
    for (const activePecsRegion of activePecsRegions) {
      const canCreate = activePecsRegion?.code ? this.canCreateReportInLocation(activePecsRegion.code) : false
      if (canCreate) {
        return true
      }
    }
    return false
  }

  /** Could have created a new PECS report if it was enabled */
  get canCreatePecsReportInNomisOnly(): boolean {
    const activePecsRegions = pecsRegions.filter(pecsRegion => pecsRegion.active)

    // Need to loop through all active PECS regions to check if any of them allow creating a report in NOMIS only
    for (const activePecsRegion of activePecsRegions) {
      const createNomisOnly = activePecsRegion?.code
        ? this.canCreateReportInLocationInNomisOnly(activePecsRegion.code)
        : false
      if (!createNomisOnly) {
        return false
      }
    }
    return true
  }

  /**
   * Returns the set of user actions allowed on this report.
   * Actions that change a report are permitted either only on DPS or only in NOMIS.
   * Set `where` to “nomis” to get actions that would have been allowed if the location were active in DPS –
   * this indicates that users should go to NOMIS to complete their intended work.
   *
   * NB: this does NOT perform report validity checks!
   */
  allowedActionsOnReport(
    reportLike: Pick<ReportBasic, 'status' | 'location'>,
    where: 'dps' | 'nomis' = 'dps',
  ): ReadonlySet<UserAction> {
    const isPecsReport = isPecsRegionCode(reportLike.location)
    const { canAccessService, hasPecsAccess } = this
    const canAccessLocation = isPecsReport ? hasPecsAccess : this.caseloadIds.has(reportLike.location)
    const locationIsActive = isLocationActiveInService(reportLike.location)

    if (!canAccessService || !canAccessLocation) {
      // insufficient roles or caseloads
      return new Set<UserAction>()
    }

    const allowedActions = new Set<UserAction>(['VIEW'])

    if ((where === 'dps' && !locationIsActive) || (where === 'nomis' && locationIsActive)) {
      // only modifiable in nomis
      return allowedActions
    }

    const modifyingAllowedActions = this.possibleTransitions(reportLike)
    Object.keys(modifyingAllowedActions).forEach((action: UserAction) => allowedActions.add(action))

    return allowedActions
  }

  /**
   * Returns an object describing the status transitions this report can potentially go through
   * based on user type and status. Only report-modifying user actions will be included.
   *
   * NB: this does NOT perform location-based or report validity checks! See `allowedActionsOnReport`…
   */
  possibleTransitions(reportLike: Pick<ReportBasic, 'status' | 'location'>): ReportTransitions {
    const { userType } = this
    const isPecsReport = isPecsRegionCode(reportLike.location)
    const transitions = isPecsReport ? pecsReportTransitions : prisonReportTransitions
    return transitions[userType]?.[reportLike.status] ?? {}
  }
}
