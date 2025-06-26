import nunjucks from 'nunjucks'

import {
  type NomisPrisonerInvolvementRole,
  type NomisType,
  type PrisonerInvolvementRole,
  type Type,
  prisonerInvolvementRoles,
  types,
} from '../../reportConfiguration/constants'
import { addQuestionMarkToQuestion, convertToSentenceCase } from '../../utils/utils'
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
 *
 * @returns DpsIncidentTypeConfiguration
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
    startingQuestionCode: nomisQuestions[0]?.questionnaireQueId?.toString() ?? null,
    questions: nomisQuestions.reduce((qs: Record<string, DpsQuestionConfiguration>, q: NomisQuestionConfiguration) => {
      const nomisAnswers = q.answers.sort(sortByAnswerSequence)

      const questionCode = q.questionnaireQueId?.toString() ?? null
      // eslint-disable-next-line no-param-reassign
      qs[questionCode] = {
        code: questionCode,
        active: q.questionActiveFlag === true,
        question: q.questionDesc,
        label: addQuestionMarkToQuestion(convertToSentenceCase(q.questionDesc)),
        multipleAnswers: q.multipleAnswerFlag === true,
        answers: nomisAnswers.map(ans => {
          const nextQuestionCode = ans.nextQuestionnaireQueId?.toString() ?? null
          return {
            code: ans.questionnaireAnsId.toString(),
            response: ans.answerDesc,
            active: ans.answerActiveFlag === true,
            label: convertToSentenceCase(ans.answerDesc),
            commentRequired: ans.commentRequiredFlag === true,
            dateRequired: ans.dateRequiredFlag === true,
            nextQuestionCode,
          }
        }),
      }
      return qs
    }, {}),
    prisonerRoles: nomisConfig.prisonerRoles.map(nomisPrisonerRoleConfig => {
      const nomisPrisonerRole = nomisPrisonerRoleConfig.prisonerRole
      const dpsPrisonerRole = prisonerInvolvementRoleFromNomisCode(nomisPrisonerRole)
      return {
        prisonerRole: dpsPrisonerRole,
        onlyOneAllowed: nomisPrisonerRoleConfig.singleRole === true,
        active: nomisPrisonerRoleConfig.active === true,
      }
    }),
  }
}

/**
 * Converts a DPS incident type into TypeScript
 *
 * @returns string containing the TS output
 */
export function toTypescript({
  scriptName,
  dpsConfig,
}: {
  scriptName: string
  dpsConfig: DpsIncidentTypeConfiguration
}): string {
  let result = `// Generated with ${scriptName} at ${new Date().toISOString()}\n\n`

  // Import type
  result += "import type { IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'\n\n"

  // Declare incident type configuration constant
  result += `export const ${dpsConfig.incidentType}: IncidentTypeConfiguration = ${JSON.stringify(dpsConfig, null, 2)}\n\n`

  // Export as default
  result += `export default ${dpsConfig.incidentType}\n`

  return result
}

/**
 * Converts a DPS incident type into the graphviz/DOT format
 *
 * @returns string containing the DOT format output
 */
export function toGraphviz(config: DpsIncidentTypeConfiguration): string {
  const questions = Object.values(config.questions)
  const graphvizString = nunjucks
    .renderString(
      // language=graphviz
      `
digraph {{ config.incidentType }} {
  rankdir=LR;
  node [shape = circle];

  START_NODE [label="", shape=none];
  START_NODE -> {{ config.startingQuestionId }} [label = "start"];
  END_NODE [label="END", shape="doublecircle"];

  {%- for question in questions %}
    {{ question.id }} [label=< <FONT COLOR="royalblue">{{ question.id }} </FONT> {{ question.label }} >
      {%- if not question.active -%}
        , style="filled", color="#DDD"
      {%- endif -%}
      ];
    {%- for answer in question.answers %}
      {{ question.id }} -> {{ answer.nextQuestionId or 'END_NODE' }} [label=< <FONT COLOR="royalblue">{{ answer.id }} </FONT> {{ answer.label }} >
        {%- if not answer.active -%}
          , color="#DDD"
        {%- endif -%}
        ];
    {%- endfor %}
  {%- endfor %}
}
      `,
      { config, questions },
    )
    .trim()
  return `${graphvizString}\n`
}

function typeFromNomisCode(nomisCode: NomisType): Type {
  const dpsType = types.find(type => type.nomisCode === nomisCode)

  if (!dpsType) {
    throw new Error(`NomisType with code ${nomisCode} not found`)
  }

  return dpsType.code
}

function prisonerInvolvementRoleFromNomisCode(nomisCode: NomisPrisonerInvolvementRole): PrisonerInvolvementRole {
  const dpsType = prisonerInvolvementRoles.find(prisonerInvolvement => prisonerInvolvement.nomisCode === nomisCode)

  if (!dpsType) {
    throw new Error(`NomisPrisonerInvolvementRole with code ${nomisCode} not found`)
  }

  return dpsType.code
}
