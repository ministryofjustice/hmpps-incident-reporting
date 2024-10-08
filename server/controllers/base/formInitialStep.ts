import { NextFunction, Response } from 'express'
import FormWizard from 'hmpo-form-wizard'

import type { ErrorSummaryItem } from '../../utils/utils'

import { flattenConditionalFields, reduceDependentFields, renderConditionalFields } from '../../helpers/field'
import { FieldEntry } from '../../helpers/field/renderConditionalFields'

export default class FormInitialStep extends FormWizard.Controller {
  middlewareSetup() {
    super.middlewareSetup()
    this.use(this.setupConditionalFields)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getInitialValues(_req: FormWizard.Request, _res: Response): { [key: string]: any } {
    // Override in subclass to return initial values for form
    return {}
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getValues(req: FormWizard.Request, res: Response, callback: (err: any, values?: any) => void) {
    return super.getValues(req, res, (err, values) => {
      if (err) return callback(err)

      const initialValues = this.getInitialValues(req, res)
      const formValues = { ...values }

      Object.keys(initialValues).forEach(fieldName => {
        if (formValues[fieldName] === undefined) {
          formValues[fieldName] = initialValues[fieldName]
        }
      })

      return callback(null, formValues)
    })
  }

  valueOrFieldName(arg: number | { field: string }, fields: FormWizard.Fields) {
    return typeof arg === 'number' ? arg : `the ${fields[arg?.field]?.label?.text?.toLowerCase()}`
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getErrorDetail(error: { args: any; key: string; type: string }, res: Response): ErrorSummaryItem {
    const { fields } = res.locals.options
    const field = fields[error.key]
    const fieldName: string = field.nameForErrors || field?.label?.text
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
      lessThanOrEqualTo: `${fieldName} cannot be more than ${this.valueOrFieldName(error.args?.lessThanOrEqualTo, fields)}`,
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

  renderConditionalFields(req: FormWizard.Request, res: Response) {
    const { options } = req.form

    options.fields = Object.fromEntries(
      Object.entries(options.fields).map(([key, field]: FieldEntry, _, obj: FieldEntry[]) =>
        renderConditionalFields(req, [key, field], obj),
      ),
    )
    res.locals.fields = options.fields
  }

  setupConditionalFields(req: FormWizard.Request, res: Response, next: NextFunction) {
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

  locals(req: FormWizard.Request, res: Response): Partial<FormWizard.Locals> {
    const { options, values } = res.locals
    if (!options?.fields) {
      return {}
    }

    const { allFields } = options
    const fields = this.setupFields(req, allFields, options.fields, values)

    const validationErrors: ErrorSummaryItem[] = []

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    res.locals.errorlist.forEach((error: { args: any; key: string; type: string }) => {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    values: { [field: string]: any },
  ): FormWizard.Fields {
    const fields = originalFields

    Object.keys(fields).forEach(fieldName => {
      const value = values[fieldName]
      fields[fieldName].value = value?.value || value
    })

    return fields
  }

  render(req: FormWizard.Request, res: Response, next: NextFunction) {
    this.renderConditionalFields(req, res)

    return super.render(req, res, next)
  }
}
