// eslint-disable-next-line max-classes-per-file
import express from 'express'
import FormWizard from 'hmpo-form-wizard'

import logger from '../../../logger'
import type { ReportWithDetails } from '../../data/incidentReportingApi'
import { getTypeDetails } from '../../reportConfiguration/constants'
import { logoutIf } from '../../middleware/permissions'
import { cannotCreateReportInActiveCaseload } from './permissions'
import { BaseTypeController } from './typeController'
import { type TypeValues, typeFields, typeFieldNames } from './typeFields'
import { BaseDetailsController } from './detailsController'
import { type DetailsValues, type DetailsFieldNames, detailsFields, detailsFieldNames } from './detailsFields'

type CreateReportValues = TypeValues & DetailsValues

class TypeController extends BaseTypeController<CreateReportValues> {}

class DetailsController extends BaseDetailsController<CreateReportValues> {
  async successHandler(
    req: FormWizard.Request<CreateReportValues, DetailsFieldNames>,
    res: express.Response,
    next: express.NextFunction,
  ): Promise<void> {
    const allValues = this.getAllValues(req)

    const { type, description, incidentDate, incidentTime } = allValues
    const incidentDateAndTime = this.buildIncidentDateAndTime(incidentDate, incidentTime)
    const typeDetails = getTypeDetails(type)
    // TODO: what should auto-generated title be?
    //       also, move title generator out to reuse in future when changing report type
    const title = `Report: ${typeDetails.description.toLowerCase()}`

    try {
      const report = await res.locals.apis.incidentReportingApi.createReport({
        type,
        incidentDateAndTime,
        title,
        description,
        location: res.locals.user.activeCaseLoad.caseLoadId,
        createNewEvent: true,
      })
      logger.info(`Report ${report.reportReference} created`)
      res.locals.createdReport = report

      // clear session since report has been saved
      req.journeyModel.reset()

      super.successHandler(req, res, next)
    } catch (e) {
      logger.error(e, 'Report could not be created: %j', e)
      const err = this.convertIntoValidationError(e)
      // TODO: find a different way to report whole-form errors rather than attaching to specific field
      this.errorHandler({ incidentDate: err }, req, res, next)
    }
  }

  getNextStep(
    req: FormWizard.Request<CreateReportValues, DetailsFieldNames>,
    res: express.Response,
  ): string | undefined {
    // if a report was successfully created…
    if (res.locals.createdReport) {
      const report: ReportWithDetails = res.locals.createdReport

      // …return to home page is user chose to exit
      if (req.body.submit === 'exit') {
        return '/'
      }

      // …or proceed with filling in the report if they chose to continue
      // TODO: this should go to staff/prisoner involvements once that's designed
      return `/reports/${report.id}`
    }

    // otherwise let form wizard decide where to go next
    return super.getNextStep(req, res)
  }
}

const createReportSteps: FormWizard.Steps<CreateReportValues> = {
  '/': {
    fields: typeFieldNames,
    controller: TypeController,
    entryPoint: true,
    template: 'type',
    backLink: '/',
    next: 'details',
  },
  '/details': {
    fields: detailsFieldNames,
    controller: DetailsController,
  },
}

const createReportFields: FormWizard.Fields<CreateReportValues> = { ...typeFields, ...detailsFields }

const createReportConfig: FormWizard.Config<CreateReportValues> = {
  name: 'createReport',
  checkSession: false,
  csrf: false,
  templatePath: 'pages/reports',
}

const createReportWizardRouter = FormWizard(createReportSteps, createReportFields, createReportConfig)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore because express types do not mention this property and form wizard does not allow you to pass in config for it's root router
createReportWizardRouter.mergeParams = true
// eslint-disable-next-line import/prefer-default-export
export const createReportRouter = express.Router({ mergeParams: true })
createReportRouter.use(logoutIf(cannotCreateReportInActiveCaseload), createReportWizardRouter)
