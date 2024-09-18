/* eslint-disable import/prefer-default-export */
import { type IncidentTypeConfiguration } from './types'

export function validateConfig(config: IncidentTypeConfiguration): Error[] {
  const errors: Error[] = []

  checkStartingQuestion(config, errors)

  const questionsConnections = buildQuestionsConnections(config)

  checkUnknownQuestions(questionsConnections, errors)

  return errors
}

function checkStartingQuestion(config: IncidentTypeConfiguration, errors: Error[]) {
  if (config.startingQuestionId === null) {
    errors.push(new Error('startingQuestionId is null'))
  } else if (config.startingQuestionId === undefined) {
    errors.push(new Error('startingQuestionId is undefined'))
  } else if (config.startingQuestionId.length === 0) {
    errors.push(new Error('startingQuestionId is empty string'))
  }
}

function checkUnknownQuestions<Q>(questionConnections: Map<Q, Set<Q>>, errors: Error[]) {
  const allNextQuestionIds = new Set<Q>()
  for (const nextQuestionIds of questionConnections.values()) {
    nextQuestionIds.forEach(nextQuestionId => allNextQuestionIds.add(nextQuestionId))
  }

  const unknownQuestions = [...allNextQuestionIds].filter(
    questionId => questionId !== null && !questionConnections.has(questionId),
  )

  if (unknownQuestions.length > 0) {
    errors.push(new Error(`Some answers lead to these unknown questions: ${unknownQuestions.join(', ')}`))
  }
}

function buildQuestionsConnections(config: IncidentTypeConfiguration): Map<string, Set<string>> {
  const connections: Map<string, Set<string>> = new Map()

  for (const question of Object.values(config.questions)) {
    const nextQuestionIds = new Set(question.answers.map(q => q.nextQuestionId))
    connections.set(question.id, nextQuestionIds)
  }

  return connections
}
