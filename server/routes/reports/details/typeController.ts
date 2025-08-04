import type express from 'express'
import type FormWizard from 'hmpo-form-wizard'

import { BaseController } from '../../../controllers'
import type { TypeFieldNames, TypeValues } from './typeFields'

/**
 * Controller for selecting an incident type for new reports or changing the type for existing reports.
 * Handles error messages only.
 * The generic V parameter is for specifying all steps’ values, not just this one.
 */
// eslint-disable-next-line import/prefer-default-export
export abstract class BaseTypeController<V extends TypeValues> extends BaseController<V, TypeFieldNames> {
  protected keyField = 'type' as const

  protected errorMessage(
    error: FormWizard.Error,
    req: FormWizard.Request<V, TypeFieldNames>,
    res: express.Response,
  ): string {
    if (error.key === 'type') {
      return 'Select the incident type'
    }
    return super.errorMessage(error, req, res)
  }
}
