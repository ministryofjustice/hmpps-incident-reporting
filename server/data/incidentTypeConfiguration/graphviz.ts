import { type IncidentTypeConfiguration } from './types'

// eslint-disable-next-line import/prefer-default-export
export function toGraphviz(config: IncidentTypeConfiguration): string {
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
