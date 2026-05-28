import type express from 'express'
import type FormWizard from 'hmpo-form-wizard'

import { InvolvementSummary } from '../../../../controllers/involvements/summary'
import type { ReportWithDetails } from '../../../../data/incidentReportingApi'
import { populateReportConfiguration } from '../../../../middleware/populateReportConfiguration'
import {
  prisonerInvolvementOutcomesDescriptions,
  prisonerInvolvementRolesDescriptions,
} from '../../../../reportConfiguration/constants'
import type { Values } from './fields'

export default class PrisonerSummary extends InvolvementSummary {
  middlewareLocals(): void {
    // Load reportConfig (without generating question steps) so canAddMoreInvolvements()
    // can inspect prisonerRoles.  Mirrors the pattern in PrisonerInvolvementController.
    this.router.use(populateReportConfiguration(false))
    super.middlewareLocals()
  }

  protected canAddMoreInvolvements(res: express.Response): boolean {
    const { reportConfig } = res.locals
    if (!reportConfig) return true // safe default when config unavailable

    const report = res.locals.report as ReportWithDetails
    const usedRoles = new Set(report.prisonersInvolved.map(p => p.prisonerRole))

    // There is room for another prisoner if ANY active role can still be filled:
    // • unlimited roles (onlyOneAllowed: false) are always available, or
    // • single-use roles (onlyOneAllowed: true) that haven't been used yet.
    return reportConfig.prisonerRoles.some(
      role => role.active && (!role.onlyOneAllowed || !usedRoles.has(role.prisonerRole)),
    )
  }

  protected type = 'prisoners' as const

  protected involvementField = 'prisonersInvolved' as const

  protected involvementDoneField = 'prisonerInvolvementDone' as const

  protected pageTitleBeforeInvolvementDone = 'Do you want to add a prisoner to the report?'

  protected pageTitleOnceInvolvementDone = 'Prisoners involved'

  protected labelOnceInvolvementsExist = 'Do you want to add another prisoner?'

  protected confirmError = 'Select if you want to add a prisoner'

  protected confirmErrorOnceInvolvementsExist = 'Select if you want to add another prisoner'

  protected localsForLookups(): Record<string, unknown> {
    return {
      prisonerInvolvementOutcomesDescriptions,
      prisonerInvolvementRolesDescriptions,
    }
  }

  getNextStep(req: FormWizard.Request<Values>, res: express.Response): string {
    if (res.locals.creationJourney && req.body?.formAction !== 'exit') {
      // proceed to adding staff when following create journey
      return `${res.locals.reportSubUrlPrefix}/staff`
    }
    // …or go to report view if user chose to exit
    return super.getNextStep(req, res)
  }
}
