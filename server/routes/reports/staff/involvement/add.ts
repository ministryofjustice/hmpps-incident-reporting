import type express from 'express'
import FormWizard from 'hmpo-form-wizard'

import logger from '../../../../../logger'
import type { AddStaffInvolvementRequest, ReportWithDetails } from '../../../../data/incidentReportingApi'
import type { PrisonUser } from '../../../../data/manageUsersApiClient'
import { handleReportEdit } from '../../actions/handleReportEdit'
import { StaffInvolvementController } from './controller'
import { fields, type Values } from './fields'
import { steps } from './steps'
import { fallibleUpdateReportTitle } from '../../../../services/reportTitle'

export class AddStaffInvolvementController<V extends Values = Values> extends StaffInvolvementController<V> {
  protected keyField = 'staffRole' as const

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
    } catch (e) {
      logger.error(e, 'Staff involvement could not be added to report %s: %j', report.id, e)
      this.handleApiError(e, req, res, next)
      return
    }
    // Now look to update the status if necessary
    try {
      await handleReportEdit(res)

      // clear session since report has been saved
      res.locals.clearSessionOnSuccess = true

      next()
    } catch (e) {
      logger.error(e, `Report ${res.locals.report.reportReference} status could not be updated: %j`, e)
      this.handleApiError(e, req, res, next)
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
  journeyName: 'addStaffInvolvement',
  checkSession: false,
  csrf: false,
  template: 'pages/staff/involvement',
  controller: AddStaffInvolvementController,
})
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore because express types do not mention this property and form wizard does not allow you to pass in config for it's root router
addRouter.mergeParams = true
