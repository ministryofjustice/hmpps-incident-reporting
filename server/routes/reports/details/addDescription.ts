import express from 'express'
import FormWizard from 'hmpo-form-wizard'

import logger from '../../../../logger'
import { BaseController } from '../../../controllers'
import type { ReportWithDetails } from '../../../data/incidentReportingApi'
import { logoutUnless, canEditReport } from '../../../middleware/permissions'
import { populateReport } from '../../../middleware/populateReport'
import { dwNotReviewed } from '../../../reportConfiguration/constants'
import { type AddDescriptionValues, addDescriptionFields } from './addDescriptionFields'

class AddDescriptionAddendumController extends BaseController<AddDescriptionValues> {
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
    const report = res.locals.report as ReportWithDetails
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
    const report = res.locals.report as ReportWithDetails
    res.locals.usersLookup = await res.locals.apis.userService.getUsers(res.locals.systemToken, [report.reportedBy])
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
    const report = res.locals.report as ReportWithDetails
    const allValues = this.getAllValues(req, false)
    const [firstName, ...lastNames] = res.locals.user.name.split(/\s+/)
    const lastName = lastNames.join(' ')

    try {
      await res.locals.apis.incidentReportingApi.descriptionAddendums.addToReport(report.id, {
        firstName: firstName || 'not specified',
        lastName: lastName || 'not specified',
        text: allValues.descriptionAddendum,
      })
      logger.info('Additional description added to report %s', report.id)

      // clear session since involvement has been saved
      res.locals.clearSessionOnSuccess = true

      req.flash('success', { title: 'You have added information to the description' })

      super.successHandler(req, res, next)
    } catch (e) {
      logger.error(e, 'Additional description could not be added to report %s: %j', report.id, e)
      const err = this.convertIntoValidationError(e)
      // TODO: find a different way to report whole-form errors rather than attaching to specific field
      this.errorHandler({ descriptionAddendum: err }, req, res, next)
    }
  }

  getBackLink(_req: FormWizard.Request<AddDescriptionValues>, res: express.Response): string {
    res.locals.cancelUrl = res.locals.reportUrl
    return res.locals.reportUrl
  }

  getNextStep(_req: FormWizard.Request<AddDescriptionValues>, res: express.Response): string {
    return res.locals.reportUrl
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
// eslint-disable-next-line import/prefer-default-export
export const addDescriptionRouter = express.Router({ mergeParams: true })
addDescriptionRouter.use(populateReport(true), logoutUnless(canEditReport), addDescriptionWizardRouter)
