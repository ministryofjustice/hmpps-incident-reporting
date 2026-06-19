import type express from 'express'
import type FormWizard from 'hmpo-form-wizard'

import type { PrisonerInvolvementOutcome, PrisonerInvolvementRole } from '../../../../reportConfiguration/constants'
import { BaseController } from '../../../../controllers'
import { convertToTitleCase, nameOfPerson, possessive } from '../../../../utils/utils'
import { populateReportConfiguration } from '../../../../middleware/populateReportConfiguration'
import type { Values } from './fields'
import { missingLocalsError } from '../../../../errors'

export interface AllowedRoleCode {
  prisonerRole: string
  roleInformation?: string
}

export abstract class PrisonerInvolvementController extends BaseController<Values> {
  middlewareLocals(): void {
    this.router.use(populateReportConfiguration(false))
    this.use(this.customiseFields)
    super.middlewareLocals()
    this.use(this.customisePrisonerRoles)
  }

  private customiseFields(req: FormWizard.Request<Values>, res: express.Response, next: express.NextFunction): void {
    const { fields } = req.form.options
    const { report } = res.locals

    if (!report) {
      next(missingLocalsError('PrisonerInvolvementController#customiseFields()', 'res.locals.report'))
      return
    }

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

    // outcome only exists for reports originally made in NOMIS
    if (!report.createdInNomis) {
      // @ts-expect-error - NOMIS involvement has `outcome` field, but not DPS
      // can't quite model the type to work with both formats
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

    const existingItemsMap = new Map(customisedFields.prisonerRole.items?.map(item => [item.value, item]))
    const newItems = []

    for (const code of allowedRoleCodes) {
      const existingItem = existingItemsMap.get(code.prisonerRole)
      if (existingItem) {
        newItems.push({
          value: code.prisonerRole,
          label: existingItem.label,
          hint: code.roleInformation,
        })
      }
    }
    customisedFields.prisonerRole.items = newItems

    if (newItems.length === 0) {
      req.flash('error', {
        title: 'No more prisoner roles can be added',
        content: 'You may need to remove an existing person.',
      })
      res.redirect(this.getBackLink(req, res))
      return
    }

    if (newItems.length === 1) {
      // Only one selectable role: there is nothing to choose, so skip the radio
      // and submit the role automatically as a hidden field. The page then only
      // asks for the optional involvement details.
      customisedFields.prisonerRole = {
        ...customisedFields.prisonerRole,
        component: 'hidden',
        default: newItems[0].value,
      }
    }

    next()
  }

  protected abstract getAllowedPrisonerRoles(
    req: FormWizard.Request<Values>,
    res: express.Response,
  ): Set<AllowedRoleCode>

  locals(req: FormWizard.Request<Values>, res: express.Response): Partial<FormWizard.Locals<Values>> {
    return {
      ...super.locals(req, res),
      pageTitle: `${possessive(nameOfPerson(this.getPrisonerName(res)))} involvement in the incident`,
    }
  }

  protected errorMessage(error: FormWizard.Error, req: FormWizard.Request<Values>, res: express.Response): string {
    if (error.key === 'prisonerRole') {
      // eslint-disable-next-line no-param-reassign
      error.field = 'prisonerRole-item'
      return 'Select the prisoner’s role in the incident'
    }
    if (error.key === 'outcome') {
      return 'Select an outcome for the incident'
    }
    return super.errorMessage(error, req, res)
  }

  getBackLink(_req: FormWizard.Request<Values>, res: express.Response): string {
    const { reportSubUrlPrefix } = res.locals

    if (!reportSubUrlPrefix) {
      throw missingLocalsError('PrisonerInvolvementController#getBackLink()', 'res.locals.reportSubUrlPrefix')
    }

    return `${reportSubUrlPrefix}/prisoners`
  }

  getNextStep(req: FormWizard.Request<Values>, res: express.Response): string {
    const { reportUrl, reportSubUrlPrefix } = res.locals

    if (!reportUrl) {
      throw missingLocalsError('PrisonerInvolvementController#getNextStep()', 'res.locals.reportUrl')
    }
    if (!reportSubUrlPrefix) {
      throw missingLocalsError('PrisonerInvolvementController#getNextStep()', 'res.locals.reportSubUrlPrefix')
    }

    // go to report view if user chose to exit
    if (req.body?.formAction === 'exit') {
      return reportUrl
    }
    // …or return to involvements summary
    return `${reportSubUrlPrefix}/prisoners`
  }

  protected abstract getPrisonerName(res: express.Response): { firstName: string; lastName: string }

  /** Turns a *prevalidated* role string into a typed role */
  protected coercePrisonerRole(role: string): PrisonerInvolvementRole {
    return role as PrisonerInvolvementRole
  }

  /** Turns a *prevalidated* outcome string into a typed outcome */
  protected coerceOutcome(outcome: string): PrisonerInvolvementOutcome | undefined {
    if (!outcome?.trim()) {
      return undefined
    }
    return outcome as PrisonerInvolvementOutcome
  }
}
