// eslint-disable-next-line max-classes-per-file
import type FormWizard from 'hmpo-form-wizard'

import type { ReportWithDetails, Response } from '../incidentReportingApi'
import type { AnswerConfiguration, IncidentTypeConfiguration, QuestionConfiguration } from './types'

/** A step in the process of responding to all necessary questions in a report */
export class QuestionProgressStep {
  constructor(
    /** This step’s question */
    readonly questionConfig: QuestionConfiguration,
    /** All of this question step’s chosen responses or undefined if not completed */
    readonly responses: ResponseItem[] | undefined,
    /** This question step’s URL path suffix */
    readonly urlSuffix: string,
    /** Question number ignoring grouping */
    readonly questionNumber: number,
    /** Page number when questions are grouped */
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

    let nextQuestionId = this.config.startingQuestionId
    let questionNumber = 0
    let pageNumber = 0
    let lastUrlSuffix = ''
    while (true) {
      questionNumber += 1
      const questionConfig = this.config.questions[nextQuestionId]
      const urlSuffix = reportSteps.get(nextQuestionId)
      if (urlSuffix !== lastUrlSuffix) {
        pageNumber += 1
        lastUrlSuffix = urlSuffix
      }
      const responses: Response[] | undefined = reportResponses.get(questionConfig.id)
      const responseItems = responses?.map(response => {
        const answerConfig = questionConfig.answers.find(
          someAnswerConfig => someAnswerConfig.code === response.response,
        )
        return new ResponseItem(response, answerConfig)
      })
      yield new QuestionProgressStep(questionConfig, responseItems, urlSuffix, questionNumber, pageNumber)
      // TODO: assuming multiple choice questions have options all leading to the same place. was this validated? see IR-769
      nextQuestionId = responseItems?.[0]?.answerConfig?.nextQuestionId
      if (!nextQuestionId) {
        break
      }
    }
  }

  /** Get all completed question progress steps */
  completedSteps(): ReadonlyArray<QuestionProgressStep> {
    return Array.from(this).filter(step => step.isComplete)
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
