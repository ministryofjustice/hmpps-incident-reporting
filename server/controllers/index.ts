import type Express from 'express'
import FormWizard from 'hmpo-form-wizard'

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
  protected readonly errorMessages: Record<keyof BaseController['validators'], string> = {
    required: 'This field is required',
    email: 'Enter an email address',
    date: 'Enter a date',
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
}
