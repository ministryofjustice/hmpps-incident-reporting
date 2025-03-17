import type { AnswerConfiguration, QuestionConfiguration } from './types'
import type { Question } from '../incidentReportingApi'

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
