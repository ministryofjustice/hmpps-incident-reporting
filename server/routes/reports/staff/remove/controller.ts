import type express from 'express'
import type FormWizard from 'hmpo-form-wizard'

import logger from '../../../../../logger'
import type { StaffInvolvement } from '../../../../data/incidentReportingApi'
import { RemoveInvolvement } from '../../../../controllers/involvements/remove'
import { nameOfPerson } from '../../../../utils/utils'
import type { Values } from './fields'

// eslint-disable-next-line import/prefer-default-export
export class RemoveStaff extends RemoveInvolvement {
  protected involvementField = 'staffInvolved' as const

  protected getSummaryUrl(reportId: string): string {
    return `/reports/${reportId}/staff`
  }

  protected errorMessage(error: FormWizard.Error): string {
    if (error.key === 'confirmRemove') {
      return 'Select if you would like to remove this staff member to continue'
    }
    return super.errorMessage(error)
  }

  protected async deleteInvolvement(req: FormWizard.Request<Values>, res: express.Response): Promise<void> {
    const { reportId, index } = req.params
    const { incidentReportingApi } = res.locals.apis
    const staffInvolvement = res.locals.involvement as StaffInvolvement

    await incidentReportingApi.staffInvolved.deleteFromReport(reportId, parseInt(index, 10))
    logger.info('Staff involvement %d removed from report %s', index, reportId)

    req.flash('success', {
      title: `You have removed ${nameOfPerson(staffInvolvement)}`,
    })
  }
}
