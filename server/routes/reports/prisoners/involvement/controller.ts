import type express from 'express'
import type FormWizard from 'hmpo-form-wizard'

import type { PrisonerInvolvementOutcome, PrisonerInvolvementRole } from '../../../../reportConfiguration/constants'
import { BaseController } from '../../../../controllers'
import { convertToTitleCase, nameOfPerson, possessive } from '../../../../utils/utils'
import type { ReportWithDetails } from '../../../../data/incidentReportingApi'
import { populateReportConfiguration } from '../../../../middleware/populateReportConfiguration'
import type { Values } from './fields'

// eslint-disable-next-line import/prefer-default-export
export abstract class PrisonerInvolvementController extends BaseController<Values> {
  middlewareLocals(): void {
    this.router.use(populateReportConfiguration(false))
    this.use(this.customiseFields)
    super.middlewareLocals()
    this.use(this.customisePrisonerRoles)
  }

  private customiseFields(req: FormWizard.Request<Values>, res: express.Response, next: express.NextFunction): void {
    const { fields } = req.form.options
    const report = res.locals.report as ReportWithDetails

    const { firstName } = this.getPrisonerName(res)
    const possessiveFirstName = possessive(convertToTitleCase(firstName))

    const customisedFields = { ...fields }

    // customise labels
    customisedFields.prisonerRole = {
      ...customisedFields.prisonerRole,
      label: `What was ${possessiveFirstName} role?`,
    }
    customisedFields.comment = {
      ...customisedFields.comment,
      label: `Details of ${possessiveFirstName} involvement (optional)`,
    }

    // outcome only exists for reports originally made in NOIMIS
    if (!report.createdInNomis) {
      delete customisedFields.outcome
    }

    req.form.options.fields = customisedFields

    next()
  }

  private customisePrisonerRoles(
    req: FormWizard.Request<Values>,
    res: express.Response,
    next: express.NextFunction,
  ): void {
    const { fields: customisedFields } = req.form.options

    const allowedRoleCodes = this.getAllowedPrisonerRoles(req, res)
    customisedFields.prisonerRole.items = customisedFields.prisonerRole.items.filter(role =>
      allowedRoleCodes.has(role.value),
    )

    if (customisedFields.prisonerRole.items.length === 0) {
      req.flash('error', {
        title: 'No more prisoner roles can be added',
        content: 'You may need to remove an existing person.',
      })
      res.redirect(this.getBackLink(req, res))
      return
    }

    next()
  }

  protected abstract getAllowedPrisonerRoles(req: FormWizard.Request<Values>, res: express.Response): Set<string>

  locals(req: FormWizard.Request<Values>, res: express.Response): Partial<FormWizard.Locals<Values>> {
    return {
      ...super.locals(req, res),
      pageTitle: `${possessive(nameOfPerson(this.getPrisonerName(res)))} involvement in the incident`,
    }
  }

  protected errorMessage(error: FormWizard.Error): string {
    if (error.key === 'prisonerRole') {
      return 'Choose the prisoner’s role'
    }
    if (error.key === 'outcome') {
      return 'Choose the outcome of the prisoner’s involvement'
    }
    return super.errorMessage(error)
  }

  getBackLink(_req: FormWizard.Request<Values>, res: express.Response): string {
    const report = res.locals.report as ReportWithDetails
    return `/reports/${report.id}/prisoners`
  }

  getNextStep(_req: FormWizard.Request<Values>, res: express.Response): string {
    const report = res.locals.report as ReportWithDetails
    return `/reports/${report.id}/prisoners`
  }

  protected abstract getPrisonerName(res: express.Response): { firstName: string; lastName: string }

  /** Turns a *prevalidated* role string into a typed role */
  protected coercePrisonerRole(role: string): PrisonerInvolvementRole {
    return role as PrisonerInvolvementRole
  }

  /** Turns a *prevalidated* outcome string into a typed outcome */
  protected coerceOutcome(outcome: string): PrisonerInvolvementOutcome | null {
    if (!outcome) {
      return null
    }
    return outcome as PrisonerInvolvementOutcome
  }
}
