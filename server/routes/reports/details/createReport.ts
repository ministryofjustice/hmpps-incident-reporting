// eslint-disable-next-line max-classes-per-file
import express from 'express'
import FormWizard from 'hmpo-form-wizard'

import logger from '../../../../logger'
import { newReportTitle } from '../../../services/reportTitle'
import { BaseDetailsController } from './detailsController'
import { BaseTypeController } from './typeController'
import { type TypeValues, typeFields, typeFieldNames } from './typeFields'
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

    // TODO: it's not possible to create a PECS report
    //       location description is assumed to be active caseload

    try {
      const report = await res.locals.apis.incidentReportingApi.createReport({
        type,
        incidentDateAndTime,
        title: newReportTitle(type, res.locals.user.activeCaseLoad.description),
        description,
        location: res.locals.user.activeCaseLoad.caseLoadId,
        createNewEvent: true,
      })
      logger.info(`Report ${report.reportReference} created`)
      res.locals.createdReport = report
      res.locals.reportUrl = `/reports/${report.id}`
      res.locals.reportSubUrlPrefix = `/create-report/${report.id}`

      // clear session since report has been saved
      res.locals.clearSessionOnSuccess = true

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
      // …go to report view if user chose to exit
      if (req.body.userAction === 'exit') {
        return res.locals.reportUrl
      }

      // …or proceed with adding prisoners if they chose to continue
      return `${res.locals.reportSubUrlPrefix}/prisoners`
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
  journeyName: 'createReport',
  checkSession: false,
  csrf: false,
  templatePath: 'pages/reports',
}

// eslint-disable-next-line import/prefer-default-export
export const createReportWizardRouter = FormWizard(createReportSteps, createReportFields, createReportConfig)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore because express types do not mention this property and form wizard does not allow you to pass in config for it's root router
createReportWizardRouter.mergeParams = true
