import type express from 'express'
import type FormWizard from 'hmpo-form-wizard'

import { InvolvementSummary } from '../../../../controllers/involvements/summary'
import { staffInvolvementRolesDescriptions } from '../../../../reportConfiguration/constants'
import type { Values } from './fields'

export default class StaffSummary extends InvolvementSummary {
  protected type = 'staff' as const

  protected involvementField = 'staffInvolved' as const

  protected involvementDoneField = 'staffInvolvementDone' as const

  protected pageTitleBeforeInvolvementDone = 'Do you want to add a member of staff to the report?'

  protected pageTitleOnceInvolvementDone = 'Staff involved'

  protected labelOnceInvolvementsExist = 'Do you want to add another member of staff?'

  protected confirmError = 'Select if you want to add a member of staff'

  protected confirmErrorOnceInvolvementsExist = 'Select if you want to add another member of staff'

  protected localsForLookups(): Record<string, unknown> {
    return {
      staffInvolvementRolesDescriptions,
    }
  }

  getBackLink(req: FormWizard.Request<Values>, res: express.Response): string {
    if (res.locals.creationJourney) {
      return `${res.locals.reportSubUrlPrefix}/prisoners`
    }
    return super.getBackLink(req, res)
  }

  getNextStep(req: FormWizard.Request<Values>, res: express.Response): string {
    if (res.locals.creationJourney && req.body?.formAction !== 'exit') {
      // proceed to questions section when following create journey
      return `${res.locals.reportSubUrlPrefix}/questions`
    }
    // …or go to report view if user chose to exit
    return super.getNextStep(req, res)
  }
}
