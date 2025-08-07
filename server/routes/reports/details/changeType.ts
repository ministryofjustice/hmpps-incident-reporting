// eslint-disable-next-line max-classes-per-file
import express from 'express'
import FormWizard from 'hmpo-form-wizard'

import logger from '../../../../logger'
import { BaseController } from '../../../controllers'
import type { ReportBasic } from '../../../data/incidentReportingApi'
import { logoutUnless, hasPermissionTo } from '../../../middleware/permissions'
import { populateReport } from '../../../middleware/populateReport'
import { fallibleUpdateReportTitle } from '../../../services/reportTitle'
import { BaseTypeController } from './typeController'
import { type TypeValues, typeFields, typeFieldNames } from './typeFields'

class ConfirmTypeChangeController extends BaseController<TypeValues> {
  getBackLink(_req: FormWizard.Request<TypeValues>, res: express.Response): string {
    return res.locals.reportUrl
  }
}

class TypeController extends BaseTypeController<TypeValues> {
  // TODO: wizard namespace identifier is shared. consider generating it per request somehow?
  //       otherwise cannot edit 2 pages at once in different windows

  middlewareLocals(): void {
    this.use(this.customiseFields)
    super.middlewareLocals()
  }

  private customiseFields(
    req: FormWizard.Request<TypeValues>,
    res: express.Response,
    next: express.NextFunction,
  ): void {
    const { fields } = req.form.options
    const report = res.locals.report as ReportBasic

    const customisedFields = { ...fields }

    customisedFields.type = {
      ...customisedFields.type,
      items: customisedFields.type.items.filter(type => type.value !== report.type),
    }

    req.form.options.fields = customisedFields

    next()
  }

  async successHandler(
    req: FormWizard.Request<TypeValues>,
    res: express.Response,
    next: express.NextFunction,
  ): Promise<void> {
    const { incidentReportingApi } = res.locals.apis
    const { report } = res.locals
    const { type } = req.form.values

    try {
      await incidentReportingApi.changeReportType(report.id, { newType: type })
      logger.info(`Report ${report.reportReference} type changed to ${type}`)

      fallibleUpdateReportTitle(res) // NB: errors are logged but ignored!

      // clear session since report has been saved
      res.locals.clearSessionOnSuccess = true

      super.successHandler(req, res, next)
    } catch (e) {
      logger.error(e, `Report ${report.reportReference} type could not be changed: %j`, e)
      this.handleApiError(e, req, res, next)
    }
  }

  getBackLink(_req: FormWizard.Request<TypeValues>, res: express.Response): string {
    return res.locals.reportUrl
  }

  getNextStep(_req: FormWizard.Request<TypeValues>, res: express.Response): string {
    // proceed with re-adding prisoners if they chose to continue
    return `/create-report/${res.locals.report.id}/prisoners`
  }
}

const changeTypeSteps: FormWizard.Steps<TypeValues> = {
  '/': {
    entryPoint: true,
    controller: ConfirmTypeChangeController,
    template: 'confirm-type-change',
    next: 'select',
  },
  '/select': {
    fields: typeFieldNames,
    controller: TypeController,
    template: 'type',
  },
}

const changeTypeFields: FormWizard.Fields<TypeValues> = { ...typeFields }

const changeTypeConfig: FormWizard.Config<TypeValues> = {
  name: 'changeType',
  journeyName: 'changeType',
  checkSession: false,
  csrf: false,
  templatePath: 'pages/reports',
}

const changeTypeWizardRouter = FormWizard(changeTypeSteps, changeTypeFields, changeTypeConfig)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore because express types do not mention this property and form wizard does not allow you to pass in config for it's root router
changeTypeWizardRouter.mergeParams = true
export const changeTypeRouter = express.Router({ mergeParams: true })
changeTypeRouter.use(populateReport(true), logoutUnless(hasPermissionTo('EDIT')), changeTypeWizardRouter)
