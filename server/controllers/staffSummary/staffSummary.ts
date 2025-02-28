import type express from 'express'
import type FormWizard from 'hmpo-form-wizard'

import { BaseController } from '../index'
import type { ReportWithDetails } from '../../data/incidentReportingApi'
import { staffInvolvementRoles } from '../../reportConfiguration/constants'
import type { Values } from '../../routes/reports/staff/summary/fields'

export default class StaffSummary extends BaseController<Values> {
  middlewareLocals(): void {
    this.use(this.customiseFields)
    super.middlewareLocals()
  }

  private customiseFields(req: FormWizard.Request<Values>, res: express.Response, next: express.NextFunction): void {
    const report = res.locals.report as ReportWithDetails

    const staffInvolvementDone = report.staffInvolved.length > 0 || report.staffInvolvementDone

    const { fields } = req.form.options

    const customisedFields = { ...fields }
    if (staffInvolvementDone) {
      customisedFields.addStaff = {
        ...customisedFields.addStaff,
        label: 'Do you want to add a member of staff?',
        items: customisedFields.addStaff.items.filter(item => item.value !== 'skip'),
      }
    }
    req.form.options.fields = customisedFields

    res.locals.staffInvolvementDone = staffInvolvementDone

    next()
  }

  getBackLink(_req: FormWizard.Request<Values>, res: express.Response): string {
    const reportId = res.locals.report.id
    return `/reports/${reportId}`
  }

  locals(req: FormWizard.Request<Values>, res: express.Response): Partial<FormWizard.Locals<Values>> {
    const locals = super.locals(req, res)
    const { errors } = res.locals

    if (errors.addStaff) {
      errors.addStaff.message = 'Select if you would like to add another staff member to continue.'
    }

    // Gather notification banner entries if they exist
    const banners = req.flash()

    const staffInvolvementLookup = Object.fromEntries(staffInvolvementRoles.map(role => [role.code, role.description]))

    const pageTitle = res.locals.staffInvolvementDone ? 'Staff involved' : 'Were any staff involved in the incident?'

    return {
      ...locals,
      pageTitle,
      banners,
      staffInvolvementLookup,
      errors,
    }
  }

  render(req: FormWizard.Request<Values>, res: express.Response, next: express.NextFunction): void {
    if (res.locals.staffInvolvementDone) {
      req.form.options.template = 'pages/staff/summary'
    } else {
      req.form.options.template = 'pages/staff/request'
    }

    super.render(req, res, next)
  }

  async successHandler(
    req: FormWizard.Request<Values>,
    res: express.Response,
    _next: express.NextFunction,
  ): Promise<void> {
    const reportId = res.locals.report.id
    const { addStaff } = req.form.values

    req.journeyModel.reset()
    req.sessionModel.reset()

    if (addStaff === 'yes') {
      res.redirect(`/reports/${reportId}/staff/search`)
    } else {
      if (addStaff === 'no') {
        await res.locals.apis.incidentReportingApi.updateReport(reportId, {
          staffInvolvementDone: true,
        })
      }
      res.redirect(`/reports/${reportId}`)
    }
  }
}
