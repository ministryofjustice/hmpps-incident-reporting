import type express from 'express'
import type FormWizard from 'hmpo-form-wizard'

import { BaseController } from '../../../../controllers'
import type { ReportBasic } from '../../../../data/incidentReportingApi'
import type { Values } from './fields'
import logger from '../../../../../logger'
import { prisonReportTransitions } from '../../../../middleware/permissions'

// eslint-disable-next-line import/prefer-default-export
export class RemoveReport extends BaseController<Values> {
  async validate(req: FormWizard.Request<Values>, res: express.Response, next: express.NextFunction): Promise<void> {
    // if (and only if) incidentDate and incidentTime are valid, ensure that the combined date & time is in the past
    const report = res.locals.report as ReportBasic
    const { incidentReportNumber } = req.form.values
    try {
      if (incidentReportNumber === report.reportReference) {
        const error = new this.Error('incidentReportNumber', {
          message: 'Enter a different report number',
          key: `incidentReportNumber`,
        })
        next({ incidentReportNumber: error })
        return
      }
      try {
        await res.locals.apis.incidentReportingApi.getReportByReference(incidentReportNumber)
        logger.info(`Duplicate report incident number ${incidentReportNumber} does belong to a valid report`)
      } catch (e) {
        const error = new this.Error('incidentReportNumber', {
          message: 'Enter a valid incident report number',
          key: `incidentReportNumber`,
        })
        next({ incidentReportNumber: error })
        return
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      /* empty */
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
    if (error.key === 'incidentReportNumber' && (error.type === 'required' || error.type === 'numeric')) {
      return 'Enter a valid incident report number'
    }
    return super.errorMessage(error, req, res)
  }

  locals(req: FormWizard.Request<Values>, res: express.Response): Partial<FormWizard.Locals<Values>> {
    return {
      ...super.locals(req, res),
      pageTitle: `Why do you want to remove this report?`,
      saveButtonText: `Request to remove report`,
    }
  }

  getBackLink(req: FormWizard.Request<Values>, res: express.Response): string {
    res.locals.cancelUrl = res.locals.reportUrl
    return res.locals.reportUrl
  }

  getNextStep(req: FormWizard.Request<Values>, res: express.Response): string {
    return `/reports`
  }

  async saveValues(req: FormWizard.Request<Values>, res: express.Response, next: express.NextFunction): Promise<void> {
    const report = res.locals.report as ReportBasic

    try {
      const { newStatus } = prisonReportTransitions.reportingOfficer[report.status].requestRemoval

      await res.locals.apis.incidentReportingApi.changeReportStatus(report.id, { newStatus })
      // TODO: set report validation=true flag? not supported by api/db yet / ever will be?

      logger.info(`Request to remove report ${report.reportReference} sent`)
      req.flash('success', { title: `Request to remove report ${report.reportReference} sent` })
      res.redirect('/reports')

      // clear session since involvement has been saved
      res.locals.clearSessionOnSuccess = true

      next()
    } catch (e) {
      logger.error(e, `Report ${report.reportReference} status could not be changed: %j`, e)
      const err = this.convertIntoValidationError(e)
      // TODO: find a different way to report whole-form errors rather than attaching to specific field
      this.errorHandler({ incidentReportNumber: err }, req, res, next)
    }
  }
}
