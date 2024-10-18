import type Express from 'express'
import FormWizard from 'hmpo-form-wizard'

import { parseDateInput, parseTimeInput } from '../utils/utils'
import { SanitisedError } from '../sanitisedError'

/**
 * The super-class form wizard controller with functionality that should be shared
 * amongst all forms in this application.
 */
// eslint-disable-next-line import/prefer-default-export
export abstract class BaseController extends FormWizard.Controller {
  constructor(options: FormWizard.Options) {
    if (!('defaultFormatters' in options)) {
      // eslint-disable-next-line no-param-reassign
      options.defaultFormatters = ['trim']
    }
    super(options)
  }

  /**
   * Generic human-readable error messages for default form wizard validators.
   */
  protected readonly errorMessages: Record<keyof (typeof BaseController)['validators'], string> = {
    required: 'This field is required',
    email: 'Enter an email address',
    date: 'Enter a date',
    ukDate: 'Enter a date',
    ukTime: 'Enter a time',
    numeric: 'Enter a number',
  }

  /**
   * Turns a form wizard error into a human-readable message.
   * Sub-classes can override this behaviour on a per-field basis by accessing error.field or error.key.
   */
  protected errorMessage(error: FormWizard.Error): string {
    const errorMessage = this.errorMessages[error.type]
    if (!errorMessage) {
      throw new Error(`Error message not set for type “${error.type}” on controller ${this.constructor.name}`)
    }
    return errorMessage
  }

  /**
   * Adds a human-readable message to errors if they are missing.
   */
  validateField(key: string, req: FormWizard.Request, res: Express.Response): FormWizard.Error | false | undefined {
    const error = super.validateField(key, req, res)
    if (error && !error.message) {
      error.message = this.errorMessage(error)
    }
    return error
  }

  /**
   * Convert an API error into a FormWizard.Error
   */
  convertIntoValidationError(error: SanitisedError): FormWizard.Error {
    // TODO: also handle regular errors? need a new function:
    //   isSanitisedError<E extends Error>(e: E) e is SanitisedError {…}
    return new BaseController.Error(null, { message: 'Sorry, there was a problem with your request' })
  }

  csrfGenerateSecret(req: FormWizard.Request, res: Express.Response, next: Express.NextFunction): void {
    // copy application middleware CSRF token into form wizard for sanity
    req.sessionModel.set('csrf-secret', res.locals.csrfToken)
    next()
  }

  /**
   * Builds an object of values for all fields and steps from session or, optionally, from form values.
   * This should only be called when the form is known to be valid.
   */
  protected getAllValues(req: FormWizard.Request, fromSession = true): FormWizard.Values {
    // retrieve all fields’ values from session
    const allValues = Object.fromEntries(
      Object.keys(req.form.options.allFields).map(fieldName => [
        fieldName,
        fromSession ? req.sessionModel.get(fieldName) : req.form.values[fieldName],
      ]),
    )

    // delete conditional values if dependent field not set
    Object.entries(req.form.options.allFields).forEach(([fieldName, field]) => {
      if (
        typeof field.dependent === 'object' &&
        'field' in field.dependent &&
        field.dependent.field in allValues &&
        allValues[field.dependent.field] !== field.dependent.value
      ) {
        delete allValues[fieldName]
      }
    })

    return allValues
  }
}

Object.assign(FormWizard.Controller.validators, {
  ukDate(value: FormWizard.Value): boolean {
    if (value === '') return true
    try {
      return Boolean(parseDateInput(value))
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      return false
    }
  },

  ukTime(value: FormWizard.Value): boolean {
    if (value === '') return true
    try {
      return Boolean(parseTimeInput(value))
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      return false
    }
  },
})
