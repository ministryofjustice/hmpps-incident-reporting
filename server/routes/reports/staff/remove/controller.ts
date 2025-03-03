import type express from 'express'
import type FormWizard from 'hmpo-form-wizard'

import type { StaffInvolvement } from '../../../../data/incidentReportingApi'
import { RemoveInvolvement } from '../../../../controllers/involvements/remove'
import { nameOfPerson } from '../../../../utils/utils'
import type { Values } from './fields'

// eslint-disable-next-line import/prefer-default-export
export class RemoveStaff extends RemoveInvolvement<Values> {
  protected involvementKey = 'staffInvolved' as const

  protected getSummaryUrl(reportId: string): string {
    return `/reports/${reportId}/staff`
  }

  protected errorMessage(error: FormWizard.Error): string {
    if (error.key === 'confirm') {
      return 'Select if you would like to remove this staff member to continue'
    }
    return super.errorMessage(error)
  }

  protected async deleteInvolvement(req: FormWizard.Request<Values>, res: express.Response): Promise<void> {
    const { reportId, index } = req.params
    const { incidentReportingApi } = res.locals.apis
    const staffInvolvement = res.locals.involvement as StaffInvolvement

    await incidentReportingApi.staffInvolved.deleteFromReport(reportId, parseInt(index, 10))
    req.flash('success', {
      title: `You have removed ${nameOfPerson(staffInvolvement)}`,
    })
  }
}
