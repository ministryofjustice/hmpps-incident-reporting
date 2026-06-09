import type express from 'express'
import type FormWizard from 'hmpo-form-wizard'

import logger from '../../../../../logger'
import { BaseController } from '../../../../controllers'
import type { ApiUserType } from '../../../../middleware/permissions'
import { workListMapping } from '../../../../reportConfiguration/constants'
import { placeholderForCorrectionRequest } from '../correctionRequestPlaceholder'
import type { Values } from './fields'
import { missingLocalsError } from '../../../../errors'

export class ReopenController extends BaseController<Values> {
  protected keyField = 'userAction' as const

  middlewareLocals(): void {
    this.use(this.redirectIfStatusIsNotDone)
    super.middlewareLocals()
  }

  private redirectIfStatusIsNotDone(
    _req: FormWizard.Request<Values>,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const { report, reportUrl } = res.locals

    if (!report) {
      next(missingLocalsError('ReopenController#redirectIfStatusIsNotDone()', 'res.locals.report'))
      return
    }
    if (!reportUrl) {
      next(missingLocalsError('ReopenController#redirectIfStatusIsNotDone()', 'res.locals.reportUrl'))
      return
    }

    if (workListMapping.completed.includes(report.status)) {
      // only “completed” reports can be reopened via special page
      next()
    } else {
      // otherwise, the action can be taken from report page (user does have permission to recall)
      res.redirect(reportUrl)
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
    const { report, permissions, possibleTransitions } = res.locals
    const { incidentReportingApi } = res.locals.apis
    const { userType } = permissions

    if (!report) {
      next(missingLocalsError('ReopenController#saveValues()', 'res.locals.report'))
      return
    }
    if (!possibleTransitions) {
      next(missingLocalsError('ReopenController#saveValues()', 'res.locals.possibleTransitions'))
      return
    }

    const userAction = 'RECALL' as const
    // NB: transition is not being used for permissions check; middleware already ensured this is possible
    const transition = possibleTransitions[userAction]
    const newStatus = transition?.newStatus
    const successBanner = transition?.successBanner

    try {
      if (newStatus && newStatus !== report.status) {
        await incidentReportingApi.changeReportStatus(report.id, {
          newStatus,
          correctionRequest: {
            userType: userType as ApiUserType, // HQ viewer can’t get here
            userAction,
            descriptionOfChange: placeholderForCorrectionRequest(userAction),
            originalReportReference: null,
          },
        })
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
      this.handleApiError(e, req, res, next)
    }
  }
}
