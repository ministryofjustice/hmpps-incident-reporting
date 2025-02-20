import type express from 'express'
import type FormWizard from 'hmpo-form-wizard'

import type { StaffInvolvementRole } from '../../../../reportConfiguration/constants'
import { BaseController } from '../../../../controllers'
import { convertToTitleCase, nameOfPerson, possessive } from '../../../../utils/utils'
import type { ReportWithDetails } from '../../../../data/incidentReportingApi'
import type { Values } from './fields'

// eslint-disable-next-line import/prefer-default-export
export abstract class StaffInvolvementController extends BaseController<Values> {
  middlewareLocals(): void {
    this.use(this.customiseFieldLabels)
    super.middlewareLocals()
  }

  customiseFieldLabels(req: FormWizard.Request<Values>, res: express.Response, next: express.NextFunction): void {
    const staffMemberName = this.getStaffMemberName(res)
    const possessiveFirstName = possessive(convertToTitleCase(staffMemberName.firstName))

    const { fields: customisedFields } = req.form.options
    customisedFields.staffRole = {
      ...customisedFields.staffRole,
      label: `How was ${nameOfPerson(staffMemberName)} involved in the incident?`,
    }
    customisedFields.comment = {
      ...customisedFields.comment,
      label: `Details of ${possessiveFirstName} involvement (optional)`,
    }

    next()
  }

  locals(req: FormWizard.Request<Values>, res: express.Response): Partial<FormWizard.Locals<Values>> {
    return {
      ...super.locals(req, res),
      pageTitle: `${possessive(nameOfPerson(this.getStaffMemberName(res)))} involvement in the incident`,
    }
  }

  protected errorMessage(error: FormWizard.Error): string {
    if (error.key === 'staffRole') {
      return 'Chose the staff member’s role'
    }
    return super.errorMessage(error)
  }

  getBackLink(_req: FormWizard.Request<Values>, res: express.Response): string {
    const report = res.locals.report as ReportWithDetails
    return `/reports/${report.id}/staff`
  }

  getNextStep(_req: FormWizard.Request<Values>, res: express.Response): string {
    const report = res.locals.report as ReportWithDetails
    return `/reports/${report.id}/staff`
  }

  protected abstract getStaffMemberName(res: express.Response): { firstName: string; lastName: string }

  /** Turns a *prevalidated* role string into a typed role */
  protected coerceStaffRole(role: string): StaffInvolvementRole {
    return role as StaffInvolvementRole
  }
}
