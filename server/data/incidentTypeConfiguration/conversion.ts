import nunjucks from 'nunjucks'

import { type IncidentTypeConfiguration as DpsIncidentTypeConfiguration } from './types'

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
  START_NODE -> {{ config.startingQuestionCode }} [label = "start"];
  END_NODE [label="END", shape="doublecircle"];

  {%- for question in questions %}
    {{ question.code }} [label=< <FONT COLOR="royalblue">{{ question.code }} </FONT> {{ question.label }} >
      {%- if not question.active -%}
        , style="filled", color="#DDD"
      {%- endif -%}
      ];
    {%- for answer in question.answers %}
      {{ question.code }} -> {{ answer.nextQuestionCode or 'END_NODE' }} [label=< <FONT COLOR="royalblue">{{ answer.code }} </FONT> {{ answer.label }} >
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
