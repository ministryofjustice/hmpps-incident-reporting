import type express from 'express'
import type FormWizard from 'hmpo-form-wizard'

import logger from '../../../../../logger'
import { BaseController } from '../../../../controllers'
import { type ApiUserType, prisonReportTransitions } from '../../../../middleware/permissions'
import { workListMapping } from '../../../../reportConfiguration/constants'
import type { Values } from './fields'

// eslint-disable-next-line import/prefer-default-export
export class ReopenController extends BaseController<Values> {
  middlewareLocals(): void {
    this.use(this.redirectIfStatusIsNotDone)
    super.middlewareLocals()
  }

  private redirectIfStatusIsNotDone(
    _req: FormWizard.Request<Values>,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const { report } = res.locals

    if (workListMapping.done.includes(report.status)) {
      // only “Done” reports can be reopened via special page
      next()
    } else {
      // otherwise, the action can be taken from report page (user does have permission to recall)
      res.redirect(res.locals.reportUrl)
    }
  }

  protected errorMessage(error: FormWizard.Error, req: FormWizard.Request<Values>, res: express.Response): string {
    if (error.key === 'userAction') {
      // NB: this will not show in practice
      return 'User action is not valid'
    }
    return super.errorMessage(error, req, res)
  }

  locals(req: FormWizard.Request<Values>, res: express.Response): Partial<FormWizard.Locals<Values>> {
    return {
      ...super.locals(req, res),
      pageTitle: 'Are you sure you want reopen this report?',
      saveButtonText: 'Reopen report',
    }
  }

  getBackLink(_req: FormWizard.Request<Values>, res: express.Response): string {
    res.locals.cancelUrl = res.locals.reportUrl
    return res.locals.reportUrl
  }

  getNextStep(_req: FormWizard.Request<Values>, res: express.Response): string {
    return res.locals.reportUrl
  }

  async saveValues(req: FormWizard.Request<Values>, res: express.Response, next: express.NextFunction): Promise<void> {
    const { report, permissions } = res.locals
    const { incidentReportingApi } = res.locals.apis
    const { userType } = permissions

    const userAction = 'RECALL' as const
    // TODO: PECS lookup is different
    const transition = prisonReportTransitions[userType][report.status][userAction]
    const { newStatus, successBanner } = transition

    try {
      if (transition.postCorrectionRequest) {
        await incidentReportingApi.correctionRequests.addToReport(report.id, {
          userType: userType as ApiUserType, // HQ viewer can’t get here
          userAction,
          descriptionOfChange: '', // TODO: remove once allowed
          originalReportReference: null,
        })
      }

      if (newStatus && newStatus !== report.status) {
        await incidentReportingApi.changeReportStatus(report.id, { newStatus })
      }

      logger.info(`Report ${report.reportReference} reopened to ${newStatus}`)
      if (successBanner) {
        req.flash('success', {
          title: successBanner.replace('$reportReference', report.reportReference).replace('$newStatus', newStatus),
        })
      }

      // clear session since involvement has been saved
      res.locals.clearSessionOnSuccess = true

      next()
    } catch (e) {
      logger.error(e, `Reopening report ${report.reportReference} failed: %j`, e)
      const err = this.convertIntoValidationError(e)
      // TODO: find a different way to report whole-form errors rather than attaching to specific field
      this.errorHandler({ userAction: err }, req, res, next)
    }
  }
}
