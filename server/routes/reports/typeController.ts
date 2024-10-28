import type FormWizard from 'hmpo-form-wizard'

import { BaseController } from '../../controllers'
import type { TypeFieldNames, TypeValues } from './typeFields'

/**
 * Controller for selecting an incident type for new reports or changing the type for existing reports.
 * Handles error messages only.
 * The generic V parameter is for specifying all steps’ values, not just this one.
 */
// eslint-disable-next-line import/prefer-default-export
export abstract class BaseTypeController<V extends TypeValues> extends BaseController<V, TypeFieldNames> {
  protected errorMessage(error: FormWizard.Error): string {
    if (error.key === 'type') {
      return 'Choose one of the options'
    }
    return super.errorMessage(error)
  }
}
