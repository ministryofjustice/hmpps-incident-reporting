import type express from 'express'
import type FormWizard from 'hmpo-form-wizard'

import format from '../../../utils/format'
import { parseDateInput, parseTimeInput } from '../../../utils/parseDateTime'
import { BaseController } from '../../../controllers'
import {
  type IncidentDateAndTimeValues,
  type IncidentDateAndTimeFieldNames,
  hoursFieldName,
  minutesFieldName,
} from './incidentDateAndTimeFields'
import {
  incidentTypeHints,
  incidentTypeLabels,
  incidentTypeRequiresTime,
  Type,
} from '../../../reportConfiguration/constants'

type IncidentDateAndTimeControllerValues = IncidentDateAndTimeValues & { type?: Type }
/**
 * Controller for adding or updating the date of an incident report.
 * Handles error messages and validating combined date and time fields.
 * The generic V parameter is for specifying all steps’ values, not just this one.
 */
export abstract class BaseIncidentDateAndTimeController<
  V extends IncidentDateAndTimeControllerValues,
> extends BaseController<V, IncidentDateAndTimeFieldNames> {
  middlewareLocals(): void {
    this.use(this.customiseIncidentDateAndTimeFields)
    super.middlewareLocals()
  }

  /** Rewrite hint text and labels for incident date/time fields if configured for this type */
  private customiseIncidentDateAndTimeFields(
    req: FormWizard.Request<V, IncidentDateAndTimeFieldNames>,
    res: express.Response,
    next: express.NextFunction,
  ): void {
    const reportType: Type = (req.sessionModel.get('type') as Type) ?? res.locals.report?.type

    if (incidentTypeHints[reportType]?.incidentDate) {
      req.form.options.fields.incidentDate.hint = incidentTypeHints[reportType].incidentDate
    }

    if (incidentTypeHints[reportType]?.incidentTime) {
      req.form.options.fields.incidentTime.hint = incidentTypeHints[reportType].incidentTime
    }

    if (incidentTypeLabels[reportType]?.incidentDate) {
      req.form.options.fields.incidentDate.label = incidentTypeLabels[reportType].incidentDate
    }

    const timeRequired = incidentTypeRequiresTime[reportType] ?? true
    if (!timeRequired) {
      req.form.options.fields.incidentTime.component = 'hidden'
      req.form.options.fields.incidentTime.validate = []
      res.locals.incidentTimeRequired = false
    }

    next()
  }

  getValues(
    req: FormWizard.Request<V, IncidentDateAndTimeFieldNames>,
    res: express.Response,
    callback: FormWizard.Callback<V>,
  ): void {
    super.getValues(req, res, (err, values) => {
      if (err) {
        callback(err, values)
        return
      }

      const reportType: Type = (req.sessionModel.get('type') as Type) ?? res.locals.report?.type
      const timeRequired = incidentTypeRequiresTime[reportType] ?? true

      if (!timeRequired) {
        // eslint-disable-next-line no-param-reassign
        values.incidentTime = '00:00' as V['incidentTime']
      } else {
        const errorValues = req.sessionModel.get('errorValues')
        const incidentTimeValue = errorValues?.incidentTime ?? values?.incidentTime
        if (incidentTimeValue) {
          const [hours, minutes] = incidentTimeValue.split(':')
          // eslint-disable-next-line no-param-reassign
          values[hoursFieldName] = hours
          // eslint-disable-next-line no-param-reassign
          values[minutesFieldName] = minutes
        }
      }

      callback(undefined, values)
    })
  }

  process(
    req: FormWizard.Request<V, IncidentDateAndTimeFieldNames>,
    res: express.Response,
    next: express.NextFunction,
  ): void {
    const reportType: Type = (req.sessionModel.get('type') as Type) ?? res.locals.report?.type
    const timeRequired = incidentTypeRequiresTime[reportType] ?? true

    if (!timeRequired) {
      req.form.values.incidentTime = '00:00' as V['incidentTime']
    } else {
      const hours = req.form.values[hoursFieldName]
      const minutes = req.form.values[minutesFieldName]
      const digits = /^\d{1,2}$/
      if (digits.test(hours) && digits.test(minutes)) {
        req.form.values.incidentTime = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`
      }
    }

    super.process(req, res, next)
  }

  validate(
    req: FormWizard.Request<Pick<V, IncidentDateAndTimeFieldNames>>,
    res: express.Response,
    next: express.NextFunction,
  ): void {
    // if (and only if) incidentDate and incidentTime are valid, ensure that the combined date & time is in the past
    const { incidentDate, incidentTime } = req.form.values
    const timeRequired = res.locals.incidentTimeRequired ?? true
    try {
      const incidentDateAndTime = this.buildIncidentDateAndTime(incidentDate, incidentTime)
      const now = new Date()
      if (incidentDateAndTime > now) {
        if (format.isoDate(incidentDateAndTime) > format.isoDate(now)) {
          const error = new this.Error('incidentDate', {
            key: 'incidentDate',
            message: 'Date of the incident must be today or in the past',
          })
          next({ incidentDate: error })
          return
        }
        // Skip the time-in-future error when the time field is not shown to the user
        if (timeRequired) {
          const error = new this.Error('incidentTime', {
            field: hoursFieldName,
            key: 'incidentTime',
            message: 'Time of the incident must be in the past',
          })
          next({ incidentTime: error })
          return
        }
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
  protected buildIncidentDateAndTime(incidentDate: string, incidentTime: string): Date {
    const incidentDateAndTime = parseDateInput(incidentDate)
    const time = parseTimeInput(incidentTime)
    incidentDateAndTime.setHours(time.hours)
    incidentDateAndTime.setMinutes(time.minutes)
    return incidentDateAndTime
  }

  protected errorMessage(
    error: FormWizard.Error,
    req: FormWizard.Request<V, IncidentDateAndTimeFieldNames>,
    res: express.Response,
  ): string {
    if (error.key === 'incidentDate' && error.type === 'required') {
      return 'Enter the date of the incident'
    }
    if (error.key === 'incidentDate' && error.type === 'ukDate') {
      return 'Enter the date of the incident using the format DD MM YYYY'
    }
    if (error.key === 'incidentTime' && error.type === 'required') {
      // eslint-disable-next-line no-param-reassign
      error.field = hoursFieldName
      return 'Enter the time of the incident using the 24 hour clock'
    }
    return super.errorMessage(error, req, res)
  }
}
