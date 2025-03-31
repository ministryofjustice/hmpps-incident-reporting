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
    const question = parseInt(parts[0], 10)
    if (question > 0) {
      return { question }
    }
  }

  if (parts.length === 3) {
    const question = parseInt(parts[0], 10)
    const response = parseInt(parts[1], 10)
    if (question > 0 && response > 0 && (parts[2] === 'comment' || parts[2] === 'date')) {
      return { question, response, conditionalField: parts[2] }
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
