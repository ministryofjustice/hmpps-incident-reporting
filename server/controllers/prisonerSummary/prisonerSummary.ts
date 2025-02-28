import type express from 'express'
import type FormWizard from 'hmpo-form-wizard'

import { BaseController } from '../index'
import type { ReportWithDetails } from '../../data/incidentReportingApi'
import { prisonerInvolvementOutcomes, prisonerInvolvementRoles } from '../../reportConfiguration/constants'
import type { Values } from '../../routes/reports/prisoners/summary/fields'

export default class PrisonerSummary extends BaseController<Values> {
  middlewareLocals(): void {
    this.use(this.customiseFields)
    super.middlewareLocals()
  }

  private customiseFields(req: FormWizard.Request<Values>, res: express.Response, next: express.NextFunction): void {
    const report = res.locals.report as ReportWithDetails

    const prisonerInvolvementDone = report.prisonersInvolved.length > 0 || report.prisonerInvolvementDone

    const { fields } = req.form.options

    const customisedFields = { ...fields }
    if (prisonerInvolvementDone) {
      customisedFields.addPrisoner = {
        ...customisedFields.addPrisoner,
        label: 'Do you want to add a prisoner?',
        items: customisedFields.addPrisoner.items.filter(item => item.value !== 'skip'),
      }
    }
    req.form.options.fields = customisedFields

    res.locals.prisonerInvolvementDone = prisonerInvolvementDone

    next()
  }

  getBackLink(_req: FormWizard.Request<Values>, res: express.Response): string {
    const reportId = res.locals.report.id
    return `/reports/${reportId}`
  }

  locals(req: FormWizard.Request<Values>, res: express.Response): Partial<FormWizard.Locals<Values>> {
    const locals = super.locals(req, res)
    const report = res.locals.report as ReportWithDetails
    const { errors } = res.locals

    if (errors.addPrisoner) {
      errors.addPrisoner.message = 'Select if you would like to add another prisoner to continue.'
    }

    // Gather notification banner entries if they exist
    const banners = req.flash()

    const prisonerInvolvementLookup = Object.fromEntries(
      prisonerInvolvementRoles.map(role => [role.code, role.description]),
    )
    const prisonerOutcomeLookup = Object.fromEntries(
      prisonerInvolvementOutcomes.map(outcome => [outcome.code, outcome.description]),
    )

    let tableHeading = [{}]
    if (report.createdInNomis) {
      tableHeading = [
        { text: 'Prisoner' },
        { text: 'Role' },
        { text: 'Outcome' },
        { text: 'Details' },
        { text: 'Action' },
      ]
    } else {
      tableHeading = [{ text: 'Prisoner' }, { text: 'Role' }, { text: 'Details' }, { text: 'Action' }]
    }

    const pageTitle = res.locals.prisonerInvolvementDone
      ? 'Prisoners involved'
      : 'Were any prisoners involved in the incident?'

    return {
      ...locals,
      pageTitle,
      banners,
      prisonerInvolvementLookup,
      prisonerOutcomeLookup,
      tableHeading,
      errors,
    }
  }

  render(req: FormWizard.Request<Values>, res: express.Response, next: express.NextFunction): void {
    if (res.locals.prisonerInvolvementDone) {
      req.form.options.template = 'pages/prisoners/summary'
    } else {
      req.form.options.template = 'pages/prisoners/request'
    }

    super.render(req, res, next)
  }

  async successHandler(
    req: FormWizard.Request<Values>,
    res: express.Response,
    _next: express.NextFunction,
  ): Promise<void> {
    const reportId = res.locals.report.id
    const { addPrisoner } = req.form.values

    req.journeyModel.reset()
    req.sessionModel.reset()

    if (addPrisoner === 'yes') {
      res.redirect(`/reports/${reportId}/prisoners/search`)
    } else {
      if (addPrisoner === 'no') {
        await res.locals.apis.incidentReportingApi.updateReport(reportId, {
          prisonerInvolvementDone: true,
        })
      }
      res.redirect(`/reports/${reportId}`)
    }
  }
}
