import type express from 'express'
import type FormWizard from 'hmpo-form-wizard'

import logger from '../../../../logger'
import format from '../../../utils/format'
import { parseDateInput } from '../../../utils/parseDateTime'
import type {
  AddOrUpdateQuestionResponseRequest,
  AddOrUpdateQuestionWithResponsesRequest,
  ReportWithDetails,
} from '../../../data/incidentReportingApi'
import type { QuestionConfiguration } from '../../../data/incidentTypeConfiguration/types'
import {
  conditionalFieldName,
  findAnswerConfigByResponse,
  parseFieldName,
} from '../../../data/incidentTypeConfiguration/utils'
import { aboutTheType } from '../../../reportConfiguration/constants'
import QuestionsToDelete from '../../../services/questionsToDelete'
import { BaseController } from '../../../controllers'

// eslint-disable-next-line import/prefer-default-export
export class QuestionsController extends BaseController<FormWizard.MultiValues> {
  middlewareLocals(): void {
    super.middlewareLocals()
    this.use(this.checkQuestionProgress)
  }

  private checkQuestionProgress(
    req: FormWizard.Request<FormWizard.MultiValues>,
    res: express.Response,
    next: express.NextFunction,
  ): void {
    const { reportId } = req.params

    const stepPath = req.form.options.route
    let previousStep: string | null = null
    for (const progressStep of res.locals.questionProgress) {
      if (progressStep.urlSuffix === stepPath) {
        res.locals.firstQuestionNumber = progressStep.questionNumber
        res.locals.questionPageNumber = progressStep.pageNumber
        break
      } else {
        previousStep = progressStep.urlSuffix
      }
    }

    if (!res.locals.questionPageNumber) {
      logger.warn(`Cannot go to step ${stepPath} in report ${reportId} ${res.locals.report.type}`)
      // TODO: replace with last page instead of start?
      res.redirect(`${res.locals.reportSubUrlPrefix}/questions`)
      return
    }

    res.locals.questionCountOnPage = Object.values(req.form.options.fields).filter(
      (field: FormWizard.Field) => !field.dependent,
    ).length

    if (previousStep) {
      // if a previous questions page exists, link back to it
      res.locals.backLink = this.resolvePath(req.baseUrl, previousStep, true)
    } else if (res.locals.creationJourney) {
      // or, if this is the create journey, link to staff involvements
      res.locals.backLink = `${res.locals.reportSubUrlPrefix}/staff`
    } else {
      // otherwise back to the report otherwise
      res.locals.backLink = res.locals.reportUrl
    }

    // “About the [incident]”
    res.locals.aboutTheType = aboutTheType(res.locals.report.type)

    next()
  }

  getNextStepObject(
    req: FormWizard.Request<FormWizard.MultiValues>,
    res: express.Response,
  ): ReturnType<BaseController['decodeConditions']> {
    const nextStepObject = super.getNextStepObject(req, res)
    if (!nextStepObject.url) {
      // reached the end so the next step is report summary
      nextStepObject.url = res.locals.reportUrl
    }
    return nextStepObject
  }

  getNextStep(req: FormWizard.Request<FormWizard.MultiValues>, res: express.Response): string {
    // go to report view if user chose to exit
    if (req.body?.userAction === 'exit') {
      return res.locals.reportUrl
    }
    // …or continue with question pages
    return super.getNextStep(req, res)
  }

  protected errorMessage(
    error: FormWizard.Error,
    req: FormWizard.Request<FormWizard.MultiValues>,
    res: express.Response,
  ): string {
    const fieldName = error.key ?? error.field

    const field = req.form.options.fields[fieldName]
    if (field?.items?.length > 0 && error.type === 'required') {
      if (field.multiple) {
        // checkboxes
        return `Select one or more options for ‘${field.label}’`
      }
      // radio buttons
      return `Select an answer for ‘${field.label}’`
    }

    if (field.component === 'govukInput' || field.component === 'mojDatePicker') {
      const parsedField = parseFieldName(fieldName)
      if ('questionCode' in parsedField) {
        const sourceField = req.form.options.fields[parsedField.questionCode]
        if (sourceField) {
          if (field.component === 'mojDatePicker') {
            // date
            return `Enter a date for ‘${sourceField.label}’`
          }
          // comment
          return `Enter a comment for ‘${sourceField.label}’`
        }
      }
    }

    return super.errorMessage(error, req, res)
  }

