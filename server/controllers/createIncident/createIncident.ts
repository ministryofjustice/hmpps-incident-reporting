import type { NextFunction, Response } from 'express'
import type FormWizard from 'hmpo-form-wizard'

import type { CreateReportRequest } from '../../data/incidentReportingApi'
import FormInitialStep from '../base/formInitialStep'

export default class CreateIncident extends FormInitialStep {
  middlewareSetup() {
    super.middlewareSetup()
    this.use(this.setOptions)
  }

  async setOptions(req: FormWizard.Request, res: Response, next: NextFunction) {
    const { prisonApi } = res.locals.apis
    const prisonsLookup = await prisonApi.getPrisons()

    req.form.options.fields.prisonId.items = Object.values(prisonsLookup).map(prison => ({
      value: prison.agencyId,
      text: prison.description,
    }))

    next()
  }

  locals(req: FormWizard.Request, res: Response): object {
    const locals = super.locals(req, res)
    const cancelLink = '/incidents/'

    return {
      ...locals,
      cancelLink,
    }
  }

  async saveValues(req: FormWizard.Request, res: Response, next: NextFunction) {
    try {
      const { incidentType, incidentDate, incidentTime, incidentTitle, incidentDescription } = req.form.values
      const incidentPrisonId = req.form.values.prisonId

      const { incidentReportingApi } = res.locals.apis

      // TODO: add proper date validation to form options; in the meantime assume input is correct
      const [year, month, day] = (incidentDate as string)
        .split('/')
        .map(part => parseInt(part, 10))
        .reverse()
      const [hour, minute] = (incidentTime as string).split(':').map(part => parseInt(part, 10))
      const incidentDateAndTime = new Date(year, month - 1, day, hour, minute)

      const newIncidentData: CreateReportRequest = {
        type: incidentType as string,
        incidentDateAndTime,
        prisonId: incidentPrisonId as string,
        title: incidentTitle as string,
        description: incidentDescription as string,
        createNewEvent: true,
      }

      await incidentReportingApi.createReport(newIncidentData)

      next()
    } catch (error) {
      next(error)
    }
  }

  successHandler(req: FormWizard.Request, res: Response, next: NextFunction) {
    req.journeyModel.reset()
    req.sessionModel.reset()

    /*
    req.flash('success', {
      title: 'Signed operational capacity updated',
      content: `You have updated the establishment's signed operational capacity.`,
    })
    */

    res.redirect('/incidents')
  }
}
