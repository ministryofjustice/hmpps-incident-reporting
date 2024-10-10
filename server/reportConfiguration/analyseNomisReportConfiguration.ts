import type { IncidentTypeConfiguration } from '../data/prisonApi'

/**
 * Check that NOMIS report configuration is logically consistent:
 * - ensures ids are unique
 * - ensures types are unique
 * - ensures question ids are unique
 * - ensures answer ids are unique
 * - TODO: ensure question routes all end with null next question
 * - TODO: ensure question routes remain within one type
 * - TODO: ensure question routes are acyclic
 * - TODO: ensure active question routes only go through other active questions if configuration is active
 * - TODO: ensure only known prisoner roles are listed
 *
 * @param incidentTypes must include ALL report configuration, not just active
 */
// eslint-disable-next-line import/prefer-default-export
export function analyseNomisReportConfiguration(incidentTypes: readonly IncidentTypeConfiguration[]): Error[] {
  const results: Error[] = []

  const ids = new Set<number>()
  const types = new Set<string>()
  let questionCount = 0
  const questionIds = new Set<number>()
  let answerCount = 0
  const answerIds = new Set<number>()

  incidentTypes.forEach(incidentType => {
    ids.add(incidentType.questionnaireId)
    types.add(incidentType.incidentType)
    questionCount += incidentType.questions.length

    let firstQuestionId: number | null = null
    const questionConnections = new Map<number, Set<number>>()

    incidentType.questions.forEach(question => {
      questionIds.add(question.questionnaireQueId)
      answerCount += question.answers.length

      if (firstQuestionId === null) {
        firstQuestionId = question.questionnaireQueId
      }
      questionConnections.set(
        question.questionnaireQueId,
        new Set(question.answers.map(answer => answer.nextQuestionnaireQueId)),
      )

      question.answers.forEach(answer => {
        answerIds.add(answer.questionnaireAnsId)
      })
    })

    try {
      enumeratePaths(firstQuestionId, questionConnections)
    } catch (e) {
      results.push(e)
    }
  })

  if (ids.size !== incidentTypes.length) {
    results.push(new Error(`There are ${incidentTypes.length} configurations but ${ids.size} unique ids`))
  }
  if (types.size !== incidentTypes.length) {
    results.push(new Error(`There are ${incidentTypes.length} configurations but ${types.size} unique types`))
  }
  if (questionIds.size !== questionCount) {
    results.push(new Error(`There are ${questionCount} questions but ${questionIds.size} unique question ids`))
  }
  if (answerIds.size !== answerCount) {
    results.push(new Error(`There are ${answerCount} answers but ${answerIds.size} unique answer ids`))
  }

  return results
}

function enumeratePaths(firstQuestionId: number, questionConnections: Map<number, Set<number>>): number {
  function walkPath(paths: number[][], path: number[], nextQuestionId: number | null) {
    if (nextQuestionId === null || nextQuestionId === undefined) {
      return
    }
    const nextQuestionIds = questionConnections.get(nextQuestionId)
    if (!nextQuestionIds) {
      throw new Error(`Question id ${nextQuestionId} is not within report`)
    }
    if (path.includes(nextQuestionId)) {
      throw new Error(`Question cycle detected: ${path} loops back to ${nextQuestionId}`)
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

  const paths: number[][] = []
  const firstPath: number[] = []
  paths.push(firstPath)
  walkPath(paths, firstPath, firstQuestionId)
  return paths.length
}
