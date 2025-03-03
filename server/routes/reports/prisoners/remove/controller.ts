import type express from 'express'
import type FormWizard from 'hmpo-form-wizard'

import type { PrisonerInvolvement } from '../../../../data/incidentReportingApi'
import { RemoveInvolvement } from '../../../../controllers/involvements/remove'
import { nameOfPerson } from '../../../../utils/utils'
import type { Values } from './fields'

// eslint-disable-next-line import/prefer-default-export
export class RemovePrisoner extends RemoveInvolvement<Values> {
  protected involvementKey = 'prisonersInvolved' as const

  protected getSummaryUrl(reportId: string): string {
    return `/reports/${reportId}/prisoners`
  }

  protected errorMessage(error: FormWizard.Error): string {
    if (error.key === 'confirm') {
      return 'Select if you would like to remove this prisoner to continue'
    }
    return super.errorMessage(error)
  }

  protected async deleteInvolvement(req: FormWizard.Request<Values>, res: express.Response): Promise<void> {
    const { reportId, index } = req.params
    const { incidentReportingApi } = res.locals.apis
    const prisonerInvolvement = res.locals.involvement as PrisonerInvolvement

    await incidentReportingApi.prisonersInvolved.deleteFromReport(reportId, parseInt(index, 10))
    req.flash('success', {
      title: `You have removed ${prisonerInvolvement.prisonerNumber}: ${nameOfPerson(prisonerInvolvement)}`,
    })
  }
}
