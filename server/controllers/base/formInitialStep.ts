import type Express from 'express'
import FormWizard from 'hmpo-form-wizard'

import type { GovukErrorSummaryItem } from '../../utils/govukFrontend'

import { flattenConditionalFields, reduceDependentFields, renderConditionalFields } from '../../helpers/field'
import type { FieldEntry } from '../../helpers/field/renderConditionalFields'

export default class FormInitialStep extends FormWizard.Controller {
  middlewareSetup() {
    super.middlewareSetup()
    this.use(this.setupConditionalFields)
  }

  getInitialValues(_req: FormWizard.Request, _res: Express.Response): FormWizard.Values {
    // Override in subclass to return initial values for form
    return {}
  }

  getValues(req: FormWizard.Request, res: Express.Response, callback: FormWizard.Callback): void {
    return super.getValues(req, res, (err, values) => {
      if (err) {
        return callback(err)
      }

      const initialValues = this.getInitialValues(req, res)
      const formValues: FormWizard.Values = { ...values }

      Object.keys(initialValues).forEach(fieldName => {
        if (formValues[fieldName] === undefined) {
          formValues[fieldName] = initialValues[fieldName]
        }
      })

      return callback(null, formValues)
    })
  }

  valueOrFieldName(arg: number | { field: string }, fields: FormWizard.Fields) {
    return typeof arg === 'number' ? arg : `the ${fields[arg?.field]?.label?.toLowerCase()}`
  }

  getErrorDetail(error: FormWizard.Error, res: Express.Response): GovukErrorSummaryItem {
    const { fields } = res.locals.options
    const field = fields[error.key]
    const fieldName: string = field.nameForErrors || field?.label
    const errorMessageOverrides = field?.errorMessages || {}

    const errorMessages: Record<string, string> = {
      alphanumeric: `${fieldName} must not contain special characters`,
      dateTodayOrInFuture: `${fieldName} must be today or in the future`,
      dateInvalid: `${fieldName} must be a real date`,
      dateInvalidDay: `${fieldName} must be a real date`,
      dateInvalidMonth: `${fieldName} must be a real date`,
      dateInvalidYear: `${fieldName} must be a real date`,
      dateMissingDay: `${fieldName} must include a day`,
      dateMissingDayAndMonth: `${fieldName} must include a day and month`,
      dateMissingDayAndYear: `${fieldName} must include a day and year`,
      dateMissingMonth: `${fieldName} must include a month`,
      dateMissingMonthAndYear: `${fieldName} must include a month and year`,
      dateMissingYear: `${fieldName} must include a year`,
      lessThanOrEqualTo: `${fieldName} cannot be more than ${this.valueOrFieldName(error.args?.lessThanOrEqualTo as number, fields)}`,
      maxLength: `${fieldName} must be ${error.args?.maxLength} characters or less`,
      minLength: `${fieldName} must be at least ${error.args?.minLength} characters`,
      numericString: `${fieldName} must only include numbers`,
      numeric: `${fieldName} must be a number`,
      required: `Enter a ${fieldName?.toLowerCase()}`,
    }

    const errorMessage = errorMessageOverrides[error.type] || errorMessages[error.type] || `${fieldName} is invalid`
    return {
      text: errorMessage,
      href: `#${field?.id}`,
    }
  }

  renderConditionalFields(req: FormWizard.Request, res: Express.Response): void {
    const { options } = req.form

    options.fields = Object.fromEntries(
      Object.entries(options.fields).map(([key, field]: FieldEntry, _, obj: FieldEntry[]) =>
        renderConditionalFields(req, [key, field], obj),
      ),
    )
    res.locals.fields = options.fields
  }

  setupConditionalFields(req: FormWizard.Request, res: Express.Response, next: Express.NextFunction): void {
    const { options } = req.form

    const stepFieldsArray = Object.entries(options.fields)
    const stepFields = stepFieldsArray.map(flattenConditionalFields)
    const dependentFields = stepFieldsArray.reduce(reduceDependentFields(options.allFields), {})

    options.fields = {
      ...Object.fromEntries(stepFields),
      ...dependentFields,
    }

    next()
  }

  locals(req: FormWizard.Request, res: Express.Response): Partial<FormWizard.Locals> {
    const locals = res.locals as Express.Locals & FormWizard.Locals
    const { options, values } = locals
    if (!options?.fields) {
      return {}
    }

    const { allFields } = options
    const fields = this.setupFields(req, allFields, options.fields, values)

    const validationErrors: GovukErrorSummaryItem[] = []

    locals.errorlist.forEach(error => {
      const errorDetail = this.getErrorDetail(error, res)
      validationErrors.push(errorDetail)
      const field = fields[error.key]
      if (field) {
        fields[error.key].errorMessage = errorDetail
      }
    })

    return {
      fields,
      validationErrors,
    }
  }

  // TODO: remove, it appears unused and FormWizard.Controller.Error constructor ignores `args` and `url`
  //   and it should probably be `new FormInitialStep.Error(…)`
  // formError(fieldName: string, type: string): FormWizard.Error {
  //   return new FormWizard.Controller.Error(fieldName, { args: {}, type, url: '/' })
  // }

  setupFields(
    req: FormWizard.Request,
    allFields: { [field: string]: FormWizard.Field },
    originalFields: FormWizard.Fields,
    values: FormWizard.Values,
  ): FormWizard.Fields {
    const fields = originalFields

    Object.keys(fields).forEach(fieldName => {
      // TODO: how can a value have a value sub-property?
      // const value = values[fieldName]
      // fields[fieldName].value = value?.value || value
      fields[fieldName].value = values[fieldName]
    })

    return fields
  }

  render(req: FormWizard.Request, res: Express.Response, next: Express.NextFunction): void {
    this.renderConditionalFields(req, res)

    return super.render(req, res, next)
  }
}
