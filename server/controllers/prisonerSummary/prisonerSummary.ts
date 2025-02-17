import type express from 'express'
import type FormWizard from 'hmpo-form-wizard'

import FormInitialStep from '../base/formInitialStep'
import type { ReportWithDetails } from '../../data/incidentReportingApi'
import { prisonerInvolvementOutcomes, prisonerInvolvementRoles } from '../../reportConfiguration/constants'

export default class prisonerSummary extends FormInitialStep {
  middlewareSetup() {
    super.middlewareSetup()
  }

  locals(req: FormWizard.Request, res: express.Response) {
    const locals = super.locals(req, res)
    const reportId = res.locals.report.id
    const report = res.locals.report as ReportWithDetails

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

    const backLink = `/reports/${reportId}`
    return {
      ...locals,
      backLink,
      showTable,
      prisonerInvolvementLookup,
      prisonerOutcomeLookup,
      tableHeading,
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
