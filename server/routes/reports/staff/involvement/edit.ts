import type express from 'express'
import FormWizard from 'hmpo-form-wizard'
import { NotFound } from 'http-errors'

import logger from '../../../../../logger'
import type { ReportWithDetails, StaffInvolvement } from '../../../../data/incidentReportingApi'
import { StaffInvolvementController } from './controller'
import { fields, type Values } from './fields'
import { steps } from './steps'

class EditStaffInvolvementController extends StaffInvolvementController {
  protected keyField = 'staffRole' as const

  middlewareLocals(): void {
    this.use(this.chooseStaffInvolvement)
    super.middlewareLocals()
  }

  private chooseStaffInvolvement(
    req: FormWizard.Request<Values>,
    res: express.Response,
    next: express.NextFunction,
  ): void {
    const index = parseInt(req.params.index, 10)
    if (Number.isNaN(index) || index <= 0 || !/^\d+$/.test(req.params.index)) {
      next(new NotFound('Invalid staff involvement index'))
      return
    }

    const report = res.locals.report as ReportWithDetails
    const staffInvolvement = report.staffInvolved[index - 1]
    if (!staffInvolvement) {
      next(new NotFound('Staff involvement index out of bounds'))
      return
    }

    res.locals.staffInvolvement = staffInvolvement
    next()
  }

  protected getStaffMemberName(
    _req: FormWizard.Request<Values>,
    res: express.Response,
  ): { firstName: string; lastName: string } {
    return res.locals.staffInvolvement as StaffInvolvement
  }

  getValues(req: FormWizard.Request<Values>, res: express.Response, callback: FormWizard.Callback<Values>): void {
    super.getValues(req, res, (err, values) => {
      if (err) {
        callback(err, values)
        return
      }
      const { staffInvolvement } = res.locals
      const formValues = {
        staffRole: staffInvolvement.staffRole,
        outcome: staffInvolvement.outcome ?? '',
        comment: staffInvolvement.comment,
        ...values,
      }

      callback(null, formValues)
    })
  }

  async saveValues(req: FormWizard.Request<Values>, res: express.Response, next: express.NextFunction): Promise<void> {
    const report = res.locals.report as ReportWithDetails
    const index = parseInt(req.params.index, 10)
    const allValues = this.getAllValues(req, false)
    try {
      await res.locals.apis.incidentReportingApi.staffInvolved.updateForReport(report.id, index, {
        staffRole: this.coerceStaffRole(allValues.staffRole),
        comment: allValues.comment ?? '',
      })
      logger.info('Staff involvement %d updated in report %s', index, report.id)

      // clear session since involvement has been saved
      res.locals.clearSessionOnSuccess = true

      next()
    } catch (e) {
      logger.error(e, 'Staff involvement %d could not be updated in report %s: %j', index, report.id, e)
      this.handleApiError(e, req, res, next)
    }
  }
}

// eslint-disable-next-line import/prefer-default-export
export const editRouter = FormWizard(steps, fields, {
  name: 'editStaffInvolvement',
  journeyName: 'editStaffInvolvement',
  checkSession: false,
  csrf: false,
  template: 'pages/staff/involvement',
  controller: EditStaffInvolvementController,
})
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore because express types do not mention this property and form wizard does not allow you to pass in config for it's root router
editRouter.mergeParams = true
