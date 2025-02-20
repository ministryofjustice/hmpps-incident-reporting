import type express from 'express'
import { FormWizard } from 'hmpo-form-wizard'

import { BaseController } from '../index'
import type { ReportWithDetails } from '../../data/incidentReportingApi'
import { staffInvolvementRoles } from '../../reportConfiguration/constants'

export default class StaffSummary extends BaseController {
  middlewareLocals() {
    super.middlewareLocals()
  }

  getBackLink(_req: FormWizard.Request, res: express.Response): string {
    const reportId = res.locals.report.id
    return `/reports/${reportId}`
  }

  locals(req: FormWizard.Request, res: express.Response) {
    const locals = super.locals(req, res)
    const report = res.locals.report as ReportWithDetails
    const { errors } = res.locals

    if (errors.addStaff) {
      errors.addStaff.message = 'Select if you would like to add another staff member to continue.'
    }

    const staffInvolvementLookup = Object.fromEntries(staffInvolvementRoles.map(role => [role.code, role.description]))

    let showTable = false
    if (report.staffInvolved && report.staffInvolved.length > 0) {
      showTable = true
    }

    return {
      ...locals,
      showTable,
      staffInvolvementLookup,
      errors,
    }
  }

  successHandler(req: FormWizard.Request, res: express.Response, next: express.NextFunction) {
    const reportId = res.locals.report.id
    const { addStaff } = req.form.values

    req.journeyModel.reset()
    req.sessionModel.reset()

    if (addStaff === 'yes') {
      res.redirect(`/reports/${reportId}`)
    } else {
      res.redirect(`/reports`)
    }
  }
}