  getValues(
    req: FormWizard.Request<FormWizard.MultiValues>,
    res: express.Response,
    callback: FormWizard.Callback<FormWizard.MultiValues>,
  ): void {
    super.getValues(req, res, async (err, values) => {
      if (err) {
        callback(err)
        return
      }

      const formValues = { ...values }

      const report = res.locals.report as ReportWithDetails
      const { reportConfig } = res.locals

      for (const question of report.questions) {
        const fieldName = question.code
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
          const answerResponse = response.response
          const answerConfig = findAnswerConfigByResponse(answerResponse, questionConfig)
          if (answerConfig === undefined) {
            logger.error(
              `Report '${report.id}': Answer with response '${answerResponse}' not found in ${report.type}'s question '${questionConfig.code}' configuration.`,
            )
            // eslint-disable-next-line no-continue
            continue
          }

          // comment field
          if (answerConfig.commentRequired) {
            const commentFieldName = conditionalFieldName(questionConfig, answerConfig, 'comment')
            if (formValues[commentFieldName] === undefined) {
              formValues[commentFieldName] = response.additionalInformation
            }
          }

          // date field
          if (answerConfig.dateRequired) {
            const dateFieldName = conditionalFieldName(questionConfig, answerConfig, 'date')
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
            // when questions with code like `{Q.code}-{A.code}-(date|comment)`
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
            question: questionConfig.question,
            additionalInformation: null,
            responses: [],
          }

          const answerResponses = (questionConfig.multipleAnswers ? values : [values]) as string[]
          for (const answerResponse of answerResponses) {
            if (answerResponse === '') {
              // eslint-disable-next-line no-continue
              continue
            }
            const answerConfig = findAnswerConfigByResponse(answerResponse, questionConfig)
            if (!answerConfig) {
              logger.error(
                `Report '${report.id}': Submitted Answer with response '${answerResponse}' not found in ${report.type}'s question '${questionConfig.code}' configuration.`,
              )
              // eslint-disable-next-line no-continue
              continue
            }

            const response: AddOrUpdateQuestionResponseRequest = {
              response: answerResponse,
              code: answerConfig.code,
              responseDate: null,
              additionalInformation: null,
            }

            if (answerConfig.commentRequired) {
              const commentFieldName = conditionalFieldName(questionConfig, answerConfig, 'comment')
              response.additionalInformation = submittedValues[commentFieldName] as string
            }

            if (answerConfig.dateRequired) {
              const dateFieldName = conditionalFieldName(questionConfig, answerConfig, 'date')
              response.responseDate = parseDateInput(submittedValues[dateFieldName] as string)
            }
            questionResponses.responses.push(response)
          }

          updates.push(questionResponses)
        }

        try {
          // Update questions' answers
          const currentQuestions = await incidentReportingApi.addOrUpdateQuestionsWithResponses(report.id, updates)
          logger.info('Updated questions in report %s', report.id)

          // Delete any potential now-irrelevant questions
          const questionsToDelete = QuestionsToDelete.forGivenAnswers(reportConfig, currentQuestions)
          if (questionsToDelete.length > 0) {
            await incidentReportingApi.deleteQuestionsAndTheirResponses(report.id, questionsToDelete)
            logger.info('Removed obsolete questions from report %s', report.id)
          }

          // clear session since questions have been saved
          res.locals.clearSessionOnSuccess = true
        } catch (e) {
          logger.error(e, 'Questions could not be updated in report %s: %j', report.id, e)
          const err = this.convertIntoValidationError(e)
          // TODO: find a different way to report whole-form errors rather than attaching to specific field
          // eslint-disable-next-line prefer-destructuring
          err.key = fieldNames[0]
          next(err)
          return
        }

        next()
      }
    })
  }
}
