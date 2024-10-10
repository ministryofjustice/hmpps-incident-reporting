/* eslint-disable import/prefer-default-export */
import { setToString } from '../../utils/setUtils'
import { DfsResult, Graph } from './directedGraphs'
import { type IncidentTypeConfiguration } from './types'

export function validateConfig(config: IncidentTypeConfiguration): Error[] {
  const errors: Error[] = []
  const configGraph = buildConfigGraph(config, errors)

  checkStartingQuestion(config, errors)
  checkUnknownQuestions(configGraph, errors)

  const dfsResult = configGraph.dfs(config.startingQuestionId)
  checkUnreachableQuestions(configGraph, dfsResult, errors)
  checkCycles(dfsResult, errors)

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

  const startingQuestion = config?.questions[config.startingQuestionId]
  if (!startingQuestion) {
    errors.push(new Error('starting question is unknown'))
  } else if (startingQuestion?.active !== true) {
    errors.push(new Error('starting question is inactive'))
  }
}

function checkUnknownQuestions<Q>(configGraph: Graph<Q>, errors: Error[]) {
  const unknownQuestions = configGraph.getInvalidNodes()

  if (unknownQuestions.size > 0) {
    errors.push(new Error(`some answers lead to these unknown or inactive questions: ${setToString(unknownQuestions)}`))
  }
}

function checkUnreachableQuestions<Q>(configGraph: Graph<Q>, dfsResult: DfsResult<Q>, errors: Error[]) {
  const unreachableQuestions = configGraph.getUnreachableNodes(dfsResult)

  if (unreachableQuestions.size > 0) {
    errors.push(new Error(`the following questions are unreachable: ${setToString(unreachableQuestions)}`))
  }
}

function buildConfigGraph(config: IncidentTypeConfiguration, errors: Error[]): Graph<string> {
  const graph = new Graph<string>()

  const activeQuestions = Object.values(config.questions).filter(q => q.active === true)
  for (const question of activeQuestions) {
    const activeAnswers = question.answers.filter(ans => ans.active === true)
    if (activeAnswers.length === 0) {
      errors.push(new Error(`active question ${question.id} has no active answers`))
    }
    for (const answer of activeAnswers) {
      graph.addEdge(question.id, answer.nextQuestionId)
    }
  }

  return graph
}

function checkCycles<T>(dfsResult: DfsResult<T>, errors: Error[]) {
  for (const cycle of dfsResult.cycles) {
    errors.push(new Error(`question cycle detected: ${cycle}`))
  }
}
