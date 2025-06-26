/* eslint-disable import/prefer-default-export */
import { setToString } from '../../utils/setUtils'
import { DfsResult, Graph } from './directedGraphs'
import { type IncidentTypeConfiguration } from './types'

export function validateConfig(config: IncidentTypeConfiguration): Error[] {
  const errors: Error[] = []
  const configGraph = buildConfigGraph(config)

  checkStartingQuestion(config, errors)
  checkCodesDontIncludeHyphens(config, errors)
  checkQuestionsWithoutAnswers(config, errors)
  checkMultipleChoicesNextQuestions(config, errors)
  checkUnknownQuestions(configGraph, errors)

  const dfsResult = configGraph.dfs(config.startingQuestionCode)
  checkUnreachableQuestions(configGraph, dfsResult, errors)
  checkCycles(dfsResult, errors)

  checkSomePrisonerRolesExist(config, errors)

  return errors
}

function checkStartingQuestion(config: IncidentTypeConfiguration, errors: Error[]): void {
  if (config.startingQuestionCode === null) {
    errors.push(new Error('startingQuestionCode is null'))
  } else if (config.startingQuestionCode === undefined) {
    errors.push(new Error('startingQuestionCode is undefined'))
  } else if (config.startingQuestionCode.length === 0) {
    errors.push(new Error('startingQuestionCode is empty string'))
  }

  const startingQuestion = config?.questions[config.startingQuestionCode]
  if (!startingQuestion) {
    errors.push(new Error('starting question is unknown'))
  } else if (startingQuestion?.active !== true) {
    errors.push(new Error('starting question is inactive'))
  }
}

function checkCodesDontIncludeHyphens(config: IncidentTypeConfiguration, errors: Error[]): void {
  Object.values(config.questions)
    .filter(question => question.active)
    .forEach(question => {
      if (question.code.includes('-')) {
        errors.push(new Error(`active question '${question.code}' has hiphen in its code`))
      }

      question.answers
        .filter(answer => answer.active)
        .forEach(answer => {
          if (answer.code.includes('-')) {
            errors.push(new Error(`active answer '${answer.code}' has hiphen in its code`))
          }
        })
    })
}

function checkQuestionsWithoutAnswers(config: IncidentTypeConfiguration, errors: Error[]): void {
  Object.values(config.questions)
    .filter(question => question.active === true)
    .forEach(question => {
      const activeAnswersExist = question.answers.some(answer => answer.active)
      if (!activeAnswersExist) {
        errors.push(new Error(`active question ${question.code} has no active answers`))
      }
    })
}

function checkMultipleChoicesNextQuestions(config: IncidentTypeConfiguration, errors: Error[]): void {
  const activeQs = Object.values(config.questions).filter(q => q.active)
  const multipleChoicesQs = activeQs.filter(q => q.multipleAnswers)
  const invalidQs = multipleChoicesQs.filter(q => {
    const activeAs = q.answers.filter(a => a.active)
    const nextQuestionCodes = new Set(activeAs.map(a => a.nextQuestionCode))
    return nextQuestionCodes.size > 1
  })

  if (invalidQs.length > 0) {
    const invalidQuestionsCodes = invalidQs.map(q => q.code)
    errors.push(
      new Error(
        `the following multiple choices questions can lead to different next questions: ${invalidQuestionsCodes.join(', ')}`,
      ),
    )
  }
}

function checkUnknownQuestions<Q>(configGraph: Graph<Q>, errors: Error[]): void {
  const unknownQuestions = configGraph.getInvalidNodes()

  if (unknownQuestions.size > 0) {
    errors.push(new Error(`some answers lead to these unknown or inactive questions: ${setToString(unknownQuestions)}`))
  }
}

function checkUnreachableQuestions<Q>(configGraph: Graph<Q>, dfsResult: DfsResult<Q>, errors: Error[]): void {
  const unreachableQuestions = configGraph.getUnreachableNodes(dfsResult)

  if (unreachableQuestions.size > 0) {
    errors.push(new Error(`the following questions are unreachable: ${setToString(unreachableQuestions)}`))
  }
}

function buildConfigGraph(config: IncidentTypeConfiguration): Graph<string> {
  const graph = new Graph<string>()

  const activeQuestions = Object.values(config.questions).filter(q => q.active === true)
  for (const question of activeQuestions) {
    const activeAnswers = question.answers.filter(ans => ans.active === true)
    for (const answer of activeAnswers) {
      graph.addEdge(question.code, answer.nextQuestionCode)
    }
  }

  return graph
}

function checkCycles<T>(dfsResult: DfsResult<T>, errors: Error[]): void {
  for (const cycle of dfsResult.cycles) {
    errors.push(new Error(`question cycle detected: ${cycle}`))
  }
}

function checkSomePrisonerRolesExist(config: IncidentTypeConfiguration, errors: Error[]): void {
  if (!config.prisonerRoles.some(role => role.active)) {
    errors.push(new Error('no active prisoner roles exist'))
  }
}
