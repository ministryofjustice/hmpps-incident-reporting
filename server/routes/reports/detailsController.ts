import type express from 'express'
import type FormWizard from 'hmpo-form-wizard'

import { parseDateInput, parseTimeInput } from '../../utils/utils'
import { BaseController } from '../../controllers'
import { type DetailsValues, type DetailsFieldNames, hoursFieldName, minutesFieldName } from './detailsFields'

/**
 * Controller for adding or updating the date and description of an incident report.
 * Handles error messages and validating combined date and time fields.
 * The generic V parameter is for specifying all steps’ values, not just this one.
 */
// eslint-disable-next-line import/prefer-default-export
export abstract class BaseDetailsController<V extends DetailsValues> extends BaseController<V, DetailsFieldNames> {
  getValues(
    req: FormWizard.Request<V, DetailsFieldNames>,
    res: express.Response,
    callback: FormWizard.Callback<V>,
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

  process(req: FormWizard.Request<V, DetailsFieldNames>, res: express.Response, next: express.NextFunction): void {
    const hours = req.form.values[hoursFieldName]
    const minutes = req.form.values[minutesFieldName]
    const digits = /^\d{1,2}$/
    if (digits.test(hours) && digits.test(minutes)) {
      req.form.values.incidentTime = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`
    }

    super.process(req, res, next)
  }

  validate(
    req: FormWizard.Request<Pick<V, DetailsFieldNames>>,
    res: express.Response,
    next: express.NextFunction,
  ): void {
    // if (and only if) incidentDate and incidentTime are valid, ensure that the combined date & time is in the past
    const { incidentDate, incidentTime } = req.form.values
    try {
      const incidentDateAndTime = this.buildIncidentDateAndTime(incidentDate, incidentTime)
      const now = new Date()
      if (incidentDateAndTime > now) {
        const error = new BaseDetailsController.Error('incidentDate', {
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
  protected buildIncidentDateAndTime(incidentDate: string, incidentTime: string): Date {
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
}