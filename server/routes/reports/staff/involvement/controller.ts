import type express from 'express'
import type FormWizard from 'hmpo-form-wizard'

import type { StaffInvolvementRole } from '../../../../reportConfiguration/constants'
import { BaseController } from '../../../../controllers'
import { convertToTitleCase, nameOfPerson, possessive } from '../../../../utils/utils'
import type { Values } from './fields'
import { missingLocalsError } from '../../../../errors'

export abstract class StaffInvolvementController<V extends Values = Values> extends BaseController<V> {
  middlewareLocals(): void {
    this.use(this.customiseFields)
    super.middlewareLocals()
  }

  private customiseFields(req: FormWizard.Request<V>, res: express.Response, next: express.NextFunction): void {
    const { fields } = req.form.options

    const staffMemberName = this.getStaffMemberName(req, res)
    const possessiveFirstName = possessive(convertToTitleCase(staffMemberName.firstName))

    const customisedFields = { ...fields }

    customisedFields.staffRole = {
      ...customisedFields.staffRole,
      label: `How was ${nameOfPerson(staffMemberName)} involved in the incident?`,
    }
    customisedFields.comment = {
      ...customisedFields.comment,
      label: `Details of ${possessiveFirstName} involvement (optional)`,
    }

    req.form.options.fields = customisedFields

    next()
  }

  locals(req: FormWizard.Request<V>, res: express.Response): Partial<FormWizard.Locals<V>> {
    const staffMemberName = this.getStaffMemberName(req, res)
    return {
      ...super.locals(req, res),
      pageTitle: `How was ${nameOfPerson(staffMemberName)} involved in the incident?`,
    }
  }

  protected errorMessage(error: FormWizard.Error, req: FormWizard.Request<V>, res: express.Response): string {
    if (error.key === 'staffRole') {
      // eslint-disable-next-line no-param-reassign
      error.field = 'staffRole-item'
      return 'Select how the member of staff was involved in the incident'
    }
    return super.errorMessage(error, req, res)
  }

  getBackLink(_req: FormWizard.Request<V>, res: express.Response): string {
    const { reportSubUrlPrefix } = res.locals

    if (!reportSubUrlPrefix) {
      throw missingLocalsError('StaffInvolvementController#getBackLink()', 'res.locals.reportSubUrlPrefix')
    }

    return `${reportSubUrlPrefix}/staff`
  }

  getNextStep(req: FormWizard.Request<V>, res: express.Response): string {
    const { reportUrl, reportSubUrlPrefix } = res.locals

    if (!reportUrl) {
      throw missingLocalsError('StaffInvolvementController#getNextStep()', 'res.locals.reportUrl')
    }
    if (!reportSubUrlPrefix) {
      throw missingLocalsError('StaffInvolvementController#getNextStep()', 'res.locals.reportSubUrlPrefix')
    }

    // go to report view if user chose to exit
    if (req.body?.formAction === 'exit') {
      return reportUrl
    }
    // …or return to involvements summary
    return `${reportSubUrlPrefix}/staff`
  }

  protected abstract getStaffMemberName(
    req: FormWizard.Request<V>,
    res: express.Response,
  ): { firstName: string; lastName: string }

  /** Turns a *prevalidated* role string into a typed role */
  protected coerceStaffRole(role: string): StaffInvolvementRole {
    return role as StaffInvolvementRole
  }
}
