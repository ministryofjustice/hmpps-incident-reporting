import type express from 'express'
import { FormWizard } from 'hmpo-form-wizard'

import logger from '../../../logger'
import format from '../../utils/format'
import { parseDateInput } from '../../utils/utils'
import { BaseController } from '../index'
import {
  type AddOrUpdateQuestionResponseRequest,
  type AddOrUpdateQuestionWithResponsesRequest,
  type ReportWithDetails,
} from '../../data/incidentReportingApi'
import {
  type QuestionConfiguration,
  findAnswerConfigByCode,
  stripQidPrefix,
} from '../../data/incidentTypeConfiguration/types'
import QuestionsToDelete from '../../services/questionsToDelete'

export default class QuestionsController extends BaseController<FormWizard.MultiValues> {
  middlewareLocals(): void {
    super.middlewareLocals()
    this.use(this.checkQuestionProgress)
  }

  checkQuestionProgress(
    req: FormWizard.Request<FormWizard.MultiValues>,
    res: express.Response,
    next: express.NextFunction,
  ): void {
    const stepPath = req.form.options.route
    for (const progressStep of res.locals.questionProgress) {
      if (progressStep.urlSuffix === stepPath) {
        res.locals.firstQuestionNumber = progressStep.questionNumber
        res.locals.questionPageNumber = progressStep.pageNumber
        break
      }
    }
    if (!res.locals.questionPageNumber) {
      logger.error(`Could not find question page number for ${stepPath} in report type ${res.locals.report.type}`)
    }
    next()
  }

  getBackLink(req: FormWizard.Request<FormWizard.MultiValues>, _res: express.Response): string {
    const reportId = req.params.id
    return `/reports/${reportId}`
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
      const { reportConfig } = res.locals

      for (const question of report.questions) {
        // TODO: Remove QID-stripping logic once removed from API
        const fieldName = stripQidPrefix(question.code)
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
        const { reportConfig, questionSteps, questionFields } = res.locals

        // get step's fields in proper order (submittedValues is not properly ordered)
        const fieldNames = questionSteps[req.form.options.route].fields
          // ignore date & comment fields
          .filter(fieldName => /^\d+$/.test(fieldName))

        const updates: AddOrUpdateQuestionWithResponsesRequest[] = []
        for (const [fieldName, values] of fieldNames.map(
          someFieldName => [someFieldName, submittedValues[someFieldName]] as [string, FormWizard.MultiValue],
        )) {
          // Skip conditional fields
          if (questionFields[fieldName]?.dependent) {
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

          updates.push(questionResponses)
        }

        try {
          // Update questions' answers
          const currentQuestions = await incidentReportingApi.addOrUpdateQuestionsWithResponses(report.id, updates)

          // Delete any potential now-irrelevant questions
          const questionsToDelete = QuestionsToDelete.forGivenAnswers(reportConfig, currentQuestions)
          if (questionsToDelete.length > 0) {
            await incidentReportingApi.deleteQuestionsAndTheirResponses(report.id, questionsToDelete)
          }
        } catch (err) {
          next(err)
          return
        }

        next()
      }
    })
  }
}
