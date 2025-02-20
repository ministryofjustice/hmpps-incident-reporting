import type express from 'express'
import { FormWizard } from 'hmpo-form-wizard'

import { BaseController } from '../index'

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
    const { prisonerToRemove, errors } = res.locals

    if (errors.removePrisoner) {
      errors.removePrisoner.message = 'Select if you would like to remove this prisoner to continue.'
    }

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
        const { incidentReportingApi } = res.locals.apis
        await incidentReportingApi.prisonersInvolved.deleteFromReport(
          res.locals.report.id,
          res.locals.prisonerToRemove.sequence + 1,
        )
      }

      next()
    } catch (error) {
      next(error)
    }
  }

  successHandler(req: FormWizard.Request, res: express.Response, next: express.NextFunction) {
    const reportId = res.locals.report.id
    const { removePrisoner } = req.form.values
    // const { prisonerNumber, firstName, lastName } = res.locals.personToRemove

    req.journeyModel.reset()
    req.sessionModel.reset()

    // if (removePrisoner === 'yes') {
    //   req.flash('success', {
    //     title: `You have removed ${prisonerNumber}: ${firstName} ${lastName}`,
    //   })
    // }

    res.redirect(`/reports/${reportId}/prisoners`)
  }
}
