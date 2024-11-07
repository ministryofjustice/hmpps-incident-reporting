import { FormWizard } from 'hmpo-form-wizard'
import type express from 'express'
import { BaseController } from '../index'

export default class QuestionsController extends BaseController<FormWizard.MultiValues> {
  getBackLink(_req: FormWizard.Request, _res: express.Response): string {
    // TODO: Change to `/reports/` page once we have it
    return '/incidents/'
  }

  middlewareLocals(): void {
    this.use(this.lookupReport)
    super.middlewareLocals()
  }

  async lookupReport(req: FormWizard.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    const { incidentReportingApi } = res.locals.apis
    const reportId = req.params.id

    res.locals.report = await incidentReportingApi.getReportWithDetailsById(reportId)
    next()
  }
}
