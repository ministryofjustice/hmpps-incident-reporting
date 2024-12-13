import type express from 'express'
import type FormWizard from 'hmpo-form-wizard'

import FormInitialStep from '../base/formInitialStep'
import { type PrisonerInvolvement } from '../../data/incidentReportingApi'
import {
  prisonerInvolvementOutcomes,
  type PrisonerInvolvementOutcome,
  prisonerInvolvementRoles,
  type PrisonerInvolvementRole,
} from '../../reportConfiguration/constants'

export default class AddPrisoner extends FormInitialStep {
  middlewareSetup() {
    super.middlewareSetup()
    this.use(this.setOptions)
  }

  async setOptions(req: FormWizard.Request, res: express.Response, next: express.NextFunction) {
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

  locals(req: FormWizard.Request, res: express.Response): object {
    const locals = super.locals(req, res)
    const reportId = res.locals.report.id

    const backLink = `/reports/${reportId}/prisoner-search`
    return {
      ...locals,
      backLink,
      cancelLink: backLink,
    }
  }

  async saveValues(req: FormWizard.Request, res: express.Response, next: express.NextFunction) {
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
        firstName: 'Not',
        lastName: 'Known',
        prisonerRole: prisonerRole as PrisonerInvolvementRole,
        outcome,
        comment,
      }

      await incidentReportingApi.prisonersInvolved.addToReport(res.locals.report.id, newPrisonerData)

      next()
    } catch (error) {
      next(error)
    }
  }

  successHandler(req: FormWizard.Request, res: express.Response, next: express.NextFunction) {
    const reportId = res.locals.report.id

    req.journeyModel.reset()
    req.sessionModel.reset()

    /**
    req.flash('success', {
      title: 'Signed operational capacity updated',
      content: `You have updated the establishment's signed operational capacity.`,
    })
    */

    res.redirect(`/reports/${reportId}`)
  }
}
