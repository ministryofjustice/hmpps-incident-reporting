import type express from 'express'
import type FormWizard from 'hmpo-form-wizard'

import { BaseController } from '../../../controllers'
import { typeFieldItems, type TypeFieldNames, type TypeValues } from './typeFields'

/**
 * Controller for selecting an incident type for new reports or changing the type for existing reports.
 * Handles error messages only.
 * The generic V parameter is for specifying all steps’ values, not just this one.
 */
export abstract class BaseTypeController<V extends TypeValues> extends BaseController<V, TypeFieldNames> {
  protected keyField = 'type' as const

  middlewareSetup(): void {
    this.use(this.updateTypeFieldItems)

    super.middlewareSetup()
  }

  /**
   * Update the list of active types
   *
   * so that it's up-to-date when old types are retired or new ones are activated
   */
  protected updateTypeFieldItems(
    req: FormWizard.Request<V, TypeFieldNames>,
    _res: express.Response,
    next: express.NextFunction,
  ) {
    req.form.options.fields.type.items = typeFieldItems()

    next()
  }

  protected errorMessage(
    error: FormWizard.Error,
    req: FormWizard.Request<V, TypeFieldNames>,
    res: express.Response,
  ): string {
    if (error.key === 'type') {
      // eslint-disable-next-line no-param-reassign
      error.field = 'type-item'
      return 'Select the incident type'
    }
    return super.errorMessage(error, req, res)
  }
}
