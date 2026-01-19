import type express from 'express'
import type FormWizard from 'hmpo-form-wizard'

import { InvolvementSummary } from '../../../../controllers/involvements/summary'
import {
  prisonerInvolvementOutcomesDescriptions,
  prisonerInvolvementRolesDescriptions,
} from '../../../../reportConfiguration/constants'
import type { Values } from './fields'

export default class PrisonerSummary extends InvolvementSummary {
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
