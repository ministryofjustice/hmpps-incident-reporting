import express from 'express'
import FormWizard from 'hmpo-form-wizard'

import logger from '../../../../logger'
import { BaseController } from '../../../controllers'
import { logoutUnless, hasPermissionTo } from '../../../middleware/permissions'
import { populateReport } from '../../../middleware/populateReport'
import { dwNotReviewed } from '../../../reportConfiguration/constants'
import { handleReportEdit } from '../actions/handleReportEdit'
import { type AddDescriptionValues, addDescriptionFields } from './addDescriptionFields'
import { missingLocalsError } from '../../../errors'

class AddDescriptionAddendumController extends BaseController<AddDescriptionValues> {
  protected keyField = 'descriptionAddendum' as const

  middlewareLocals(): void {
    super.middlewareLocals()
    this.use(this.checkReportStatus)
    this.use(this.lookupUsers)
  }

  private checkReportStatus(
    _req: FormWizard.Request<AddDescriptionValues>,
    res: express.Response,
    next: express.NextFunction,
  ): void {
    /** Check status of report. If DW has not seen report yet, redirect to update details page */
    const { report } = res.locals

    if (!report) {
      next(missingLocalsError('AddDescriptionAddendumController#checkReportStatus()', 'res.locals.report'))
      return
    }

    if (dwNotReviewed.includes(report.status)) {
      res.redirect(`/reports/${report.id}/update-details`)
    } else {
      next()
    }
  }

  private async lookupUsers(
    _req: FormWizard.Request<AddDescriptionValues>,
    res: express.Response,
    next: express.NextFunction,
  ): Promise<void> {
    const { userService } = res.locals.apis
    const { report, systemToken } = res.locals

    if (!report) {
      next(missingLocalsError('AddDescriptionAddendumController#lookupUsers()', 'res.locals.report'))
      return
    }

    res.locals.usersLookup = await userService.getUsers(systemToken, [report.reportedBy])
    next()
  }

  protected errorMessage(
    error: FormWizard.Error,
    req: FormWizard.Request<AddDescriptionValues>,
    res: express.Response,
  ): string {
    if (error.key === 'descriptionAddendum') {
      return 'Enter some additional information'
    }
    return super.errorMessage(error, req, res)
  }

  async successHandler(
    req: FormWizard.Request<AddDescriptionValues>,
    res: express.Response,
    next: express.NextFunction,
  ): Promise<void> {
    const { incidentReportingApi } = res.locals.apis
    const { report, user } = res.locals

    if (!report) {
      next(missingLocalsError('AddDescriptionAddendumController#successHandler()', 'res.locals.report'))
      return
    }

    const allValues = this.getAllValues(req, false)
    const [firstName, ...lastNames] = (user.name ?? '').split(/\s+/)
    const lastName = lastNames.join(' ')

    try {
      await incidentReportingApi.descriptionAddendums.addToReport(report.id, {
        firstName: firstName || 'not specified',
        lastName: lastName || 'not specified',
        text: allValues.descriptionAddendum,
      })
      logger.info('Additional description added to report %s', report.id)

      req.flash('success', { title: 'You have added information to the description' })
    } catch (e) {
      logger.error(e, 'Additional description could not be added to report %s: %j', report.id, e)
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

  getBackLink(_req: FormWizard.Request<AddDescriptionValues>, res: express.Response): string {
    const { reportUrl } = res.locals

    if (!reportUrl) {
      throw missingLocalsError('AddDescriptionAddendumController#getBackLink()', 'res.locals.reportUrl')
    }

    res.locals.cancelUrl = reportUrl
    return reportUrl
  }

  getNextStep(_req: FormWizard.Request<AddDescriptionValues>, res: express.Response): string {
    const { reportUrl } = res.locals

    if (!reportUrl) {
      throw missingLocalsError('AddDescriptionAddendumController#getNextStep()', 'res.locals.reportUrl')
    }

    return reportUrl
  }
}

const addDescriptionSteps: FormWizard.Steps<AddDescriptionValues> = {
  '/': {
    fields: ['descriptionAddendum'],
    controller: AddDescriptionAddendumController,
    entryPoint: true,
    template: 'descriptionAddendum',
  },
}

const addDescriptionWizardRouter = FormWizard(addDescriptionSteps, addDescriptionFields, {
  name: 'descriptionAddendum',
  journeyName: 'descriptionAddendum',
  checkSession: false,
  csrf: false,
  templatePath: 'pages/reports',
})
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore because express types do not mention this property and form wizard does not allow you to pass in config for it's root router
addDescriptionWizardRouter.mergeParams = true
export const addDescriptionRouter = express.Router({ mergeParams: true })
addDescriptionRouter.use(populateReport(true), logoutUnless(hasPermissionTo('EDIT')), addDescriptionWizardRouter)
