import { FormWizard } from 'hmpo-form-wizard'
import type express from 'express'
import { BaseController } from '../index'

export default class QuestionsController extends BaseController {
  getBackLink(_req: FormWizard.Request, _res: express.Response): string {
    // TODO: Change to `/reports/` page once we have it
    return '/incidents/'
  }
}
