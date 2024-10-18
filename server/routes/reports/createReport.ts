// eslint-disable-next-line max-classes-per-file
import type Express from 'express'
import FormWizard from 'hmpo-form-wizard'

import logger from '../../../logger'
import { parseDateInput, parseTimeInput } from '../../utils/utils'
import { getTypeDetails, types } from '../../reportConfiguration/constants'
import { BaseController } from '../../controllers'

class CreateReportTypes extends BaseController {
  protected errorMessage(error: FormWizard.Error): string {
    if (error.key === 'type') {
      return 'Choose one of the options'
    }
    return super.errorMessage(error)
  }
}

const hoursFieldName = '_incidentTime-hours'
const minutesFieldName = '_incidentTime-minutes'

class CreateReportDetails extends BaseController {
  configure(req: FormWizard.Request, res: Express.Response, next: Express.NextFunction): void {
    req.form.options.fields[hoursFieldName] = {}
    req.form.options.fields[minutesFieldName] = {}

    super.configure(req, res, next)
  }

  getValues(req: FormWizard.Request, res: Express.Response, callback: FormWizard.Callback): void {
    super.getValues(req, res, (err, values) => {
      if (err) {
        callback(err, values)
        return
      }

      const errorValues = req.sessionModel.get('errorValues')
      const incidentTimeValue = errorValues?.incidentTime ?? values?.incidentTime
      if (incidentTimeValue) {
        const [hours, minutes] = incidentTimeValue.split(':')
        // eslint-disable-next-line no-param-reassign
        values[hoursFieldName] = hours
        // eslint-disable-next-line no-param-reassign
        values[minutesFieldName] = minutes
      }

      callback(null, values)
    })
  }

  process(req: FormWizard.Request, res: Express.Response, next: Express.NextFunction): void {
    const hours = req.form.values[hoursFieldName]
    const minutes = req.form.values[minutesFieldName]
    const digits = /^\d{1,2}$/
    if (digits.test(hours) && digits.test(minutes)) {
      req.form.values.incidentTime = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`
    }

    super.process(req, res, next)
  }

  validate(req: FormWizard.Request, res: Express.Response, next: Express.NextFunction): void {
    // TODO: check combined date & time are in the past
    super.validate(req, res, next)
  }

  protected errorMessage(error: FormWizard.Error): string {
    if (error.key === 'incidentDate') {
      return 'Enter a date'
    }
    if (error.key === 'incidentTime') {
      return 'Enter a time'
    }
    if (error.key === 'description') {
      return 'Enter a description'
    }
    return super.errorMessage(error)
  }

  async successHandler(req: FormWizard.Request, res: Express.Response, next: Express.NextFunction): Promise<void> {
    const allValues = this.getAllValues(req)

    const { type, description, incidentDate, incidentTime } = allValues
    const incidentDateAndTime = parseDateInput(incidentDate)
    const time = parseTimeInput(incidentTime)
    incidentDateAndTime.setHours(time.hours)
    incidentDateAndTime.setMinutes(time.minutes)
    const typeDetails = getTypeDetails(type)
    const title = `Report: ${typeDetails.description.toLowerCase()}`

    try {
      const report = await res.locals.apis.incidentReportingApi.createReport({
        type,
        incidentDateAndTime,
        title,
        description,
        prisonId: 'MDI',
        createNewEvent: true,
      })
      logger.info(`Report ${report.reportReference} created`)
      super.successHandler(req, res, next)
    } catch (e) {
      logger.error(`Report could not be created: ${e}`)
      const err = this.convertIntoValidationError(e)
      super.errorHandler(err, req, res, next)
    }
  }
}

const steps: FormWizard.Steps = {
  '/': {
    entryPoint: true,
    fields: ['type'],
    template: 'types',
    controller: CreateReportTypes,
    backLink: '/',
    next: 'details',
  },
  '/details': {
    fields: ['incidentDate', 'incidentTime', 'description'],
    controller: CreateReportDetails,
  },
}

const fields: FormWizard.Fields = {
  type: {
    label: 'Select incident type',
    validate: ['required'],
    items: types
      .filter(type => type.active)
      .map(type => ({
        text: type.description,
        value: type.code,
      })),
  },
  incidentDate: {
    label: 'Date of incident',
    hint: 'For example, 17/05/2024',
    component: 'date',
    validate: ['required', 'ukDate'],
  },
  incidentTime: {
    label: 'Time',
    hint: 'Use the 24 hour clock. For example, 09 08 or 17 32',
    component: 'time',
    validate: ['required', 'ukTime'],
  },
  description: {
    label: 'Description',
    hint: 'Include enough detail that the description can stand alone as a report',
    component: 'textarea',
    validate: ['required'],
  },
}

const config: FormWizard.Config = {
  name: 'createReport',
  checkSession: false,
  csrf: false,
  templatePath: 'pages/createReport',
}

export default FormWizard(steps, fields, config)
