import type Express from 'express'
import type FormWizard from 'hmpo-form-wizard'

import FormInitialStep from '../base/formInitialStep'

export default class GenericPage3 extends FormInitialStep {
  locals(req: FormWizard.Request, res: Express.Response): object {
    const locals = super.locals(req, res)

    const backLink = '/incidents'
    return {
      ...locals,
      backLink,
      cancelLink: '/incidents',
    }
  }

  /**
  async saveValues(req: FormWizard.Request, res: Express.Response, next: Express.NextFunction) {
    try {
      const { user } = res.locals
      // const { locationsService } = req.services
      const { prisonersInvolved } = req.form.values
      const { staffInvolved } = req.form.values
      const vals = req.form.values
      console.log('Page 2 activated')

      console.log(vals)
      // console.log(prisonersInvolved)
      // console.log(staffInvolved)

      const token = await req.services.authService.getSystemClientToken(user.username)
      await locationsService.updateSignedOperationalCapacity(
        token,
        res.locals.prisonId,
        Number(newSignedOperationalCapacity),
        user.username,
      )

      next()
    } catch (error) {
      next(error)
    }
  }

  successHandler(req: FormWizard.Request, res: Express.Response, next: Express.NextFunction) {
    const { prisonId } = res.locals

    req.journeyModel.reset()
    req.sessionModel.reset()

    req.flash('success', {
      title: 'Signed operational capacity updated',
      content: `You have updated the establishment's signed operational capacity.`,
    })

    res.redirect(`/view-and-update-locations/${prisonId}`)
  }
  */
}
