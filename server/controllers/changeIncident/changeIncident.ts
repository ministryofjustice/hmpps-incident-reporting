import { NextFunction, Response } from 'express'
import FormWizard from 'hmpo-form-wizard'
import backUrl from '../../utils/backUrl'
import FormInitialStep from '../base/formInitialStep'
import type { UpdateReportRequest } from '../../data/incidentReportingApi'

export default class ChangeIncident extends FormInitialStep {
  middlewareSetup() {
    super.middlewareSetup()
    this.use(this.setOptions)
  }

  getInitialValues(req: FormWizard.Request, res: Response) {
    return {
      incidentDate: res.locals.incident.incidentDateAndTime.toLocaleString('en-gb', { dateStyle: 'short' }),
      incidentTime: res.locals.incident.incidentDateAndTime.toLocaleString('en', { timeStyle: 'short', hour12: false }),
      prisonId: res.locals.incident.prisonId,
      incidentTitle: res.locals.incident.title,
      incidentDescription: res.locals.incident.description,
    }
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

  validate(req: FormWizard.Request, res: Response, next: NextFunction) {
    const incidentId = res.locals.incident.id
    const { incident } = res.locals
    const formValues = req.form.values

    if (
      formValues.incidentDate === incident.incidentDateAndTime.toLocaleString('en-gb', { dateStyle: 'short' }) &&
      formValues.incidentTime ===
        incident.incidentDateAndTime.toLocaleString('en', { timeStyle: 'short', hour12: false }) &&
      formValues.prisonId === incident.prisonId &&
      formValues.incidentTitle === incident.title &&
      formValues.incidentDescription === incident.description
    ) {
      return res.redirect(
        backUrl(req, {
          fallbackUrl: `/report/${incidentId}`,
        }),
      )
    }

    return next()
  }

  locals(req: FormWizard.Request, res: Response): object {
    const locals = super.locals(req, res)
    const incidentId = res.locals.incident.id

    const backLink = backUrl(req, {
      fallbackUrl: `/report/${incidentId}`,
    })

    return {
      ...locals,
      backLink,
      cancelLink: backLink,
    }
  }

  async saveValues(req: FormWizard.Request, res: Response, next: NextFunction) {
    try {
      const { incidentDate, incidentTime, incidentPrisonId, incidentTitle, incidentDescription } = req.form.values

      const { incidentReportingApi } = res.locals.apis

      // TODO: add proper date validation to form options; in the meantime assume input is correct
      const [year, month, day] = (incidentDate as string)
        .split('/')
        .map(part => parseInt(part, 10))
        .reverse()
      const [hour, minute] = (incidentTime as string).split(':').map(part => parseInt(part, 10))
      const incidentDateAndTime = new Date(year, month - 1, day, hour, minute)

      const updateIncidentData: UpdateReportRequest = {
        incidentDateAndTime,
        prisonId: incidentPrisonId as string,
        title: incidentTitle as string,
        description: incidentDescription as string,
        updateEvent: true,
      }

      await incidentReportingApi.updateReport(res.locals.incident.id, updateIncidentData)

      next()
    } catch (error) {
      next(error)
    }
  }

  successHandler(req: FormWizard.Request, res: Response, next: NextFunction) {
    const incidentId = res.locals.incident.id

    req.journeyModel.reset()
    req.sessionModel.reset()

    /**
    req.flash('success', {
      title: 'Signed operational capacity updated',
      content: `You have updated the establishment's signed operational capacity.`,
    }) */

    res.redirect(`/report/${incidentId}`)
  }
}
