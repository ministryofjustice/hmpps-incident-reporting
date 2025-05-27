import type express from 'express'
import type FormWizard from 'hmpo-form-wizard'

import { type DetailsValues, type DetailsFieldNames } from './detailsFields'
import { BaseIncidentDateAndTimeController } from './incidentDateAndTimeController'

/**
 * Controller for adding or updating the date and description of an incident report.
 * The generic V parameter is for specifying all steps’ values, not just this one.
 */
// eslint-disable-next-line import/prefer-default-export
export abstract class BaseDetailsController<V extends DetailsValues> extends BaseIncidentDateAndTimeController<V> {
  protected errorMessage(
    error: FormWizard.Error,
    req: FormWizard.Request<V, DetailsFieldNames>,
    res: express.Response,
  ): string {
    if (error.key === 'description') {
      return 'Enter a description of the incident'
    }
    return super.errorMessage(error, req, res)
  }
}
