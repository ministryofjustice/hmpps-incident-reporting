/* eslint-disable import/prefer-default-export */
import { setDifference, setToString } from '../../utils/setUtils'
import { dfs, graphToString, type Graph, type Path } from './directedGraphs'
import { type IncidentTypeConfiguration } from './types'

export function validateConfig(config: IncidentTypeConfiguration): Error[] {
  const errors: Error[] = []

  checkStartingQuestion(config, errors)

  const questionsConnections = buildQuestionnaireGraph(config)
  checkUnknownQuestions(questionsConnections, errors)

  const dfsResult = dfs(config.startingQuestionId, questionsConnections)
  checkCycles(dfsResult.cycles, errors)
  checkUnreachableQuestions(questionsConnections, dfsResult.visited, errors)

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

function checkUnknownQuestions<Q>(questionConnections: Graph<Q>, errors: Error[]) {
  const allNextQuestionIds = new Set<Q>()
  for (const nextQuestionIds of questionConnections.values()) {
    nextQuestionIds.forEach(nextQuestionId => allNextQuestionIds.add(nextQuestionId))
  }

  const unknownQuestions = [...allNextQuestionIds].filter(questionId => !questionConnections.has(questionId))

  if (unknownQuestions.length > 0) {
    errors.push(new Error(`Some answers lead to these unknown questions: ${unknownQuestions.join(', ')}`))
  }
}

function checkUnreachableQuestions<Q>(questionConnections: Graph<Q>, visitedQuestions: Set<Q>, errors: Error[]) {
  const allQuestions: Set<Q> = new Set(questionConnections.keys())
  const unreachableQuestions = setDifference(allQuestions, visitedQuestions)

  if (unreachableQuestions.size > 0) {
    errors.push(new Error(`The following questions are unreachable: ${setToString(unreachableQuestions)}`))
  }
}

function buildQuestionnaireGraph(config: IncidentTypeConfiguration): Graph<string> {
  const connections: Map<string, Set<string>> = new Map()

  for (const question of Object.values(config.questions)) {
    const nextQuestionIds = new Set<string>()
    for (const answer of question.answers) {
      // Skip null/undefined next question ids (usually in final questions)
      if (answer.nextQuestionId !== null && answer.nextQuestionId !== undefined) {
        nextQuestionIds.add(answer.nextQuestionId)
      }
    }

    connections.set(question.id, nextQuestionIds)
  }

  return connections
}

function checkCycles<T>(cycles: Path<T>[], errors: Error[]) {
  for (const cycle of cycles) {
    errors.push(new Error(`Question cycle detected: ${cycle} loops back to ${cycle[0]}`))
  }
}
