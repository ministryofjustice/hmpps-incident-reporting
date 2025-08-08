import type express from 'express'
import type FormWizard from 'hmpo-form-wizard'

import logger from '../../../../../logger'
import { BaseController } from '../../../../controllers'
import { type ApiUserType, prisonReportTransitions } from '../../../../middleware/permissions'
import { placeholderForCorrectionRequest } from '../correctionRequestPlaceholder'
import type { Values } from './fields'

export class RequestRemovalController extends BaseController<Values> {
  protected keyField = 'userAction' as const

  async validate(req: FormWizard.Request<Values>, res: express.Response, next: express.NextFunction): Promise<void> {
    const { report } = res.locals

    const { originalReportReference } = req.form.values
    if (originalReportReference) {
      if (originalReportReference === report.reportReference) {
        const error = new this.Error('originalReportReference', {
          message: 'Enter a different report number',
          key: 'originalReportReference',
        })
        next({ originalReportReference: error })
        return
      }
      try {
        await res.locals.apis.incidentReportingApi.getReportByReference(originalReportReference)
        logger.debug(`Original report incident number ${originalReportReference} does belong to a valid report`)
      } catch (e) {
        let errorMessage = 'Incident number could not be looked up, please try again'
        if ('responseStatus' in e && e.responseStatus === 404) {
          logger.debug(`Original report incident number ${originalReportReference} does NOT belong to a valid report`)
          errorMessage = 'Enter a valid incident report number'
        }
        const error = new this.Error('originalReportReference', {
          message: errorMessage,
          key: 'originalReportReference',
        })
        next({ originalReportReference: error })
        return
      }
    }

    super.validate(req, res, next)
  }

  protected errorMessage(error: FormWizard.Error, req: FormWizard.Request<Values>, res: express.Response): string {
    if (error.key === 'userAction' && error.type === 'required') {
      return 'Select why you want to remove this report'
    }
    if (error.key === 'notReportableComment') {
      return 'Describe why incident is not reportable'
    }
    if (error.key === 'originalReportReference' && (error.type === 'required' || error.type === 'numeric')) {
      return 'Enter a valid incident report number'
    }
    return super.errorMessage(error, req, res)
  }

  locals(req: FormWizard.Request<Values>, res: express.Response): Partial<FormWizard.Locals<Values>> {
    return {
      ...super.locals(req, res),
      pageTitle: 'Why do you want to remove this report?',
      saveButtonText: 'Request to remove report',
    }
  }

  getBackLink(_req: FormWizard.Request<Values>, res: express.Response): string {
    res.locals.cancelUrl = res.locals.reportUrl
    return res.locals.reportUrl
  }

  getNextStep(_req: FormWizard.Request<Values>, _res: express.Response): string {
    return '/reports'
  }

  async saveValues(req: FormWizard.Request<Values>, res: express.Response, next: express.NextFunction): Promise<void> {
    const { report, permissions } = res.locals
    const { incidentReportingApi } = res.locals.apis
    const { userType } = permissions

    const formValues = this.getAllValues(req, false)
    const { userAction, originalReportReference, duplicateComment, notReportableComment } = formValues
    const apiUserAction = userAction as 'REQUEST_DUPLICATE' | 'REQUEST_NOT_REPORTABLE' // form validation ensures this is possible
    // TODO: PECS lookup is different
    const transition = prisonReportTransitions[userType][report.status].REQUEST_REMOVAL
    const { newStatus, successBanner } = transition

    try {
      if (transition.postCorrectionRequest) {
        let comment = apiUserAction === 'REQUEST_DUPLICATE' ? duplicateComment : notReportableComment
        if (!comment) {
          if (apiUserAction === 'REQUEST_DUPLICATE') {
            comment = placeholderForCorrectionRequest(apiUserAction, originalReportReference)
          }
          if (apiUserAction === 'REQUEST_NOT_REPORTABLE') {
            // NB: at present, reporting officers are forced to provide a comment so this placeholder won’t appear
            comment = placeholderForCorrectionRequest(apiUserAction)
          }
        }
        await incidentReportingApi.correctionRequests.addToReport(report.id, {
          userType: userType as ApiUserType, // HQ viewer can’t get here
          userAction: apiUserAction,
          descriptionOfChange: comment,
          originalReportReference,
        })
      }

      if (newStatus && newStatus !== report.status) {
        await incidentReportingApi.changeReportStatus(report.id, { newStatus })
      }

      logger.info(`Request to remove report ${report.reportReference} sent`)
      if (successBanner) {
        req.flash('success', { title: successBanner.replace('$reportReference', report.reportReference) })
      }

      // clear session since involvement has been saved
      res.locals.clearSessionOnSuccess = true

      next()
    } catch (e) {
      logger.error(e, `Request to remove report ${report.reportReference} failed: %j`, e)
      this.handleApiError(e, req, res, next)
    }
  }
}
