import type express from 'express'
import type FormWizard from 'hmpo-form-wizard'

import logger from '../../../../../logger'
import type { StaffInvolvement } from '../../../../data/incidentReportingApi'
import { RemoveInvolvement } from '../../../../controllers/involvements/remove'
import { nameOfPerson } from '../../../../utils/utils'
import type { Values } from './fields'

// eslint-disable-next-line import/prefer-default-export
export class RemoveStaff extends RemoveInvolvement<StaffInvolvement> {
  protected type = 'staff' as const

  protected involvementField = 'staffInvolved' as const

  protected getInvolvementName(involvement: StaffInvolvement): string {
    return nameOfPerson(involvement)
  }

  protected errorMessage(error: FormWizard.Error, req: FormWizard.Request<Values>, res: express.Response): string {
    if (error.key === 'confirmRemove') {
      return 'Select yes if you want to remove the member of staff'
    }
    return super.errorMessage(error, req, res)
  }

  protected async deleteInvolvement(req: FormWizard.Request<Values>, res: express.Response): Promise<void> {
    const { reportId, index } = req.params
    const { incidentReportingApi } = res.locals.apis
    const staffInvolvement = res.locals.involvement as StaffInvolvement

    await incidentReportingApi.staffInvolved.deleteFromReport(reportId, parseInt(index, 10))
    logger.info('Staff involvement %d removed from report %s', index, reportId)

    req.flash('success', {
      title: `You have removed ${this.getInvolvementName(staffInvolvement)}`,
    })
  }
}
