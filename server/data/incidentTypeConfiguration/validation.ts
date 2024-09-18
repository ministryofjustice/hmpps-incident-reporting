/* eslint-disable import/prefer-default-export */
import { type IncidentTypeConfiguration } from './types'

export function validateConfig(config: IncidentTypeConfiguration): Error[] {
  const errors: Error[] = []

  checkStartingQuestion(config, errors)

  const questionsConnections = buildQuestionsConnections(config)
  checkUnknownQuestions(questionsConnections, errors)

  let paths: string[][] = []
  try {
    paths = enumeratePaths(config.startingQuestionId, questionsConnections, errors)
  } catch (e) {
    errors.push(e)
  }

  const allQuestions: Set<string> = new Set(Object.keys(config.questions))
  checkUnreachableQuestions(allQuestions, paths, errors)

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

function enumeratePaths<Q>(firstQuestionId: Q, questionConnections: Map<Q, Set<Q>>, errors: Error[]): Q[][] {
  function walkPath(paths: Q[][], path: Q[], nextQuestionId: Q | null) {
    if (nextQuestionId === null || nextQuestionId === undefined) {
      return
    }
    const nextQuestionIds = questionConnections.get(nextQuestionId)
    if (!nextQuestionIds) {
      // Invalid next question
      return
    }

    if (path.includes(nextQuestionId)) {
      errors.push(new Error(`Question cycle detected: ${path} loops back to ${nextQuestionId}`))
      return
    }
    path.push(nextQuestionId)
    const clonedPath = structuredClone(path)
    let extendedExistingPath = false
    nextQuestionIds.forEach(questionId => {
      if (!extendedExistingPath) {
        extendedExistingPath = true
        walkPath(paths, path, questionId)
      } else {
        const newPath = structuredClone(clonedPath)
        paths.push(newPath)
        walkPath(paths, newPath, questionId)
      }
    })
  }

  const paths: Q[][] = []
  const firstPath: Q[] = []
  paths.push(firstPath)
  walkPath(paths, firstPath, firstQuestionId)

  return paths
}

function checkUnreachableQuestions<Q>(allQuestions: Set<Q>, paths: Q[][], errors: Error[]) {
  const reachedQuestions = new Set<Q>()
  for (const path of paths) {
    for (const questionId of path) {
      reachedQuestions.add(questionId)
    }
  }

  const unreachableQuestions = setDifference(allQuestions, reachedQuestions)

  if (unreachableQuestions.size > 0) {
    const listUnreachableQuestions = [...unreachableQuestions.values()].join(', ')
    errors.push(new Error(`The following questions are unreachable: ${listUnreachableQuestions}`))
  }
}

function setDifference<T>(a: Set<T>, b: Set<T>): Set<T> {
  const diff = new Set<T>(a)

  b.forEach(elem => diff.delete(elem))

  return diff
}
