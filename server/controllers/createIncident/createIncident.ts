import { NextFunction, Response } from 'express'
import FormWizard from 'hmpo-form-wizard'
import backUrl from '../../utils/backUrl'
import FormInitialStep from '../base/formInitialStep'
import { type NewIncident } from '../../data/incidentReportingApi'

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

    const backLink = backUrl(req, {
      fallbackUrl: '/incidents/',
    })

    return {
      ...locals,
      backLink,
      cancelLink: backLink,
    }
  }

  async saveValues(req: FormWizard.Request, res: Response, next: NextFunction) {
    try {
      const { incidentType } = req.form.values
      const { incidentDate } = req.form.values
      const { incidentTime } = req.form.values
      const incidentPrisonId = req.form.values.prisonId
      const { incidentTitle } = req.form.values
      const { incidentDescription } = req.form.values

      const { incidentReportingApi } = res.locals.apis

      const tempDate: string[] = (incidentDate as string).split('/').map(String)
      const outDate = `${tempDate[2]}-${tempDate[1]}-${tempDate[0]}`

      const newIncidentData: NewIncident = {
        type: incidentType as string,
        incidentDateAndTime: `${outDate}T${incidentTime}`,
        prisonId: incidentPrisonId as string,
        title: incidentTitle as string,
        description: incidentDescription as string,
        createNewEvent: true,
      }

      await incidentReportingApi.createIncident(newIncidentData)

      next()
    } catch (error) {
      next(error)
    }
  }

  successHandler(req: FormWizard.Request, res: Response, next: NextFunction) {
    req.journeyModel.reset()
    req.sessionModel.reset()
    /**
    req.flash('success', {
      title: 'Signed operational capacity updated',
      content: `You have updated the establishment's signed operational capacity.`,
    }) */

    res.redirect('/incidents')
  }
}
