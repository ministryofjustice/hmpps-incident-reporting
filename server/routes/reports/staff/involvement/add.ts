import type express from 'express'
import FormWizard from 'hmpo-form-wizard'

import logger from '../../../../../logger'
import type { AddStaffInvolvementRequest, ReportWithDetails } from '../../../../data/incidentReportingApi'
import type { PrisonUser } from '../../../../data/manageUsersApiClient'
import { StaffInvolvementController } from './controller'
import { fields, type Values } from './fields'
import { steps } from './steps'

export class AddStaffInvolvementController<V extends Values = Values> extends StaffInvolvementController<V> {
  protected getStaffMemberName(
    _req: FormWizard.Request<V>,
    res: express.Response,
  ): { firstName: string; lastName: string } {
    return res.locals.staffMember as PrisonUser
  }

  async saveValues(req: FormWizard.Request<V>, res: express.Response, next: express.NextFunction): Promise<void> {
    const report = res.locals.report as ReportWithDetails
    const allValues = this.getAllValues(req, false)
    try {
      await res.locals.apis.incidentReportingApi.staffInvolved.addToReport(report.id, {
        ...this.staffMemberPayload(req, res),
        staffRole: this.coerceStaffRole(allValues.staffRole),
        comment: allValues.comment ?? '',
      })
      logger.info('Staff involvement added to report %s', report.id)
      // clear session since involvement has been saved
      req.journeyModel.reset()
      next()
    } catch (e) {
      logger.error(e, 'Staff involvement could not be added to report %s: %j', report.id, e)
      const err = this.convertIntoValidationError(e)
      next(err)
    }
  }

  protected staffMemberPayload(
    _req: FormWizard.Request<V>,
    res: express.Response,
  ): Pick<AddStaffInvolvementRequest, 'staffUsername' | 'firstName' | 'lastName'> {
    const staffMember = res.locals.staffMember as PrisonUser
    return {
      staffUsername: staffMember.username,
      firstName: staffMember.firstName,
      lastName: staffMember.lastName,
    }
  }
}

export const addRouter = FormWizard(steps, fields, {
  name: 'addStaffInvolvement',
  checkSession: false,
  csrf: false,
  template: 'pages/staff/involvement',
  controller: AddStaffInvolvementController,
})
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore because express types do not mention this property and form wizard does not allow you to pass in config for it's root router
addRouter.mergeParams = true
