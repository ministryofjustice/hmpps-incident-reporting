import type express from 'express'
import type FormWizard from 'hmpo-form-wizard'

import { BaseController } from '../index'
import type { ReportWithDetails } from '../../data/incidentReportingApi'
import { prisonerInvolvementOutcomes, prisonerInvolvementRoles } from '../../reportConfiguration/constants'
import type { Values } from '../../routes/reports/prisoners/summary/fields'

export default class PrisonerSummary extends BaseController<Values> {
  getBackLink(_req: FormWizard.Request<Values>, res: express.Response): string {
    const reportId = res.locals.report.id
    return `/reports/${reportId}`
  }

  locals(req: FormWizard.Request<Values>, res: express.Response) {
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
    let showTable = false
    if (report.prisonersInvolved && report.prisonersInvolved.length > 0) {
      showTable = true
    }

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

    return {
      ...locals,
      banners,
      showTable,
      prisonerInvolvementLookup,
      prisonerOutcomeLookup,
      tableHeading,
      errors,
    }
  }

  successHandler(req: FormWizard.Request<Values>, res: express.Response, _next: express.NextFunction) {
    const reportId = res.locals.report.id
    const { addPrisoner } = req.form.values

    req.journeyModel.reset()
    req.sessionModel.reset()

    if (addPrisoner === 'yes') {
      res.redirect(`/reports/${reportId}/prisoner-search`)
    } else {
      res.redirect(`/reports/${reportId}`)
    }
  }
}
