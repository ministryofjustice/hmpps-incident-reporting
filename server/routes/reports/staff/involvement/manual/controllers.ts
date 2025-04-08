// eslint-disable-next-line max-classes-per-file
import type express from 'express'
import type FormWizard from 'hmpo-form-wizard'

import { BaseController } from '../../../../../controllers'
import type { AddStaffInvolvementRequest } from '../../../../../data/incidentReportingApi'
import { AddStaffInvolvementController } from '../add'
import type { Values } from './fields'

export class ManualStaffNameController extends BaseController<Values> {
  getBackLink(_req: FormWizard.Request<Values>, res: express.Response): string {
    return `${res.locals.reportSubUrlPrefix}/staff`
  }

  protected errorMessage(error: FormWizard.Error, req: FormWizard.Request<Values>, res: express.Response): string {
    if (error.key === 'firstName') {
      return 'Enter their first name'
    }
    if (error.key === 'lastName') {
      return 'Enter their last name'
    }
    return super.errorMessage(error, req, res)
  }
}

export class AddManualStaffInvolvementController extends AddStaffInvolvementController<Values> {
  protected getStaffMemberName(
    req: FormWizard.Request<Values>,
    _res: express.Response,
  ): { firstName: string; lastName: string } {
    const { firstName, lastName } = this.getAllValues(req, true)
    return { firstName, lastName }
  }

  protected staffMemberPayload(
    req: FormWizard.Request<Values>,
    _res: express.Response,
  ): Pick<AddStaffInvolvementRequest, 'staffUsername' | 'firstName' | 'lastName'> {
    const { firstName, lastName } = this.getAllValues(req, true)
    return {
      staffUsername: null,
      firstName,
      lastName,
    }
  }
}
