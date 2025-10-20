import express from 'express'
import FormWizard from 'hmpo-form-wizard'

import logger from '../../../../logger'
import format from '../../../utils/format'
import type { ReportBasic } from '../../../data/incidentReportingApi'
import { logoutUnless, hasPermissionTo } from '../../../middleware/permissions'
import { populateReport } from '../../../middleware/populateReport'
import { dwNotReviewed } from '../../../reportConfiguration/constants'
import { handleReportEdit } from '../actions/handleReportEdit'
import {
  type IncidentDateAndTimeValues,
  hoursFieldName,
  minutesFieldName,
  incidentDateAndTimeFieldNames,
  incidentDateAndTimeFields,
} from './incidentDateAndTimeFields'
import { BaseIncidentDateAndTimeController } from './incidentDateAndTimeController'

class UpdateIncidentDateAndTimeController extends BaseIncidentDateAndTimeController<IncidentDateAndTimeValues> {
  protected keyField = 'incidentDate' as const

  middlewareLocals(): void {
    this.use(this.checkReportStatus)
    this.use(this.loadReportIntoSession)
    super.middlewareLocals()
  }

  private checkReportStatus(
    _req: FormWizard.Request<IncidentDateAndTimeValues>,
    res: express.Response,
    next: express.NextFunction,
  ): void {
    /** Check status of report. If DW has not seen report yet, redirect to update details page */
    const report = res.locals.report as ReportBasic
    if (dwNotReviewed.includes(report.status)) {
      res.redirect(`/reports/${report.id}/update-details`)
    } else {
      next()
    }
  }

  private loadReportIntoSession(
    req: FormWizard.Request<IncidentDateAndTimeValues>,
    res: express.Response,
    next: express.NextFunction,
  ): void {
    const report = res.locals.report as ReportBasic

    // load existing report details into session model to prefill inputs
    req.sessionModel.set('incidentDate', format.shortDate(report.incidentDateAndTime))
    const [hours, minutes] = format.time(report.incidentDateAndTime).split(':')
    req.sessionModel.set(hoursFieldName, hours)
    req.sessionModel.set(minutesFieldName, minutes)

    next()
  }

  async successHandler(
    req: FormWizard.Request<IncidentDateAndTimeValues>,
    res: express.Response,
    next: express.NextFunction,
  ): Promise<void> {
    const report = res.locals.report as ReportBasic
    const allValues = this.getAllValues(req)

    const { incidentDate, incidentTime } = allValues
    const incidentDateAndTime = this.buildIncidentDateAndTime(incidentDate, incidentTime)

    try {
      await res.locals.apis.incidentReportingApi.updateReport(report.id, { incidentDateAndTime })
      logger.info(`Report ${report.reportReference} details updated`)
    } catch (e) {
      logger.error(e, `Report ${report.reportReference} details could not be updated: %j`, e)
      this.handleApiError(e, req, res, next)
      return
    }
    // Now look to update the status if necessary
    try {
      await handleReportEdit(res)

      // clear session since report has been saved
      res.locals.clearSessionOnSuccess = true

      super.successHandler(req, res, next)
    } catch (e) {
      logger.error(e, `Report ${report.reportReference} status could not be updated: %j`, e)
      this.handleApiError(e, req, res, next)
    }
  }

  getBackLink(_req: FormWizard.Request<IncidentDateAndTimeValues>, res: express.Response): string {
    res.locals.cancelUrl = res.locals.reportUrl
    return res.locals.reportUrl
  }

  getNextStep(_req: FormWizard.Request<IncidentDateAndTimeValues>, res: express.Response): string {
    // TODO: does this page have 2 save buttons? where do they both lead?
    return res.locals.reportUrl
  }
}

const updateIncidentDateAndTimeSteps: FormWizard.Steps<IncidentDateAndTimeValues> = {
  '/': {
    fields: incidentDateAndTimeFieldNames,
    controller: UpdateIncidentDateAndTimeController,
    entryPoint: true,
    template: 'update-incident-date-time',
  },
}

const updateIncidentDateAndTimeFields: FormWizard.Fields<IncidentDateAndTimeValues> = { ...incidentDateAndTimeFields }

const updateIncidentDateAndTimeConfig: FormWizard.Config<IncidentDateAndTimeValues> = {
  name: 'updateIncidentDateAndTime',
  journeyName: 'updateIncidentDateAndTime',
  checkSession: false,
  csrf: false,
  templatePath: 'pages/reports',
}

const updateIncidentDateAndTimeWizardRouter = FormWizard(
  updateIncidentDateAndTimeSteps,
  updateIncidentDateAndTimeFields,
  updateIncidentDateAndTimeConfig,
)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore because express types do not mention this property and form wizard does not allow you to pass in config for it's root router
updateIncidentDateAndTimeWizardRouter.mergeParams = true
export const updateIncidentDateAndTimeRouter = express.Router({ mergeParams: true })
updateIncidentDateAndTimeRouter.use(
  populateReport(false),
  logoutUnless(hasPermissionTo('EDIT')),
  updateIncidentDateAndTimeWizardRouter,
)
