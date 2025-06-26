import type {
  AnswerConfiguration,
  IncidentTypeConfiguration,
  QuestionConfiguration,
} from '../data/incidentTypeConfiguration/types'
import { findAnswerConfigByCode } from '../data/incidentTypeConfiguration/utils'

const endReached = Symbol('endReached')

/**
 * This interface is a subset of the API's `Question`
 *
 * The logic to determine questions to delete only needs
 * the question `code` and the responses' `response`
 */
interface AnsweredQuestion {
  code: string
  responses: { response: string }[]
}

export default class QuestionsToDelete {
  /**
   * Determines which of the currently answered questions need to be deleted
   *
   * This is done by traversing the questionnaire tree (from the start) and
   * returning the question codes which were not visited, given the current
   * answers.
   *
   * @param config incident type config
   * @param answeredQuestions list of questions answered (and their responses)
   *
   * @returns list of question codes to delete
   */
  public static forGivenAnswers(config: IncidentTypeConfiguration, answeredQuestions: AnsweredQuestion[]): string[] {
    const currentQuestionsCodes = answeredQuestions.map(question => question.code)

    const visitedQuestions = this.traverseQuestionnaire(config, config.startingQuestionCode, answeredQuestions)

    // Delete questions not visited, they're in non-visited branches
    return currentQuestionsCodes.filter(questionCode => !visitedQuestions.includes(questionCode))
  }

  /**
   * Traverses the questionnaire tree and return the visited question codes
   *
   * The traversal starts at `start` and is based off the already answered
   * questions.
   *
   * @param config incident type config
   * @param start question code where to start
   * @param answeredQuestions list of questions answered (and their responses)
   *
   * @returns list of question codes to delete
   */
  private static traverseQuestionnaire(
    config: IncidentTypeConfiguration,
    start: string,
    answeredQuestions: AnsweredQuestion[],
  ): string[] {
    const nextQuestionCode = this.findNextQuestionCode(config, start, answeredQuestions)
    if (!nextQuestionCode) {
      // question not found or answer is invalid
      return []
    }
    if (nextQuestionCode === endReached) {
      // answer was found and reached the end
      return [start]
    }

    // answer was found and another step follows
    return [start, ...this.traverseQuestionnaire(config, nextQuestionCode as string, answeredQuestions)]
  }

  /**
   * Returns the next question code given the current answers
   *
   * The logic is "clever" enough to determine the next question code
   * for some unanswered questions if no branching occurs.
   *
   * The implications of this is that more of the previous answers can
   * be potentially preserved. For example, changing an answer may leads to
   * a new branch with some unanswered questions, however this branch
   * may not have any further sub-branching and it may re-join a previously
   * answered question 'QX': In this case this question 'QX' would still be
   * valid and it could be retained.
   *
   * @param config incident type config
   * @param start question code where to start
   * @param answeredQuestions list of questions answered (and their responses)
   *
   * @returns the next question code after a question
   */
  private static findNextQuestionCode(
    config: IncidentTypeConfiguration,
    start: string,
    answeredQuestions: AnsweredQuestion[],
  ): string | symbol | null {
    const answeredQuestion = answeredQuestions.find(question => question.code === start)
    let questionConfig: QuestionConfiguration | null
    let answerConfig: AnswerConfiguration | null = null

    if (answeredQuestion) {
      questionConfig = config.questions[answeredQuestion.code]
      if (questionConfig) {
        const response = answeredQuestion.responses[0]
        answerConfig = findAnswerConfigByCode(response.response, questionConfig)
      }
    } else {
      // Current question not answered, but perhaps there is no branching...
      // and we can still determine the next question
      questionConfig = config.questions[start]
      if (questionConfig) {
        const activeAnswers = questionConfig.answers.filter(ansConf => ansConf.active)
        const nextQuestionCodes = new Set(activeAnswers.map(ansConf => ansConf.nextQuestionCode))
        const noBranching = nextQuestionCodes.size === 1
        if (noBranching) {
          // eslint-disable-next-line prefer-destructuring
          answerConfig = activeAnswers[0]
        }
      }
    }

    if (!questionConfig || !answerConfig) {
      return null
    }

    return answerConfig.nextQuestionCode ?? endReached
  }
}
