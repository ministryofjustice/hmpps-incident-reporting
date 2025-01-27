import type FormWizard from 'hmpo-form-wizard'

import type { ReportWithDetails } from '../incidentReportingApi'
import type { AnswerConfiguration, IncidentTypeConfiguration, QuestionConfiguration } from './types'

/** A step in the process of responding to all necessary questions in a report */
export interface QuestionProgressStep {
  /** This step’s question */
  questionConfig: QuestionConfiguration
  /** This question step’s URL path suffix */
  urlSuffix: string
  /** Question number ignoring grouping */
  questionNumber: number
  /** Page number when questions are grouped */
  pageNumber: number
  /** All of this question step’s chosen responses or undefined if not completed */
  answerConfigs: AnswerConfiguration[] | undefined
  /** Whether this question step has been completed */
  isComplete: boolean
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
    // map of question id to response codes
    const reportResponses = new Map<string, string[]>()
    this.report.questions.forEach(question => {
      reportResponses.set(
        question.code,
        question.responses.map(response => response.response),
      )
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
      const responseCodes: string[] | undefined = reportResponses.get(questionConfig.id)
      const answerConfigs = responseCodes?.map(responseCode =>
        questionConfig.answers.find(someAnswerConfig => someAnswerConfig.code === responseCode),
      )
      yield { questionConfig, urlSuffix, questionNumber, pageNumber, answerConfigs, isComplete: Boolean(answerConfigs) }
      // TODO: assuming multiple choice questions have options all leading to the same place. was this validated?
      nextQuestionId = answerConfigs?.[0]?.nextQuestionId
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
