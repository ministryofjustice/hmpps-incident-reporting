import { NextFunction, Response } from 'express'
import FormWizard from 'hmpo-form-wizard'
import backUrl from '../../utils/backUrl'
import FormInitialStep from '../base/formInitialStep'
import HmppsAuthClient from '../../data/hmppsAuthClient'
import { IncidentReportingApi, type UpdateIncident } from '../../data/incidentReportingApi'
import RedisTokenStore from '../../data/tokenStore/redisTokenStore'
import { createRedisClient } from '../../data/redisClient'

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
      const { user } = res.locals
      const { incidentDate } = req.form.values
      const { incidentTime } = req.form.values
      const { incidentPrisonId } = req.form.values
      const { incidentTitle } = req.form.values
      const { incidentDescription } = req.form.values

      const { incidentReportingApi } = res.locals.apis

      const tempDate: string[] = (incidentDate as string).split('/').map(String)
      const outDate = `${tempDate[2]}-${tempDate[1]}-${tempDate[0]}`

      const updateIncidentData: UpdateIncident = {
        incidentDateAndTime: `${outDate}T${incidentTime}`,
        prisonId: incidentPrisonId as string,
        title: incidentTitle as string,
        description: incidentDescription as string,
        updateEvent: true,
      }

      await incidentReportingApi.updateIncident(res.locals.incident.id, updateIncidentData)

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
