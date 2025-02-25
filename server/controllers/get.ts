import type express from 'express'
import type FormWizard from 'hmpo-form-wizard'
import { MethodNotAllowed } from 'http-errors'

import { BaseController } from './base'

/**
 * The super-class form wizard controller for that support only GET / query string form submission.
 * NB: GET methods are called as normal, but some POST methods are conditionally called first
 * if some fields have been submitted.
 */
// eslint-disable-next-line import/prefer-default-export
export abstract class GetBaseController<
  V extends object = FormWizard.Values,
  K extends keyof V = keyof V,
> extends BaseController<V, K> {
  constructor(options: FormWizard.Options<V, K>) {
    super({
      ...options,
      // turn off CSRF checks as only GET method is permitted
      csrf: false,
    })
  }

  get(req: FormWizard.Request<V, K>, res: express.Response, next: express.NextFunction): void {
    // repurpose GET method to handle form submission first conditionally
    const fieldNames = Object.keys(req.form.options.fields) as K[]

    // always load GET query parameters into values
    req.form.values = Object.fromEntries(
      fieldNames
        .filter(fieldName => fieldName in req.query)
        .map(fieldName => [fieldName, req.query[fieldName as string]]),
    ) as Partial<Pick<V, K>>

    // validate if any fields submitted
    this.setErrors(null, req, res)
    if (fieldNames.some(fieldName => fieldName in req.form.values)) {
      let formSubmitted = false
      this.validateFields(req, res, errors => {
        if (fieldNames.some(fieldName => fieldName in errors)) {
          this.setErrors(errors, req, res)
        } else {
          this.saveValues(req, res, () => {})
          formSubmitted = true
        }
      })
      if (formSubmitted) {
        this.successHandler(req, res, next)
        return
      }
    }

    super.get(req, res, next)
  }

  post(_req: FormWizard.Request<V, K>, _res: express.Response, next: express.NextFunction): void {
    next(new MethodNotAllowed())
  }
}
