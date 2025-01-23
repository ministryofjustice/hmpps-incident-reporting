import type { ReportWithDetails } from '../incidentReportingApi'
import type { AnswerConfiguration, IncidentTypeConfiguration, QuestionConfiguration } from './types'

export interface QuestionProgressStep {
  questionConfig: QuestionConfiguration
  answerConfig?: AnswerConfiguration
  isComplete: boolean
}

export class QuestionProgress {
  constructor(
    private readonly config: IncidentTypeConfiguration,
    private readonly report: ReportWithDetails,
  ) {}

  /**
   * Walks through a report, yielding question configurations and their _first_ response configuration.
   * The report’s responses could be invalid so the configuration is used to decide proper question order.
   *
   * TODO: report validation is incomplete! does not check comment/date fields nor whether all responses are valid
   */
  *walkQuestions(): Generator<QuestionProgressStep> {
    // map of question id to _first_ response code (assume multiple choice questions have options all leading to the same place)
    const reportResponses = new Map<string, string>()
    this.report.questions.forEach(question =>
      reportResponses.set(question.code, question.responses.map(response => response.response)[0]),
    )

    let nextQuestionId = this.config.startingQuestionId
    while (true) {
      const questionConfig = this.config.questions[nextQuestionId]
      const firstResponseCode = reportResponses.get(questionConfig.id)
      const answerConfig = questionConfig.answers.find(someAnswerConfig => someAnswerConfig.code === firstResponseCode)
      yield { questionConfig, answerConfig, isComplete: Boolean(answerConfig) }
      nextQuestionId = answerConfig?.nextQuestionId
      if (!nextQuestionId) {
        break
      }
    }
  }

  /**
   * Find the first question that hasn’t been completed
   */
  firstIncompleteQuestion(): QuestionConfiguration | null {
    for (const step of this.walkQuestions()) {
      if (!step.isComplete) {
        return step.questionConfig
      }
    }
    return null
  }

  /**
   * Do completed questions reach a terminus?
   */
  get isComplete(): boolean {
    return this.firstIncompleteQuestion() === null
  }
}
