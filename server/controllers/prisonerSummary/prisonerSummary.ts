import type express from 'express'
import { FormWizard } from 'hmpo-form-wizard'

import { BaseController } from '../index'
import type { ReportWithDetails } from '../../data/incidentReportingApi'
import { prisonerInvolvementOutcomes, prisonerInvolvementRoles } from '../../reportConfiguration/constants'

export default class PrisonerSummary extends BaseController {
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

    if (errors.addPrisoner) {
      errors.addPrisoner.message = 'Select if you would like to add another prisoner to continue.'
    }

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
      showTable,
      prisonerInvolvementLookup,
      prisonerOutcomeLookup,
      tableHeading,
      errors,
    }
  }

  successHandler(req: FormWizard.Request, res: express.Response, next: express.NextFunction) {
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
