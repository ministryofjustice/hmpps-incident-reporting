import { NextFunction, Response } from 'express'
import FormWizard from 'hmpo-form-wizard'
import backUrl from '../../utils/backUrl'
import FormInitialStep from '../base/formInitialStep'
import freeTextInput from '../../utils/utils'
import HmppsAuthClient from '../../data/hmppsAuthClient'
import { IncidentReportingApi, type newIncident } from '../../data/incidentReportingApi'
import RedisTokenStore from '../../data/tokenStore/redisTokenStore'
import { createRedisClient } from '../../data/redisClient'

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

  validateFields(req: FormWizard.Request, res: Response, callback: (errors: any) => void) {
    super.validateFields(req, res, errors => {
      //const { values } = req.form

      const validationErrors: any = {}
      /**
      if (!errors.newSignedOperationalCapacity) {
        const { newSignedOperationalCapacity } = values
        if (Number(newSignedOperationalCapacity) > Number(maxCapacity)) {
          validationErrors.newSignedOperationalCapacity = this.formError(
            'newSignedOperationalCapacity',
            'doesNotExceedEstMaxCap',
          )
        }
      }
      */

      callback({ ...errors, ...validationErrors })
    })
  }

  validate(req: FormWizard.Request, res: Response, next: NextFunction) {
    /**
    const { prisonId } = res.locals
    const { newSignedOperationalCapacity } = req.form.values
    const { currentSignedOperationalCapacity } = res.locals
    if (Number(newSignedOperationalCapacity) === Number(currentSignedOperationalCapacity)) {
      return res.redirect(
        backUrl(req, {
          fallbackUrl: `/incidents/`,
        }),
      )
    }
*/
    return next()
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
      const { user } = res.locals
      // const { locationsService } = req.services
      const { incidentType } = req.form.values
      const { incidentDate } = req.form.values
      const { incidentTime } = req.form.values
      const { incidentPrisonId } = req.form.values
      const { incidentTitle } = req.form.values
      const { incidentDescription } = req.form.values

      const hmppsAuthClient = new HmppsAuthClient(new RedisTokenStore(createRedisClient()))
      const systemToken = await hmppsAuthClient.getSystemClientToken(user.username)
      const incidentReportingApi = new IncidentReportingApi(systemToken)

      const tempDate: string[] = (incidentDate as string).split('/').map(String);
      const outDate = `${tempDate[2]}-${tempDate[1]}-${tempDate[0]}`

      const newIncidentData: newIncident = {
        type: incidentType,
        incidentDateAndTime: `${outDate}T${incidentTime}`,
        prisonId: incidentPrisonId,
        title: incidentTitle,
        description: incidentDescription,
        createNewEvent: true,
      }

      await incidentReportingApi.createIncident(newIncidentData)

      next()
    } catch (error) {
      next(error)
    }
  }

  /**
  successHandler(req: FormWizard.Request, res: Response, next: NextFunction) {
    const { prisonId } = res.locals

    req.journeyModel.reset()
    req.sessionModel.reset()

    req.flash('success', {
      title: 'Signed operational capacity updated',
      content: `You have updated the establishment's signed operational capacity.`,
    })

    res.redirect(`/incidents`)
  } */
}
