import type FormWizard from 'hmpo-form-wizard'

import type { ReportWithDetails, Response } from '../incidentReportingApi'
import type { AnswerConfiguration, IncidentTypeConfiguration, QuestionConfiguration } from './types'

/** A step in the process of responding to all necessary questions in a report */
export interface QuestionProgressStep {
  /** This step’s question */
  questionConfig: QuestionConfiguration
  /** All of this question step’s chosen responses or undefined if not completed */
  responses: ResponseItem[] | undefined
  /** This question step’s URL path suffix */
  urlSuffix: string
  /** Question number ignoring grouping */
  questionNumber: number
  /** Page number when questions are grouped */
  pageNumber: number
  /** Whether this question step has been completed (ie. responses exist) */
  isComplete: boolean
}

interface ResponseItem {
  /** A response as returned by IRS api */
  response: Response
  /** Corresponding response config as found in this application */
  answerConfig: AnswerConfiguration
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
   * NB: completion flag does **not** fully validate responses, e.g.
   *   - comment/date fields are not checked
   *   - unrecognised responses are ignored
   *   - ignores order of questions in report
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
        return { response, answerConfig }
      })
      yield {
        questionConfig,
        urlSuffix,
        questionNumber,
        pageNumber,
        responses: responseItems,
        isComplete: Boolean(responseItems),
      }
      // TODO: assuming multiple choice questions have options all leading to the same place. was this validated?
      nextQuestionId = responseItems?.[0]?.answerConfig.nextQuestionId
      if (!nextQuestionId) {
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
