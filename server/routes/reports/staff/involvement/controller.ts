import type express from 'express'
import type FormWizard from 'hmpo-form-wizard'

import type { StaffInvolvementRole } from '../../../../reportConfiguration/constants'
import { BaseController } from '../../../../controllers'
import { convertToTitleCase, nameOfPerson, possessive } from '../../../../utils/utils'
import type { ReportWithDetails } from '../../../../data/incidentReportingApi'
import type { Values } from './fields'

// eslint-disable-next-line import/prefer-default-export
export abstract class StaffInvolvementController<V extends Values = Values> extends BaseController<V> {
  middlewareLocals(): void {
    this.use(this.customiseFields)
    super.middlewareLocals()
  }

  customiseFields(req: FormWizard.Request<V>, res: express.Response, next: express.NextFunction): void {
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
    return {
      ...super.locals(req, res),
      pageTitle: `${possessive(nameOfPerson(this.getStaffMemberName(req, res)))} involvement in the incident`,
    }
  }

  protected errorMessage(error: FormWizard.Error): string {
    if (error.key === 'staffRole') {
      return 'Choose the staff member’s role'
    }
    return super.errorMessage(error)
  }

  getBackLink(_req: FormWizard.Request<V>, res: express.Response): string {
    const report = res.locals.report as ReportWithDetails
    return `/reports/${report.id}/staff`
  }

  getNextStep(_req: FormWizard.Request<V>, res: express.Response): string {
    const report = res.locals.report as ReportWithDetails
    return `/reports/${report.id}/staff`
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
