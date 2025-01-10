import { findAnswerConfigByCode, IncidentTypeConfiguration } from '../data/incidentTypeConfiguration/types'

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
   * returning the question IDs which were not visited, given the current
   * answers.
   *
   * @param report config
   * @param answeredQuestions list of questions answered (and their responses)
   *
   * @returns list of question IDs to delete
   */
  public static forGivenAnswers(config: IncidentTypeConfiguration, answeredQuestions: AnsweredQuestion[]): string[] {
    const currentQuestionsIds = answeredQuestions.map(question => question.code)

    const visitedQuestions = this.traverseQuestionnaire(config, config.startingQuestionId, answeredQuestions)

    // Delete questions not visited, they're in non-visited branches
    return currentQuestionsIds.filter(questionId => !visitedQuestions.includes(questionId))
  }

  /**
   * Traverses the questionnaire tree and return the visited question IDs
   *
   * The traversal starts at `start` and is based off the already answered
   * questions.
   *
   * @param report config
   * @param start question ID where to start
   * @param answeredQuestions list of questions answered (and their responses)
   *
   * @returns list of question IDs to delete
   */
  private static traverseQuestionnaire(
    config: IncidentTypeConfiguration,
    start: string,
    answeredQuestions: AnsweredQuestion[],
  ): string[] {
    const nextQuestionId = this.findNextQuestionId(config, start, answeredQuestions)
    if (!nextQuestionId) {
      return []
    }

    return [start, ...this.traverseQuestionnaire(config, nextQuestionId, answeredQuestions)]
  }

  /**
   * Returns the next question ID given the current answers
   *
   * The logic is "clever" enough to determine the next question ID
   * for some unanswered questions if no branching occurs.
   *
   * The implications of this is that more of the previous answers can
   * be potentially preserved. For example, changing an answer may leads to
   * a new branch with some unanswered questions, however this branch
   * may not have any further sub-branching and it may re-join a previously
   * answered question 'QX': In this case this question 'QX' would still be
   * valid and it could be retained.
   *
   * @param report config
   * @param start question ID where to start
   * @param answeredQuestions list of questions answered (and their responses)
   *
   * @returns the next question ID after a question
   */
  private static findNextQuestionId(
    config: IncidentTypeConfiguration,
    start: string,
    answeredQuestions: AnsweredQuestion[],
  ): string | null {
    const answeredQuestion = answeredQuestions.find(question => question.code === start)
    let questionConfig = null
    let answerConfig = null

    if (answeredQuestion) {
      questionConfig = config.questions[answeredQuestion.code]
      if (questionConfig) {
        const response = answeredQuestion.responses[0]
        answerConfig = findAnswerConfigByCode(response.response, questionConfig)
      }
    } else {
      // Current question not answered, but peraphs there is no branching...
      // and we can still determine the next question
      questionConfig = config.questions[start]
      if (questionConfig) {
        const nextQuestionIds = new Set(questionConfig.answers.map(ansConf => ansConf.nextQuestionId))
        const noBranching = nextQuestionIds.size === 1
        if (noBranching) {
          // eslint-disable-next-line prefer-destructuring
          answerConfig = questionConfig.answers[0]
        }
      }
    }

    if (!questionConfig || !answerConfig) {
      return null
    }

    return answerConfig.nextQuestionId
  }
}