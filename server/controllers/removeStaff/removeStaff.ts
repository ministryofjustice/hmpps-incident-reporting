import type express from 'express'
import { FormWizard } from 'hmpo-form-wizard'

import { BaseController } from '../index'
import { ReportWithDetails } from '../../data/incidentReportingApi'

export default class RemoveStaff extends BaseController {
  middlewareLocals() {
    super.middlewareLocals()
  }

  getBackLink(_req: FormWizard.Request, res: express.Response): string {
    const reportId = res.locals.report.id
    return `/reports/${reportId}/staff`
  }

  locals(req: FormWizard.Request, res: express.Response) {
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

  async saveValues(req: FormWizard.Request, res: express.Response, next: express.NextFunction) {
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

  successHandler(req: FormWizard.Request, res: express.Response, next: express.NextFunction) {
    const { reportId, index } = req.params
    const { removeStaff } = req.form.values
    const report = res.locals.report as ReportWithDetails
    const { firstName, lastName } = report.staffInvolved[parseInt(index, 10) - 1]

    req.journeyModel.reset()
    req.sessionModel.reset()

    if (removeStaff === 'yes') {
      req.flash('success', {
        title: `You have removed ${firstName} ${lastName}`,
      })
    }

    res.redirect(`/reports/${reportId}/staff`)
  }
}
