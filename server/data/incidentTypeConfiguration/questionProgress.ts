// eslint-disable-next-line max-classes-per-file
import type FormWizard from 'hmpo-form-wizard'

import logger from '../../../logger'
import type { ReportWithDetails, Response } from '../incidentReportingApi'
import type { AnswerConfiguration, IncidentTypeConfiguration, QuestionConfiguration } from './types'
import { findAnswerConfigByResponse } from './utils'

/** A step in the process of responding to all necessary questions in a report */
export class QuestionProgressStep {
  constructor(
    /** This step’s question */
    readonly questionConfig: QuestionConfiguration,
    /** All of this question step’s chosen responses or undefined if not completed */
    readonly responses: ResponseItem[] | undefined,
    /** This question step’s URL path suffix */
    readonly urlSuffix: string,
    /** Question number ignoring grouping (starts at 1) */
    readonly questionNumber: number,
    /** Page number when questions are grouped (starts at 1) */
    readonly pageNumber: number,
  ) {}

  /** Whether this question step has been completed (ie. responses exist and each one has a comment or date if required) */
  get isComplete(): boolean {
    return Boolean(
      this.responses &&
        ((this.questionConfig.multipleAnswers && this.responses.length >= 1) || this.responses.length === 1) &&
        this.responses.every(item => item.isComplete),
    )
  }

  get fieldName(): string {
    return this.questionConfig.code
  }
}

/** A response to a question along the report’s progress */
class ResponseItem {
  constructor(
    /** A response as returned by IRS api */
    readonly response: Response,
    /** Corresponding response config as found in this application */
    readonly answerConfig: AnswerConfiguration | undefined,
  ) {}

  /** Response choice is valid for question and comment and/or date is present if required */
  get isComplete(): boolean {
    return (
      this.answerConfig &&
      (!this.answerConfig.commentRequired || this.response.additionalInformation?.length > 0) &&
      (!this.answerConfig.dateRequired || Boolean(this.response.responseDate))
    )
  }
}

export class QuestionProgress {
  constructor(
    private readonly config: IncidentTypeConfiguration,
    private readonly steps: FormWizard.Steps<FormWizard.MultiValues>,
    private readonly report: ReportWithDetails,
  ) {}

  /**
   * Walks through a report, yielding question configurations and all chosen response configurations,
   * until the first incomplete question is reached.
   * Incident type configuration is used to determine proper question order.
   *
   * NB: completion flag does not totally validate responses, e.g. order of questions in report is ignored,
   * but this scenario is not possible for users to create.
   */
  *[Symbol.iterator](): Generator<QuestionProgressStep, void, void> {
    // map of question id to responses so that order isn't required to be identical
    const reportResponses = new Map<string, Response[]>()
    this.report.questions.forEach(({ code, responses }) => {
      reportResponses.set(code, responses)
    })

    // map of question id to step url path suffix
    const reportSteps = new Map<string, string>()
    Object.entries(this.steps)
      // ignore empty start step
      .filter(([_stepPath, step]) => 'fields' in step)
      .forEach(([stepPath, step]) => {
        step.fields
          // ignore date & comment fields
          .filter(field => /^\d+$/.test(field))
          .forEach(field => {
            reportSteps.set(field, stepPath)
          })
      })

    let nextQuestionCode = this.config.startingQuestionCode
    let questionNumber = 0
    let pageNumber = 0
    let lastUrlSuffix = ''
    while (true) {
      questionNumber += 1
      const questionConfig = this.config.questions[nextQuestionCode]
      if (!questionConfig.active) {
        logger.warn(
          'Question progress in report %s passing through inactive question: %s',
          this.report.id,
          nextQuestionCode,
        )
      }
      const urlSuffix = reportSteps.get(nextQuestionCode)
      if (urlSuffix !== lastUrlSuffix) {
        pageNumber += 1
        lastUrlSuffix = urlSuffix
      }
      const responses: Response[] | undefined = reportResponses.get(questionConfig.code)
      const responseItems = responses?.map(response => {
        let answerConfig = findAnswerConfigByResponse(response.response, questionConfig, true)
        if (!answerConfig) {
          answerConfig = findAnswerConfigByResponse(response.response, questionConfig, false)
          if (answerConfig) {
            logger.warn(
              'Question progress in report %s passing through inactive response: %s',
              this.report.id,
              response.response,
            )
          }
        }
        if (!answerConfig) {
          logger.error('Question progress in report %s found no response: %s', this.report.id, response.response)
        }
        return new ResponseItem(response, answerConfig)
      })
      yield new QuestionProgressStep(questionConfig, responseItems, urlSuffix, questionNumber, pageNumber)
      nextQuestionCode = responseItems?.[0]?.answerConfig?.nextQuestionCode
      if (!nextQuestionCode) {
        break
      }
    }
  }

  /**
   * Find the first question step that hasn’t been completed
   */
  firstIncompleteStep(): QuestionProgressStep | null {
    for (const step of this) {
      if (!step.isComplete) {
        return step
      }
    }
    return null
  }

  /**
   * Do completed questions reach a terminus?
   */
  get isComplete(): boolean {
    return this.firstIncompleteStep() === null
  }
}
