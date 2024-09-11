import type { IncidentTypeConfiguration } from '../data/prisonApi'

/**
 * Check that NOMIS report configuration is logically consistent:
 * - ensures ids are unique
 * - ensures types are unique
 * - ensures question ids are unique
 * - ensures answer ids are unique
 *
 * @param incidentTypes must include ALL report configuration, not just active
 */
// eslint-disable-next-line import/prefer-default-export
export function analyseNomisReportConfiguration(incidentTypes: IncidentTypeConfiguration[]): Error[] {
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

    incidentType.questions.forEach(question => {
      questionIds.add(question.questionnaireQueId)
      answerCount += question.answers.length

      question.answers.forEach(answer => {
        answerIds.add(answer.questionnaireAnsId)
      })
    })
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
