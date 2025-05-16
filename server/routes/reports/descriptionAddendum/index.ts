import express from 'express'
import FormWizard from 'hmpo-form-wizard'

import { fields, type Values } from './fields'
import { steps } from './steps'
import { BaseController } from '../../../controllers'
import { populateReport } from '../../../middleware/populateReport'
import { logoutIf } from '../../../middleware/permissions'
import { cannotEditReport } from '../permissions'
import logger from '../../../../logger'
import { ReportWithDetails } from '../../../data/incidentReportingApi'
import { beforeDwStatuses } from '../../../reportConfiguration/constants'

class AddDescriptionAddendumController extends BaseController<Values> {
  middlewareLocals(): void {
    super.middlewareLocals()
    this.use(this.checkReportStatus)
  }

  private checkReportStatus(_req: FormWizard.Request<Values>, res: express.Response, next: express.NextFunction): void {
    /** Check status of report. If DW has not seen report yet, redirect to update details page * */
    const report = res.locals.report as ReportWithDetails
    if (beforeDwStatuses.includes(report.status)) {
      res.redirect(`/reports/${report.id}/update-details`)
    } else {
      next()
    }
  }

  getBackLink(_req: FormWizard.Request<Values>, res: express.Response): string {
    return `${res.locals.reportSubUrlPrefix}`
  }

  async saveValues(req: FormWizard.Request<Values>, res: express.Response, next: express.NextFunction): Promise<void> {
    const report = res.locals.report as ReportWithDetails
    const allValues = this.getAllValues(req, false)
    const userNames = res.locals.user.name.split(' ')

    try {
      await res.locals.apis.incidentReportingApi.descriptionAddendums.addToReport(report.id, {
        firstName: userNames[0],
        lastName: userNames[1],
        text: allValues.descriptionAddendum,
      })
      logger.info('Additional description added to report %s', report.id)

      // clear session since involvement has been saved
      res.locals.clearSessionOnSuccess = true

      req.flash('success', { title: `You have added information to the description` })
      res.redirect(`/reports/${report.id}`)
    } catch (e) {
      logger.error(e, 'Additional description could not be added to report %s: %j', report.id, e)
      const err = this.convertIntoValidationError(e)
      // TODO: find a different way to report whole-form errors rather than attaching to specific field
      this.errorHandler({ descriptionAddendum: err }, req, res, next)
    }
  }
}

const addDescriptionWizardRouter = FormWizard(steps, fields, {
  name: 'descriptionAddendum',
  journeyName: 'descriptionAddendum',
  checkSession: false,
  csrf: false,
  template: 'pages/reports/descriptionAddendum',
  controller: AddDescriptionAddendumController,
})
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore because express types do not mention this property and form wizard does not allow you to pass in config for it's root router
addDescriptionWizardRouter.mergeParams = true
// eslint-disable-next-line import/prefer-default-export
export const addDescriptionRouter = express.Router({ mergeParams: true })
addDescriptionRouter.use(populateReport(true), logoutIf(cannotEditReport), addDescriptionWizardRouter)
