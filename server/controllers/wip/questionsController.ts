import { FormWizard } from 'hmpo-form-wizard'
import type express from 'express'
import { BaseController } from '../index'
import {
  type AddOrUpdateQuestionResponseRequest,
  type AddOrUpdateQuestionWithResponsesRequest,
  type ReportWithDetails,
} from '../../data/incidentReportingApi'
import format from '../../utils/format'
import {
  findAnswerConfigByCode,
  IncidentTypeConfiguration,
  QuestionConfiguration,
} from '../../data/incidentTypeConfiguration/types'
import logger from '../../../logger'
import { parseDateInput } from '../../utils/utils'

export default class QuestionsController extends BaseController<FormWizard.MultiValues> {
  getBackLink(_req: FormWizard.Request, _res: express.Response): string {
    return '/reports/'
  }

  middlewareLocals(): void {
    super.middlewareLocals()
  }

  getValues(
    req: FormWizard.Request<FormWizard.MultiValues, string>,
    res: express.Response,
    callback: FormWizard.Callback<FormWizard.MultiValues>,
  ) {
    return super.getValues(req, res, async (err, values) => {
      if (err) {
        callback(err)
        return
      }

      const formValues = { ...values }

      const report = res.locals.report as ReportWithDetails
      const reportConfig = res.locals.reportConfig as IncidentTypeConfiguration

      for (const question of report.questions) {
        // TODO: Remove QID-stripping logic once removed from API
        const fieldName = this.questionIdFromCode(question.code)
        const questionConfig: QuestionConfiguration = reportConfig.questions[fieldName]
        if (questionConfig === undefined) {
          logger.error(
            `Report '${report.id}': Question with code '${fieldName}' not found in ${report.type}'s configuration.`,
          )
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
          const answerConfig = findAnswerConfigByCode(answerCode, questionConfig)
          if (answerConfig === undefined) {
            logger.error(
              `Report '${report.id}': Answer with code '${answerCode}' not found in ${report.type}'s question '${questionConfig.id}' configuration.`,
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

      callback(null, formValues)
    })
  }

  async saveValues(
    req: FormWizard.Request<FormWizard.MultiValues, string>,
    res: express.Response,
    next: express.NextFunction,
  ): Promise<void> {
    super.saveValues(req, res, async error => {
      if (error) {
        next(error)
      } else {
        const { incidentReportingApi } = res.locals.apis

        const submittedValues = req.form.values

        const report = res.locals.report as ReportWithDetails
        const reportConfig = res.locals.reportConfig as IncidentTypeConfiguration
        const reportFields = res.locals.reportFields as FormWizard.Fields

        const questionsResponses = []
        for (const [fieldName, values] of Object.entries(submittedValues)) {
          // Skip conditional fields
          if (reportFields[fieldName]?.dependent) {
            // Conditional fields don't have their own question config,
            // submitted values are included later if the question
            // requires a date or comment.
            // Skipping these so that we don't get false errors
            // when questions with ID like `{Q.id}-{A.id}-(date|comment)`
            // are not found in the config

            // eslint-disable-next-line no-continue
            continue
          }

          const questionConfig = reportConfig.questions[fieldName]
          if (questionConfig === undefined) {
            logger.error(
              `Report '${report.id}': Submitted Field '${fieldName}' not found in ${report.type}'s configuration.`,
            )

            // eslint-disable-next-line no-continue
            continue
          }
          const questionResponses: AddOrUpdateQuestionWithResponsesRequest = {
            code: fieldName,
            question: questionConfig.code,
            additionalInformation: null,
            responses: [],
          }

          const responseCodes = (questionConfig.multipleAnswers ? values : [values]) as string[]
          for (const responseCode of responseCodes) {
            if (responseCode === '') {
              // eslint-disable-next-line no-continue
              continue
            }
            const answerConfig = findAnswerConfigByCode(responseCode, questionConfig)
            if (answerConfig === undefined) {
              logger.error(
                `Report '${report.id}': Submitted Answer with code '${responseCode}' not found in ${report.type}'s question '${questionConfig.id}' configuration.`,
              )
              // eslint-disable-next-line no-continue
              continue
            }

            const response: AddOrUpdateQuestionResponseRequest = {
              response: responseCode,
              responseDate: null,
              additionalInformation: null,
            }

            if (answerConfig.commentRequired) {
              const commentFieldName = `${questionConfig.id}-${answerConfig.id}-comment`
              response.additionalInformation = submittedValues[commentFieldName] as string
            }

            if (answerConfig.dateRequired) {
              const dateFieldName = `${questionConfig.id}-${answerConfig.id}-date`
              response.responseDate = parseDateInput(submittedValues[dateFieldName] as string)
            }
            questionResponses.responses.push(response)
          }

          questionsResponses.push(questionResponses)
        }

        await incidentReportingApi.addOrUpdateQuestionsWithResponses(report.id, questionsResponses)
        next()
      }
    })
  }

  /** Strips `QID-0...` prefix and returns the question ID
   *
   * TODO: Remove QID-stripping logic once removed from API
   */
  private questionIdFromCode(code: string): string {
    const re = /^QID-0*/

    return code.replace(re, '')
  }
}
