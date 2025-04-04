import type { AnswerConfiguration, QuestionConfiguration } from './types'
import type { Question, Response } from '../incidentReportingApi'

export function questionFieldName(question: QuestionConfiguration | Question): string {
  if ('answers' in question) {
    return question.id
  }
  return question.code
}

export function conditionalFieldName(
  question: QuestionConfiguration | Question,
  answer: AnswerConfiguration,
  suffix: 'comment' | 'date',
): string {
  return `${questionFieldName(question)}-${answer.id}-${suffix}`
}

export function parseFieldName(
  fieldName: string,
): null | { question: number } | { question: number; response: number; conditionalField: 'comment' | 'date' } {
  const parts = fieldName.split('-')

  if (parts.length === 1) {
    const [questionStr] = parts
    const question = parseInt(questionStr, 10)
    if (question > 0) {
      return { question }
    }
  }

  if (parts.length === 3) {
    const [questionStr, responseStr, conditionalField] = parts
    const question = parseInt(questionStr, 10)
    const response = parseInt(responseStr, 10)
    if (question > 0 && response > 0 && (conditionalField === 'comment' || conditionalField === 'date')) {
      return { question, response, conditionalField }
    }
  }

  return null
}

/** Finds the Answer config for a given answer code */
export function findAnswerConfigByCode(
  answerCode: string,
  questionConfig: QuestionConfiguration,
  mustBeActive = true,
): AnswerConfiguration {
  return questionConfig.answers.find(
    answerConfig => (answerConfig.active || !mustBeActive) && answerConfig.code === answerCode.trim(),
  )
}

/** Finds the Answer config for a given Response inside a report */
export function findAnswerConfigForResponse(
  response: Response,
  questionConfig: QuestionConfiguration,
  mustBeActive = true,
): AnswerConfiguration {
  return findAnswerConfigByCode(response.response, questionConfig, mustBeActive)
}
