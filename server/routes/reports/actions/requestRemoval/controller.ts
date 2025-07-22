import type express from 'express'
import type FormWizard from 'hmpo-form-wizard'

import logger from '../../../../../logger'
import { BaseController } from '../../../../controllers'
import { prisonReportTransitions } from '../../../../middleware/permissions'
import type { Values } from './fields'

// eslint-disable-next-line import/prefer-default-export
export class RequestRemovalController extends BaseController<Values> {
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        logger.debug(`Original report incident number ${originalReportReference} does NOT belong to a valid report`)
        const error = new this.Error('originalReportReference', {
          message: 'Enter a valid incident report number',
          key: 'originalReportReference',
        })
        next({ originalReportReference: error })
        return
      }
    }

    super.validate(req, res, next)
  }

  protected errorMessage(error: FormWizard.Error, req: FormWizard.Request<Values>, res: express.Response): string {
    if (error.key === 'removeReportMethod' && error.type === 'required') {
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
    const { userType } = permissions

    // TODO: PECS lookup is different
    const { newStatus } = prisonReportTransitions[userType][report.status].requestRemoval

    try {
      // TODO: post comment (ie. correction request) if necessary; use a helper function to create it
      // const { removeReportMethod, originalReportReference, duplicateComment, notReportableComment } = this.getAllValues(req)

      await res.locals.apis.incidentReportingApi.changeReportStatus(report.id, { newStatus })

      logger.info(`Request to remove report ${report.reportReference} sent`)
      req.flash('success', { title: `Request to remove report ${report.reportReference} sent` })

      // clear session since involvement has been saved
      res.locals.clearSessionOnSuccess = true

      next()
    } catch (e) {
      logger.error(e, `Report ${report.reportReference} status could not be changed: %j`, e)
      const err = this.convertIntoValidationError(e)
      // TODO: find a different way to report whole-form errors rather than attaching to specific field
      this.errorHandler({ removeReportMethod: err }, req, res, next)
    }
  }
}
