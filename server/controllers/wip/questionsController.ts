import { FormWizard } from 'hmpo-form-wizard'
import type express from 'express'
import { BaseController } from '../index'
import { ReportWithDetails } from '../../data/incidentReportingApi'
import format from '../../utils/format'
import { getIncidentTypeConfiguration } from '../../reportConfiguration/types'
import {
  AnswerConfiguration,
  IncidentTypeConfiguration,
  QuestionConfiguration,
} from '../../data/incidentTypeConfiguration/types'
import logger from '../../../logger'

export default class QuestionsController extends BaseController<FormWizard.MultiValues> {
  getBackLink(_req: FormWizard.Request, _res: express.Response): string {
    // TODO: Change to `/reports/` page once we have it
    return '/incidents/'
  }

  middlewareLocals(): void {
    this.use(this.lookupReport)
    super.middlewareLocals()
  }

  async lookupReport(req: FormWizard.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    const { incidentReportingApi } = res.locals.apis
    const reportId = req.params.id

    res.locals.report = await incidentReportingApi.getReportWithDetailsById(reportId)
    res.locals.reportConfig = await getIncidentTypeConfiguration(res.locals.report.type)
    next()
  }

  getValues(
    req: FormWizard.Request<FormWizard.MultiValues, string>,
    res: express.Response,
    callback: FormWizard.Callback<FormWizard.MultiValues>,
  ) {
    return super.getValues(req, res, async (err, values) => {
      if (err) {
        return callback(err)
      }

      const formValues = { ...values }

      const report = res.locals.report as ReportWithDetails
      const reportConfig = res.locals.reportConfig as IncidentTypeConfiguration

      for (const question of report.questions) {
        const fieldName = this.questionIdFromCode(question.code)
        const questionConfig: QuestionConfiguration = reportConfig.questions[fieldName]
        if (questionConfig === undefined) {
          logger.warn(new Error(`Question with code '${fieldName}' not found in ${report.type}'s configuration.`))
          // eslint-disable-next-line no-continue
          continue
        }

        // Top-level answer(s)
        if (formValues[fieldName] === undefined) {
          const reportValues = question.responses.map(response => response.response)
          formValues[fieldName] = questionConfig.multipleAnswers ? reportValues : reportValues[0]
        }

        // Populate comment/date fields for each response
        // NOTE: Each response may have its own associated comment and/or date
        for (const response of question.responses) {
          const answerCode = response.response
          const answerConfig = this.findAnswerConfigByCode(answerCode, questionConfig)
          if (answerConfig === undefined) {
            logger.warn(
              new Error(
                `answer with code '${answerCode}' not found in ${report.type}'s question '${questionConfig.id}' configuration.`,
              ),
            )
            // eslint-disable-next-line no-continue
            continue
          }

          // comment field
          if (answerConfig.commentRequired) {
            const commentFieldName = `${questionConfig.id}-${answerConfig.id}-comment`
            if (formValues[commentFieldName] === undefined) {
              formValues[commentFieldName] = response.additionalInformation
            }
          }

          // date field
          if (answerConfig.dateRequired) {
            const dateFieldName = `${questionConfig.id}-${answerConfig.id}-date`
            if (formValues[dateFieldName] === undefined) {
              formValues[dateFieldName] = format.shortDate(response.responseDate)
            }
          }
        }
      }

      return callback(null, formValues)
    })
  }

  /** Finds the Answer config for a given the answer code */
  private findAnswerConfigByCode(answerCode: string, questionConfig: QuestionConfiguration): AnswerConfiguration {
    return questionConfig.answers.find(answerConfig => answerConfig.code.trim() === answerCode.trim())
  }

  /** Strips `QID-0...` prefix and returns the question ID */
  private questionIdFromCode(code: string): string {
    const re = /^QID-0*/

    return code.replace(re, '')
  }
}
