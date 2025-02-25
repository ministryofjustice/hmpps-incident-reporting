import type express from 'express'
import { FormWizard } from 'hmpo-form-wizard'

import { BaseController } from '../index'
import { ReportWithDetails } from '../../data/incidentReportingApi'

export default class RemovePrisoner extends BaseController {
  middlewareLocals() {
    super.middlewareLocals()
  }

  getBackLink(_req: FormWizard.Request, res: express.Response): string {
    const reportId = res.locals.report.id
    return `/reports/${reportId}/prisoners`
  }

  locals(req: FormWizard.Request, res: express.Response) {
    const locals = super.locals(req, res)
    const { errors } = res.locals
    const report = res.locals.report as ReportWithDetails
    const { index } = req.params

    if (errors.removePrisoner) {
      errors.removePrisoner.message = 'Select if you would like to remove this prisoner to continue.'
    }

    const prisonerToRemove = report.prisonersInvolved[Number(index) - 1]

    return {
      ...locals,
      prisonerToRemove,
      errors,
    }
  }

  async saveValues(req: FormWizard.Request, res: express.Response, next: express.NextFunction) {
    try {
      const { removePrisoner } = req.form.values

      if (removePrisoner === 'yes') {
        const { reportId, index } = req.params
        const { incidentReportingApi } = res.locals.apis
        await incidentReportingApi.prisonersInvolved.deleteFromReport(reportId, Number(index))
      }

      next()
    } catch (error) {
      next(error)
    }
  }

  successHandler(req: FormWizard.Request, res: express.Response, next: express.NextFunction) {
    const { reportId, index } = req.params
    const { removePrisoner } = req.form.values
    const report = res.locals.report as ReportWithDetails
    const { prisonerNumber, firstName, lastName } = report.prisonersInvolved[Number(index) - 1]

    req.journeyModel.reset()
    req.sessionModel.reset()

    if (removePrisoner === 'yes') {
      req.flash('success', {
        title: `You have removed ${prisonerNumber}: ${firstName} ${lastName}`,
      })
    }

    res.redirect(`/reports/${reportId}/prisoners`)
  }
}
