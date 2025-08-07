import type express from 'express'
import FormWizard from 'hmpo-form-wizard'
import { SanitisedError } from '@ministryofjustice/hmpps-rest-client'

import { parseDateInput, parseTimeInput } from '../utils/parseDateTime'

/**
 * The super-class form wizard controller with functionality that should be shared
 * amongst all forms in this application.
 */
export abstract class BaseController<
  /**
   * The type of all values handled by the form wizard, typically a record with specific field names mapping to strings.
   * Defaults to a record with string keys and string values.
   */
  V extends object = FormWizard.Values,
  /**
   * The keys this particular controller handles and can be a subset of all field names.
   */
  K extends keyof V = keyof V,
> extends FormWizard.Controller<V, K> {
  constructor(options: FormWizard.Options<V, K>) {
    if (!('defaultFormatters' in options)) {
      // eslint-disable-next-line no-param-reassign
      options.defaultFormatters = ['trim']
    }
    super(options)
  }

  // Overriding default method which uses a wildcard path incompatible with express 5
  // TODO: once hmpo-form-wizard supports express 5, remove this method
  useWithMethod(
    method: 'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head',
    ...requestHandlers: FormWizard.RequestHandler<V, K>[]
  ): void {
    if (!this.router) {
      throw new Error('Cannot use middleware outside of middleware mixins')
    }
    const boundRequestHandlers: FormWizard.RequestHandler<V, K>[] = requestHandlers.map(requestHandler =>
      requestHandler.bind(this),
    )
    const boundRouterMethod: (typeof this.router)[typeof method] = this.router[method].bind(this.router)
    boundRouterMethod('{*allPaths}', ...boundRequestHandlers)
  }

  /**
   * Generic human-readable error messages for default form wizard validators.
   */
  private readonly errorMessages: Record<keyof (typeof BaseController)['validators'], string> = {
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
  protected errorMessage(error: FormWizard.Error, _req: FormWizard.Request<V, K>, _res: express.Response): string {
    const errorMessage = this.errorMessages[error.type]
    if (!errorMessage) {
      throw new Error(`Error message not set for type “${error.type}” on controller ${this.constructor.name}`)
    }
    return errorMessage
  }

  /**
   * Adds a human-readable message to errors if they are missing.
   */
  validateField(key: K, req: FormWizard.Request<V, K>, res: express.Response): FormWizard.Error | false | undefined {
    const error = super.validateField(key, req, res)
    if (error && !error.message) {
      error.message = this.errorMessage(error, req, res)
    }
    return error
  }

  /** Name of main form field; used to attach whole-form errors */
  protected keyField: K | undefined = undefined

  /**
   * Convert an API error into a FormWizard.Error so that a message can be presented to users in an error summary
   */
  convertIntoValidationError(_error: SanitisedError, keyField?: K | undefined): FormWizard.Error {
    // TODO: also handle other error types too?
    const fieldName = (keyField ?? this.keyField) as string
    return new this.Error(fieldName, {
      message: 'Sorry, there was a problem with your request',
      field: fieldName,
    })
  }

  /**
   * Handle an API error by converting it into a validation error.
   * Requires `keyField` to be specified to which the error is attached.
   */
  handleApiError(
    error: SanitisedError,
    req: FormWizard.Request<V, K>,
    res: express.Response,
    next: express.NextFunction,
  ): void {
    if (!this.keyField) {
      throw new Error(`keyField must be set on ${this.constructor.name}`)
    }
    const validationError = this.convertIntoValidationError(error)
    const formErrors: FormWizard.Errors = { [this.keyField]: validationError }
    this.errorHandler(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore because type K is too open and includes number and symbol in this generic base controller
      formErrors,
      req,
      res,
      next,
    )
  }

  csrfGenerateSecret(req: FormWizard.Request<V, K>, res: express.Response, next: express.NextFunction): void {
    // copy application middleware CSRF token into form wizard for sanity
    req.sessionModel.set('csrf-secret', res.locals.csrfToken)
    next()
  }

  /**
   * Builds an object of values for all fields and steps from session or, alternatively,
   * from just this step’s request form values.
   * Values for fields with unmet dependencies are discarded.
   * Validation is not performed.
   */
  getAllValues(req: FormWizard.Request<V, K>, fromSession = true): V {
    const { allFields } = req.form.options
    const allValues: V = Object.create({})

    // retrieve all fields’ values including those with dependencies
    // eslint-disable-next-line no-restricted-syntax
    for (const fieldName in allFields) {
      if (Object.hasOwn(allFields, fieldName)) {
        allValues[fieldName] = fromSession
          ? req.sessionModel.get(fieldName)
          : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore not all fieldName will be present in this step
            req.form.values[fieldName]
      }
    }

    // delete values if dependent field not set
    // eslint-disable-next-line no-restricted-syntax
    for (const fieldName in allFields) {
      if (Object.hasOwn(allFields, fieldName)) {
        const field = allFields[fieldName]
        if (
          (typeof field.dependent === 'string' && field.dependent in allValues && allValues[field.dependent as K]) ||
          (typeof field.dependent === 'object' &&
            'field' in field.dependent &&
            field.dependent.field in allValues &&
            allValues[field.dependent.field as K] !== field.dependent.value)
        ) {
          delete allValues[fieldName]
        }
      }
    }

    return allValues
  }

  successHandler(req: FormWizard.Request<V, K>, res: express.Response, next: express.NextFunction): void {
    // optionally, clear the journey from the session as the final action
    // form wizard’s standard `successHandler` will add a history step to the journey model
    // so _here_ is too early to clear the session and the `next` function is never called
    if (res.locals.clearSessionOnSuccess) {
      const actualRedirect = res.redirect.bind(res)
      res.redirect = (...args: unknown[]) => {
        // clear the session just before redirecting
        req.journeyModel.reset()
        actualRedirect(...args)
      }
    }

    super.successHandler(req, res, next)
  }
}

// install application-specific validators
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
