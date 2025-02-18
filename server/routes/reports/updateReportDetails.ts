import express from 'express'
import FormWizard from 'hmpo-form-wizard'

import logger from '../../../logger'
import format from '../../utils/format'
import type { ReportBasic } from '../../data/incidentReportingApi'
import { BaseDetailsController } from './detailsController'
import { type DetailsValues, type DetailsFieldNames, detailsFields, detailsFieldNames } from './detailsFields'
import { logoutIf } from '../../middleware/permissions'
import { populateReport } from '../../middleware/populateReport'
import { cannotEditReport } from './permissions'

class DetailsController extends BaseDetailsController<DetailsValues> {
  // TODO: wizard namespace identifier is shared. consider generating it per request somehow?
  //       otherwise cannot edit 2 pages at once in different windows

  middlewareLocals(): void {
    this.use(this.loadReportIntoSession)
    super.middlewareLocals()
  }

  loadReportIntoSession(
    req: FormWizard.Request<DetailsValues, DetailsFieldNames>,
    res: express.Response,
    next: express.NextFunction,
  ): void {
    const report = res.locals.report as ReportBasic
    const { reportId } = req.params

    // load existing report details into session model to prefill inputs
    req.sessionModel.set('incidentDate', format.shortDate(report.incidentDateAndTime))
    const [hours, minutes] = format.time(report.incidentDateAndTime).split(':')
    req.sessionModel.set('_incidentTime-hours', hours)
    req.sessionModel.set('_incidentTime-minutes', minutes)
    req.sessionModel.set('description', report.description)

    res.locals.cancelUrl = `/reports/${reportId}`
    next()
  }

  getBackLink(_req: FormWizard.Request<DetailsValues, DetailsFieldNames>, res: express.Response): string {
    return res.locals.cancelUrl
  }

  async successHandler(
    req: FormWizard.Request<DetailsValues, DetailsFieldNames>,
    res: express.Response,
    next: express.NextFunction,
  ): Promise<void> {
    const report = res.locals.report as ReportBasic
    const allValues = this.getAllValues(req)

    const { description, incidentDate, incidentTime } = allValues
    const incidentDateAndTime = this.buildIncidentDateAndTime(incidentDate, incidentTime)

    try {
      await res.locals.apis.incidentReportingApi.updateReport(report.id, {
        // TODO: maybe title needs to change, depending on how it's generated
        description,
        incidentDateAndTime,
        updateEvent: true,
      })
      logger.info(`Report ${report.reportReference} details updated`)

      // clear session since report has been saved
      req.journeyModel.reset()

      super.successHandler(req, res, next)
    } catch (e) {
      logger.error(e, `Report ${report.reportReference} details could not be updated: %j`, e)
      const err = this.convertIntoValidationError(e)
      // TODO: find a different way to report whole-form errors rather than attaching to specific field
      this.errorHandler({ incidentDate: err }, req, res, next)
    }
  }

  getNextStep(_req: FormWizard.Request<DetailsValues, DetailsFieldNames>, res: express.Response): string {
    // TODO: does this page have 2 save buttons? where do they both lead?
    return res.locals.cancelUrl
  }
}

const updateDetailsSteps: FormWizard.Steps<DetailsValues> = {
  '/': {
    fields: detailsFieldNames,
    controller: DetailsController,
    entryPoint: true,
    template: 'details',
  },
}

const updateDetailsFields: FormWizard.Fields<DetailsValues> = { ...detailsFields }

const updateDetailsConfig: FormWizard.Config<DetailsValues> = {
  name: 'updateDetails',
  checkSession: false,
  csrf: false,
  templatePath: 'pages/reports',
}

const updateDetailsWizardRouter = FormWizard(updateDetailsSteps, updateDetailsFields, updateDetailsConfig)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore because express types do not mention this property and form wizard does not allow you to pass in config for it's root router
updateDetailsWizardRouter.mergeParams = true
// eslint-disable-next-line import/prefer-default-export
export const updateDetailsRouter = express.Router({ mergeParams: true })
updateDetailsRouter.use(populateReport(false), logoutIf(cannotEditReport), updateDetailsWizardRouter)
