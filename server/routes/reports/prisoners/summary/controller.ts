import type express from 'express'
import type FormWizard from 'hmpo-form-wizard'

import { InvolvementSummary } from '../../../../controllers/involvements/summary'
import { prisonerInvolvementOutcomes, prisonerInvolvementRoles } from '../../../../reportConfiguration/constants'
import type { Values } from './fields'

export default class PrisonerSummary extends InvolvementSummary {
  protected type = 'prisoners' as const

  protected involvementField = 'prisonersInvolved' as const

  protected involvementDoneField = 'prisonerInvolvementDone' as const

  protected pageTitleBeforeInvolvementDone = 'Do you want to add a prisoner to the report?'

  protected pageTitleOnceInvolvementDone = 'Prisoners involved'

  protected labelOnceInvolvementsExist = 'Do you want to add another prisoner?'

  protected confirmError = 'Select if you would like to add another prisoner to continue'

  protected localsForLookups(): Record<string, unknown> {
    const prisonerInvolvementLookup = Object.fromEntries(
      prisonerInvolvementRoles.map(role => [role.code, role.description]),
    )
    const prisonerOutcomeLookup = Object.fromEntries(
      prisonerInvolvementOutcomes.map(outcome => [outcome.code, outcome.description]),
    )
    return {
      prisonerInvolvementLookup,
      prisonerOutcomeLookup,
    }
  }

  getNextStep(req: FormWizard.Request<Values>, res: express.Response): string {
    if (res.locals.creationJourney) {
      // proceed to adding staff when following create journey
      return `${res.locals.reportSubUrlPrefix}/staff`
    }
    return super.getNextStep(req, res)
  }
}
