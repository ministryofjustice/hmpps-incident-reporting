import { NextFunction, Response } from 'express'
import FormWizard from 'hmpo-form-wizard'
import backUrl from '../../utils/backUrl'
import FormInitialStep from '../base/formInitialStep'
import freeTextInput from '../../utils/utils'

export default class TestNewIncidentPage3 extends FormInitialStep {
  middlewareSetup() {
    super.middlewareSetup()
  }

  validateFields(req: FormWizard.Request, res: Response, callback: (errors: any) => void) {
    super.validateFields(req, res, errors => {
      const { values } = req.form

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
      fallbackUrl: '/incidents/involvedParties',
    })

    return {
      ...locals,
      backLink,
      cancelLink: '/incidents',
    }
  }

  async saveValues(req: FormWizard.Request, res: Response, next: NextFunction) {
    try {
      const { user } = res.locals
      // const { locationsService } = req.services
      const { policeInformed } = req.form.values
      console.log('Page 3 activated')

      console.log(policeInformed)
      /**
      const token = await req.services.authService.getSystemClientToken(user.username)
      await locationsService.updateSignedOperationalCapacity(
        token,
        res.locals.prisonId,
        Number(newSignedOperationalCapacity),
        user.username,
      ) */

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

    res.redirect(`/view-and-update-locations/${prisonId}`)
  } */
}
