import type express from 'express'
import type FormWizard from 'hmpo-form-wizard'
import { NotFound } from 'http-errors'

import logger from '../../../logger'
import type { PrisonerInvolvement, ReportWithDetails, StaffInvolvement } from '../../data/incidentReportingApi'
import { handleReportEdit } from '../../routes/reports/actions/handleReportEdit'
import { Values as PrisonersValues } from '../../routes/reports/prisoners/remove/fields'
import { Values as StaffValues } from '../../routes/reports/staff/remove/fields'
import { BaseController } from '../base'

type Values = PrisonersValues | StaffValues

export abstract class RemoveInvolvement<
  I extends PrisonerInvolvement | StaffInvolvement,
> extends BaseController<Values> {
  protected keyField = 'confirmRemove' as const

  /** Used as URL slug */
  protected abstract type: 'prisoners' | 'staff'

  protected abstract involvementField: 'prisonersInvolved' | 'staffInvolved'

  middlewareLocals(): void {
    this.use(this.chooseInvolvement)
    super.middlewareLocals()
  }

  private chooseInvolvement(req: FormWizard.Request<Values>, res: express.Response, next: express.NextFunction): void {
    const index = parseInt(req.params.index, 10)
    if (Number.isNaN(index) || index <= 0 || !/^\d+$/.test(req.params.index)) {
      next(new NotFound('Invalid involvement index'))
      return
    }

    const report = res.locals.report as ReportWithDetails
    const involvement = report[this.involvementField][index - 1] as I
    if (!involvement) {
      next(new NotFound('Involvement index out of bounds'))
      return
    }

    res.locals.involvement = involvement
    res.locals.involvementName = this.getInvolvementName(involvement)

    next()
  }

  protected abstract getInvolvementName(involvement: I): string

  getBackLink(_req: FormWizard.Request<Values>, res: express.Response): string {
    return `${res.locals.reportSubUrlPrefix}/${this.type}`
  }

  getNextStep(req: FormWizard.Request<Values>, res: express.Response): string {
    // go to report view if user chose to exit
    if (req.body?.userAction === 'exit') {
      return res.locals.reportUrl
    }
    // …or return to involvements summary
    return `${res.locals.reportSubUrlPrefix}/${this.type}`
  }

  async saveValues(req: FormWizard.Request<Values>, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { confirmRemove } = req.form.values

      if (confirmRemove === 'yes') {
        await Promise.all([this.deleteInvolvement(req, res), handleReportEdit(res)])

        // clear session since involvement has been saved
        res.locals.clearSessionOnSuccess = true
      }

      next()
    } catch (error) {
      logger.error(error, 'Involvement could not be deleted: %j', error)
      this.handleApiError(error, req, res, next)
    }
  }

  protected abstract deleteInvolvement(req: FormWizard.Request<Values>, res: express.Response): Promise<void>
}
