import type express from 'express'
import FormWizard from 'hmpo-form-wizard'

import { fields, type Values } from './fields'
import { steps } from './steps'
import { BaseController } from '../../../controllers'
import { populateReport } from '../../../middleware/populateReport'
import { logoutIf } from '../../../middleware/permissions'
import { cannotViewReport } from '../permissions'

class AddDescriptionAddendumController extends BaseController<Values> {
  middlewareLocals(): void {
    this.router.use(logoutIf(cannotViewReport))
    this.router.use(populateReport(true))
    super.middlewareLocals()
  }

  getBackLink(_req: FormWizard.Request<Values>, res: express.Response): string {
    return `${res.locals.reportSubUrlPrefix}`
  }

  /*  async saveValues(req: FormWizard.Request<Values>, res: express.Response, next: express.NextFunction): Promise<void> {
    const report = res.locals.report as ReportWithDetails
    const prisoner = res.locals.prisoner as OffenderSearchResult
    const allValues = this.getAllValues(req, false)
    const userNames = res.locals.user.name.split(" ")

    try {
      await res.locals.apis.incidentReportingApi.descriptionAddendums.addToReport(report.id, {
        firstName: userNames[0],
        lastName: userNames[1],
        text: allValues.descriptionAddendum,
      })
      logger.info('Prisoner involvement added to report %s', report.id)

      // clear session since involvement has been saved
      res.locals.clearSessionOnSuccess = true

      next()
    } catch (e) {
      logger.error(e, 'Prisoner involvement could not be added to report %s: %j', report.id, e)
      const err = this.convertIntoValidationError(e)
      // TODO: find a different way to report whole-form errors rather than attaching to specific field
      this.errorHandler({ prisonerRole: err }, req, res, next)
    }
  } */
}

// eslint-disable-next-line import/prefer-default-export
export const addDescriptionRouter = FormWizard(steps, fields, {
  name: 'descriptionAddendum',
  journeyName: 'descriptionAddendum',
  checkSession: false,
  csrf: false,
  template: 'pages/reports/descriptionAddendum',
  controller: AddDescriptionAddendumController,
})
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore because express types do not mention this property and form wizard does not allow you to pass in config for it's root router
addDescriptionRouter.mergeParams = true
