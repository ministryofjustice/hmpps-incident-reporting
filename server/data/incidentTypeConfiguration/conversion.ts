import { NomisType, Type, types } from '../../reportConfiguration/constants'
import {
  type IncidentTypeConfiguration as NomisIncidentTypeConfiguration,
  type QuestionConfiguration as NomisQuestionConfiguration,
  type AnswerConfiguration as NomisAnswerConfiguration,
} from '../prisonApi'
import {
  type IncidentTypeConfiguration as DpsIncidentTypeConfiguration,
  type QuestionConfiguration as DpsQuestionConfiguration,
} from './types'

/**
 * Converts a NOMIS incident type configuration into the new DPS one
 */
export function fromNomis(nomisConfig: NomisIncidentTypeConfiguration): DpsIncidentTypeConfiguration {
  const sortByQuestionSequence = (q1: NomisQuestionConfiguration, q2: NomisQuestionConfiguration) =>
    q1.questionSeq - q2.questionSeq
  const sortByAnswerSequence = (a1: NomisAnswerConfiguration, a2: NomisAnswerConfiguration) =>
    a1.answerSeq - a2.answerSeq

  const nomisQuestions = nomisConfig.questions.sort(sortByQuestionSequence)
  return {
    incidentType: typeFromNomisCode(nomisConfig.incidentType),
    active: nomisConfig.active === true,
    // 1st question is starting question
    startingQuestionId: nomisQuestions[0]?.questionnaireQueId?.toString() ?? null,
    questions: nomisQuestions.reduce((qs: Record<string, DpsQuestionConfiguration>, q: NomisQuestionConfiguration) => {
      const nomisAnswers = q.answers.sort(sortByAnswerSequence)

      const questionId = q.questionnaireQueId?.toString() ?? null
      // eslint-disable-next-line no-param-reassign
      qs[questionId] = {
        id: questionId,
        code: q.questionDesc,
        label: q.questionDesc,
        multipleAnswers: q.multipleAnswerFlag === true,
        answers: nomisAnswers.map(ans => {
          const nextQuestionId = ans.nextQuestionnaireQueId?.toString() ?? null
          return {
            code: ans.answerDesc,
            label: ans.answerDesc,
            commentRequired: ans.commentRequiredFlag === true,
            dateRequired: ans.dateRequiredFlag === true,
            nextQuestionId,
          }
        }),
      }
      return qs
    }, {}),
  }
}

/**
 * Converts a DPS incident type into the graphviz/DOT format
 */
export function toGraphviz(config: DpsIncidentTypeConfiguration): string {
  const questions = Object.values(config.questions)

  let result = `digraph ${config.incidentType} {`
  // Left to right
  result += '  rankdir=LR;\n'
  // Nodes are cicles
  result += '  node [shape = circle];\n'
  // Start arrow to first question
  result += '  START_NODE [label="", shape=none];\n'
  result += `  START_NODE -> ${config.startingQuestionId} [label = "start"];\n`
  // End node
  result += '  END_NODE [label="END", shape="doublecircle"];\n'

  // Adds the questions as nodes, answers as edges
  for (const question of questions) {
    result += `  ${question.id} [label = "${question.label}"];\n`
    for (const answer of question.answers) {
      const nextNode = answer.nextQuestionId ?? 'END_NODE'

      result += `  ${question.id} -> ${nextNode} [label = "${answer.label}"];\n`
    }
  }

  result += '}'

  return result
}

function typeFromNomisCode(nomisCode: NomisType): Type {
  const dpsType = types.find(type => type.nomisCode === nomisCode)

  if (!dpsType) {
    throw new Error(`NomisType with code ${nomisCode} not found`)
  }

  return dpsType.code
}
