import type Express from 'express'
import FormWizard from 'hmpo-form-wizard'

import { parseDateInput, parseTimeInput } from '../utils/utils'
import { SanitisedError } from '../sanitisedError'

/**
 * The super-class form wizard controller with functionality that should be shared
 * amongst all forms in this application.
 */
// eslint-disable-next-line import/prefer-default-export
export abstract class BaseController<
  V extends object = FormWizard.Values,
  K extends keyof V = keyof V,
> extends FormWizard.Controller<V, K> {
  constructor(options: FormWizard.Options<V, K>) {
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
  validateField(key: K, req: FormWizard.Request<V, K>, res: Express.Response): FormWizard.Error | false | undefined {
    const error = super.validateField(key, req, res)
    if (error && !error.message) {
      error.message = this.errorMessage(error)
    }
    return error
  }

  /**
   * Convert an API error into a FormWizard.Error so that a message can be presented to users in an error summary
   */
  convertIntoValidationError(_error: SanitisedError): FormWizard.Error {
    // TODO: also handle regular errors? need a new function:
    //   isSanitisedError<E extends Error>(e: E) e is SanitisedError {…}
    return new BaseController.Error(null, { message: 'Sorry, there was a problem with your request' })
  }

  csrfGenerateSecret(req: FormWizard.Request<V, K>, res: Express.Response, next: Express.NextFunction): void {
    // copy application middleware CSRF token into form wizard for sanity
    req.sessionModel.set('csrf-secret', res.locals.csrfToken)
    next()
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
