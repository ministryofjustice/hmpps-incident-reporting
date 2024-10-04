import type { NextFunction, Response } from 'express'
import type FormWizard from 'hmpo-form-wizard'

import type { PrisonerInvolvement } from '../../data/incidentReportingApi'
import {
  prisonerInvolvementOutcomes,
  type PrisonerInvolvementOutcome,
  prisonerInvolvementRoles,
  type PrisonerInvolvementRole,
} from '../../reportConfiguration/constants'
import FormInitialStep from '../base/formInitialStep'

export default class AddPrisoner extends FormInitialStep {
  middlewareSetup() {
    super.middlewareSetup()
    this.use(this.setOptions)
  }

  async setOptions(req: FormWizard.Request, res: Response, next: NextFunction) {
    req.form.options.fields.prisonerRole.items = Object.values(prisonerInvolvementRoles).map(
      ({ code, description }) => ({
        value: code,
        text: description,
      }),
    )

    req.form.options.fields.prisonerOutcome.items = Object.values(prisonerInvolvementOutcomes).map(
      ({ code, description }) => ({
        value: code,
        text: description,
      }),
    )

    next()
  }

  locals(req: FormWizard.Request, res: Response): object {
    const locals = super.locals(req, res)
    const incidentId = res.locals.incident.id
    const cancelLink = `/report/${incidentId}/prisoner-search`

    return {
      ...locals,
      cancelLink,
    }
  }

  async saveValues(req: FormWizard.Request, res: Response, next: NextFunction) {
    try {
      const { prisonerRole, prisonerOutcome, prisonerComment } = req.form.values

      let outcome: PrisonerInvolvementOutcome | null = null
      let comment: string | null = null

      if (prisonerOutcome !== '') {
        outcome = prisonerOutcome as PrisonerInvolvementOutcome
      }
      if (prisonerComment !== '') {
        comment = prisonerComment as string
      }

      const { incidentReportingApi } = res.locals.apis

      const newPrisonerData: PrisonerInvolvement = {
        prisonerNumber: res.locals.prisoner.prisonerNumber as string,
        prisonerRole: prisonerRole as PrisonerInvolvementRole,
        outcome,
        comment,
      }

      await incidentReportingApi.prisonersInvolved.addToReport(res.locals.incident.id, newPrisonerData)

      next()
    } catch (error) {
      next(error)
    }
  }

  successHandler(req: FormWizard.Request, res: Response, next: NextFunction) {
    const incidentId = res.locals.incident.id

    req.journeyModel.reset()
    req.sessionModel.reset()

    /*
    req.flash('success', {
      title: 'Signed operational capacity updated',
      content: `You have updated the establishment's signed operational capacity.`,
    })
    */

    res.redirect(`/report/${incidentId}`)
  }
}
