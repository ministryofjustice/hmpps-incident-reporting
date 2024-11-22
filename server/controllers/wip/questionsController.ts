import { FormWizard } from 'hmpo-form-wizard'
import type express from 'express'
import { BaseController } from '../index'
import {
  type AddQuestionResponseRequest,
  type AddQuestionWithResponsesRequest,
  type ReportWithDetails,
} from '../../data/incidentReportingApi'
import format from '../../utils/format'
import {
  AnswerConfiguration,
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
            new Error(
              `Report '${report.id}': Question with code '${fieldName}' not found in ${report.type}'s configuration.`,
            ),
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
          const answerConfig = this.findAnswerConfigByCode(answerCode, questionConfig)
          if (answerConfig === undefined) {
            logger.error(
              new Error(
                `Report '${report.id}': Answer with code '${answerCode}' not found in ${report.type}'s question '${questionConfig.id}' configuration.`,
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

      callback(null, formValues)
    })
  }

  async saveValues(
    req: FormWizard.Request<FormWizard.MultiValues, string>,
    res: express.Response,
    next: express.NextFunction,
  ): Promise<void> {
    const { incidentReportingApi } = res.locals.apis

    const submittedValues = req.form.values

    const report = res.locals.report as ReportWithDetails
    const reportConfig = res.locals.reportConfig as IncidentTypeConfiguration

    const questionsResponses = []
    for (const [fieldName, values] of Object.entries(submittedValues)) {
      const questionConfig = reportConfig.questions[fieldName]
      if (questionConfig === undefined) {
        // eslint-disable-next-line no-continue
        continue
      }
      const questionResponses: AddQuestionWithResponsesRequest = {
        code: fieldName,
        question: questionConfig.code,
        responses: [],
      }

      const responseCodes = (questionConfig.multipleAnswers ? values : [values]) as string[]
      responseCodes
        .filter(responseCode => responseCode !== '')
        .forEach(responseCode => {
          const answerConfig = this.findAnswerConfigByCode(responseCode, questionConfig)
          const response: AddQuestionResponseRequest = {
            response: responseCode,
            responseDate: null,
            additionalInformation: null,
          }

          if (answerConfig.commentRequired) {
            const commentFieldName = `${questionConfig.id}-${answerConfig.id}-comment`
            if (submittedValues[commentFieldName] !== '') {
              response.additionalInformation = submittedValues[commentFieldName] as string
            }
          }

          if (answerConfig.dateRequired) {
            const dateFieldName = `${questionConfig.id}-${answerConfig.id}-date`
            if (submittedValues[dateFieldName] !== '') {
              response.responseDate = parseDateInput(submittedValues[dateFieldName] as string)
            }
          }
          questionResponses.responses.push(response)
        })
      questionsResponses.push(questionResponses)
    }

    // TODO: API could allow multiple answer per HTTP request
    for (const questionResponses of questionsResponses) {
      // eslint-disable-next-line no-await-in-loop
      await incidentReportingApi.addQuestionWithResponses(report.id, questionResponses)
    }

    super.saveValues(req, res, next)
  }

  /** Finds the Answer config for a given the answer code */
  private findAnswerConfigByCode(answerCode: string, questionConfig: QuestionConfiguration): AnswerConfiguration {
    return questionConfig.answers.find(answerConfig => answerConfig.code.trim() === answerCode.trim())
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
