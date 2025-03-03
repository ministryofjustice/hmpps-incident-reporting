import type express from 'express'
import { FormWizard } from 'hmpo-form-wizard'

import { nameOfPerson } from '../../utils/utils'
import type { ReportWithDetails } from '../../data/incidentReportingApi'
import { BaseController } from '../index'
import type { Values } from '../../routes/reports/staff/remove/fields'

export default class RemoveStaff extends BaseController<Values> {
  getBackLink(_req: FormWizard.Request<Values>, res: express.Response): string {
    const reportId = res.locals.report.id
    return `/reports/${reportId}/staff`
  }

  locals(req: FormWizard.Request<Values>, res: express.Response): Partial<FormWizard.Locals<Values>> {
    const locals = super.locals(req, res)
    const { errors } = res.locals
    const report = res.locals.report as ReportWithDetails
    const { index } = req.params

    if (errors.removeStaff) {
      errors.removeStaff.message = 'Select if you would like to remove this staff member to continue.'
    }

    const staffToRemove = report.staffInvolved[parseInt(index, 10) - 1]

    return {
      ...locals,
      staffToRemove,
      errors,
    }
  }

  async saveValues(req: FormWizard.Request<Values>, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { removeStaff } = req.form.values

      if (removeStaff === 'yes') {
        const { reportId, index } = req.params
        const { incidentReportingApi } = res.locals.apis
        await incidentReportingApi.staffInvolved.deleteFromReport(reportId, parseInt(index, 10))
      }

      next()
    } catch (error) {
      next(error)
    }
  }

  successHandler(req: FormWizard.Request<Values>, res: express.Response, _next: express.NextFunction): void {
    const { reportId, index } = req.params
    const { removeStaff } = req.form.values
    const report = res.locals.report as ReportWithDetails
    const staffInvolvement = report.staffInvolved[parseInt(index, 10) - 1]

    req.journeyModel.reset()
    req.sessionModel.reset()

    if (removeStaff === 'yes') {
      req.flash('success', {
        title: `You have removed ${nameOfPerson(staffInvolvement)}`,
      })
    }

    res.redirect(`/reports/${reportId}/staff`)
  }
}
