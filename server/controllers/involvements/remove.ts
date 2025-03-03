import type express from 'express'
import type FormWizard from 'hmpo-form-wizard'
import { NotFound } from 'http-errors'

import type { ReportWithDetails } from '../../data/incidentReportingApi'
import { BaseController } from '../base'

// eslint-disable-next-line import/prefer-default-export
export abstract class RemoveInvolvement<V extends { confirm: string }> extends BaseController<V> {
  protected abstract involvementKey: 'prisonersInvolved' | 'staffInvolved'

  middlewareLocals(): void {
    this.use(this.chooseInvolvement)
    super.middlewareLocals()
  }

  private chooseInvolvement(req: FormWizard.Request<V>, res: express.Response, next: express.NextFunction): void {
    const index = parseInt(req.params.index, 10)
    if (Number.isNaN(index) || index <= 0 || !/^\d+$/.test(req.params.index)) {
      next(new NotFound('Invalid involvement index'))
      return
    }

    const report = res.locals.report as ReportWithDetails
    const involvement = report[this.involvementKey][index - 1]
    if (!involvement) {
      next(new NotFound('Involvement index out of bounds'))
      return
    }

    res.locals.involvement = involvement
    next()
  }

  protected abstract getSummaryUrl(reportId: string): string

  getBackLink(_req: FormWizard.Request<V>, res: express.Response): string {
    const reportId = res.locals.report.id
    return this.getSummaryUrl(reportId)
  }

  getNextStep(_req: FormWizard.Request<V>, res: express.Response): string {
    const reportId = res.locals.report.id
    return this.getSummaryUrl(reportId)
  }

  async saveValues(req: FormWizard.Request<V>, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { confirm } = req.form.values

      if (confirm === 'yes') {
        await this.deleteInvolvement(req, res)

        // clear session since involvement has been saved
        req.journeyModel.reset()
      }

      next()
    } catch (error) {
      next(error)
    }
  }

  protected abstract deleteInvolvement(req: FormWizard.Request<V>, res: express.Response): Promise<void>
}
