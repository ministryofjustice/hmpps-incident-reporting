// eslint-disable-next-line max-classes-per-file
import type Express from 'express'
import FormWizard from 'hmpo-form-wizard'

import logger from '../../../logger'
import { parseDateInput, parseTimeInput } from '../../utils/utils'
import type { ReportWithDetails } from '../../data/incidentReportingApi'
import { getTypeDetails, types, typeHints, type Type } from '../../reportConfiguration/constants'
import { BaseController } from '../../controllers'

const hoursFieldName = '_incidentTime-hours' as const
const minutesFieldName = '_incidentTime-minutes' as const

const fields = {
  type: {
    label: 'Select incident type',
    validate: ['required'],
    component: 'govukRadios',
    items: types
      .filter(type => type.active)
      .sort(({ code: code1 }, { code: code2 }) => {
        if (code1 === 'MISCELLANEOUS') {
          return 1
        }
        if (code2 === 'MISCELLANEOUS') {
          return -1
        }
        return code1 < code2 ? -1 : 1
      })
      .map(
        type =>
          ({
            label: type.description,
            value: type.code,
            hint: typeHints[type.code],
          }) satisfies FormWizard.FieldItem,
      ),
  },
  incidentDate: {
    label: 'Date of incident',
    hint: 'For example, 17/05/2024',
    component: 'mojDatePicker',
    validate: ['required', 'ukDate'],
  },
  incidentTime: {
    label: 'Time',
    hint: 'Use the 24 hour clock. For example, 09 08 or 17 32',
    component: 'appTime',
    validate: ['required', 'ukTime'],
  },
  [hoursFieldName]: {},
  [minutesFieldName]: {},
  description: {
    label: 'Description',
    hint: 'Include enough detail that the description can stand alone as a report',
    component: 'govukTextarea',
    validate: ['required'],
  },
} satisfies FormWizard.Fields

interface CreateReport extends Record<keyof typeof fields, string> {
  type: Type
}

const step1Fields = ['type'] as const
type Step1 = (typeof step1Fields)[number]

class Step1Controller extends BaseController<CreateReport, Step1> {
  protected errorMessage(error: FormWizard.Error): string {
    if (error.key === 'type') {
      return 'Choose one of the options'
    }
    return super.errorMessage(error)
  }
}

const step2Fields = ['incidentDate', 'incidentTime', hoursFieldName, minutesFieldName, 'description'] as const
type Step2 = (typeof step2Fields)[number]

class Step2Controller extends BaseController<CreateReport, Step2> {
  getValues(
    req: FormWizard.Request<CreateReport, Step2>,
    res: Express.Response,
    callback: FormWizard.Callback<CreateReport>,
  ): void {
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

  process(req: FormWizard.Request<CreateReport, Step2>, res: Express.Response, next: Express.NextFunction): void {
    const hours = req.form.values[hoursFieldName]
    const minutes = req.form.values[minutesFieldName]
    const digits = /^\d{1,2}$/
    if (digits.test(hours) && digits.test(minutes)) {
      req.form.values.incidentTime = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`
    }

    super.process(req, res, next)
  }

  validate(
    req: FormWizard.Request<Pick<CreateReport, Step2>>,
    res: Express.Response,
    next: Express.NextFunction,
  ): void {
    // if (and only if) incidentDate and incidentTime are valid, ensure that the combined date & time is in the past
    const { incidentDate, incidentTime } = req.form.values
    try {
      const incidentDateAndTime = this.buildIncidentDateAndTime(incidentDate, incidentTime)
      const now = new Date()
      if (incidentDateAndTime > now) {
        const error = new BaseController.Error('incidentDate', {
          key: 'incidentDate',
          message: 'Enter a date and time in the past',
        })
        next({ incidentDate: error })
        return
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      /* empty */
    }

    super.validate(req, res, next)
  }

  /**
   * Combine date and time strings into a Date
   * @throws {Error} when either date or time cannot be parsed
   */
  private buildIncidentDateAndTime(incidentDate: string, incidentTime: string): Date {
    const incidentDateAndTime = parseDateInput(incidentDate)
    const time = parseTimeInput(incidentTime)
    incidentDateAndTime.setHours(time.hours)
    incidentDateAndTime.setMinutes(time.minutes)
    return incidentDateAndTime
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

  async successHandler(
    req: FormWizard.Request<CreateReport, Step2>,
    res: Express.Response,
    next: Express.NextFunction,
  ): Promise<void> {
    const allValues = this.getAllValues(req)

    const { type, description, incidentDate, incidentTime } = allValues
    const incidentDateAndTime = this.buildIncidentDateAndTime(incidentDate, incidentTime)
    const typeDetails = getTypeDetails(type)
    const title = `Report: ${typeDetails.description.toLowerCase()}`

    try {
      const report = await res.locals.apis.incidentReportingApi.createReport({
        type,
        incidentDateAndTime,
        title,
        description,
        prisonId: res.locals.user.activeCaseLoad.caseLoadId,
        createNewEvent: true,
      })
      logger.info(`Report ${report.reportReference} created`)
      res.locals.createdReport = report

      // clear session since report has been saved
      req.journeyModel.reset()

      super.successHandler(req, res, next)
    } catch (e) {
      logger.error(e, 'Report could not be created: %j', e)
      const err = this.convertIntoValidationError(e)
      // TODO: find a different way to report whole-form errors rather than attaching to specific field
      this.errorHandler({ incidentDate: err }, req, res, next)
    }
  }

  getNextStep(req: FormWizard.Request<CreateReport, Step2>, res: Express.Response): string | undefined {
    // if a report was successfully created, redirect to it
    if ('createdReport' in res.locals && res.locals.createdReport) {
      const report: ReportWithDetails = res.locals.createdReport
      return `/reports/${report.id}`
    }
    // otherwise let form wizard decide where to go next
    return super.getNextStep(req, res)
  }
}

const steps: FormWizard.Steps<CreateReport> = {
  '/': {
    fields: step1Fields,
    controller: Step1Controller,
    entryPoint: true,
    template: 'types',
    backLink: '/',
    next: 'details',
  },
  '/details': {
    fields: step2Fields,
    controller: Step2Controller,
  },
}

const config: FormWizard.Config<CreateReport> = {
  name: 'createReport',
  checkSession: false,
  csrf: false,
  templatePath: 'pages/createReport',
}

export default FormWizard(steps, fields, config)
