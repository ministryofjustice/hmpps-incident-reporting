import type express from 'express'
import type FormWizard from 'hmpo-form-wizard'

import logger from '../../../../../logger'
import type { PrisonerInvolvement } from '../../../../data/incidentReportingApi'
import { RemoveInvolvement } from '../../../../controllers/involvements/remove'
import { nameOfPerson } from '../../../../utils/utils'
import type { Values } from './fields'

// eslint-disable-next-line import/prefer-default-export
export class RemovePrisoner extends RemoveInvolvement<PrisonerInvolvement> {
  protected type = 'prisoners' as const

  protected involvementField = 'prisonersInvolved' as const

  protected getInvolvementName(involvement: PrisonerInvolvement): string {
    return `${involvement.prisonerNumber}: ${nameOfPerson(involvement)}`
  }

  protected errorMessage(error: FormWizard.Error): string {
    if (error.key === 'confirmRemove') {
      return 'Select yes if you want to remove the prisoner'
    }
    return super.errorMessage(error)
  }

  protected async deleteInvolvement(req: FormWizard.Request<Values>, res: express.Response): Promise<void> {
    const { reportId, index } = req.params
    const { incidentReportingApi } = res.locals.apis
    const prisonerInvolvement = res.locals.involvement as PrisonerInvolvement

    await incidentReportingApi.prisonersInvolved.deleteFromReport(reportId, parseInt(index, 10))
    logger.info('Prisoner involvement %d removed from report %s', index, reportId)

    req.flash('success', {
      title: `You have removed ${this.getInvolvementName(prisonerInvolvement)}`,
    })
  }
}
