// eslint-disable-next-line max-classes-per-file
import express from 'express'
import FormWizard from 'hmpo-form-wizard'

import logger from '../../../../logger'
import { pecsRegions } from '../../../data/pecsRegions'
import { logoutUnless } from '../../../middleware/permissions'
import { newReportTitle } from '../../../services/reportTitle'
import { BasePecsRegionController } from './pecsRegionController'
import { BaseDetailsController } from './detailsController'
import { BaseTypeController } from './typeController'
import { type PecsRegionValues, pecsRegionFields, pecsRegionFieldNames } from './pecsRegionFields'
import { type TypeValues, type TypeFieldNames, typeFields, typeFieldNames } from './typeFields'
import { type DetailsValues, type DetailsFieldNames, detailsFields, detailsFieldNames } from './detailsFields'

type CreateReportValues = PecsRegionValues & TypeValues & DetailsValues

class PecsRegionController extends BasePecsRegionController<CreateReportValues> {
  middlewareLocals(): void {
    this.use(logoutUnless(permissions => permissions.canCreatePecsReport))
    super.middlewareLocals()
  }
}

class TypeController extends BaseTypeController<CreateReportValues> {
  middlewareLocals(): void {
    this.use(this.redirectIfPecsRegionMustBeSet)
    super.middlewareLocals()
  }

  getBackLink(req: FormWizard.Request<CreateReportValues, TypeFieldNames>, res: express.Response): string | undefined {
    if (res.locals.permissions.canCreatePecsReport) {
      return this.resolvePath(req.baseUrl, 'pecs')
    }
    return super.getBackLink(req, res)
  }

  redirectIfPecsRegionMustBeSet(
    req: FormWizard.Request<CreateReportValues, TypeFieldNames>,
    res: express.Response,
    next: express.NextFunction,
  ) {
    if (res.locals.permissions.canCreatePecsReport) {
      const allValues = this.getAllValues(req)
      // ensure that data wardens first go to PECS region selection page (because permissions would allow them to go to /create-report directly)
      if (!allValues.pecsRegion) {
        res.redirect('/create-report/pecs')
        return
      }
    }
    next()
  }
}

class DetailsController extends BaseDetailsController<CreateReportValues> {
  async successHandler(
    req: FormWizard.Request<CreateReportValues, DetailsFieldNames>,
    res: express.Response,
    next: express.NextFunction,
  ): Promise<void> {
    const allValues = this.getAllValues(req)

    const { pecsRegion, type, description, incidentDate, incidentTime } = allValues
    const incidentDateAndTime = this.buildIncidentDateAndTime(incidentDate, incidentTime)

    let location: string
    let locationDescription: string
    if (res.locals.permissions.canCreatePecsReport) {
      location = pecsRegion
      locationDescription =
        pecsRegions.find(somePecsRegion => somePecsRegion.code === pecsRegion).description ?? pecsRegion
    } else {
      location = res.locals.user.activeCaseLoad.caseLoadId
      locationDescription = res.locals.user.activeCaseLoad.description
    }

    try {
      const report = await res.locals.apis.incidentReportingApi.createReport({
        type,
        incidentDateAndTime,
        title: newReportTitle(type, locationDescription),
        description,
        location,
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
      this.handleApiError(e, req, res, next)
    }
  }

  getNextStep(
    req: FormWizard.Request<CreateReportValues, DetailsFieldNames>,
    res: express.Response,
  ): string | undefined {
    // if a report was successfully created…
    if (res.locals.createdReport) {
      // …go to report view if user chose to exit
      if (req.body?.formAction === 'exit') {
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
  '/pecs': {
    fields: pecsRegionFieldNames,
    controller: PecsRegionController,
    entryPoint: true,
    template: 'pecs-region',
    backLink: '/',
    next: '.',
  },
  '/details': {
    fields: detailsFieldNames,
    controller: DetailsController,
  },
}

const createReportFields: FormWizard.Fields<CreateReportValues> = {
  ...pecsRegionFields,
  ...typeFields,
  ...detailsFields,
}

const createReportConfig: FormWizard.Config<CreateReportValues> = {
  name: 'createReport',
  journeyName: 'createReport',
  checkSession: false,
  csrf: false,
  templatePath: 'pages/reports',
}

// form wizard that allows creating a prison xor PECS report – it cannot handle a theoretical user that is allowed to do both
export const createReportWizardRouter = FormWizard(createReportSteps, createReportFields, createReportConfig)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore because express types do not mention this property and form wizard does not allow you to pass in config for it's root router
createReportWizardRouter.mergeParams = true
