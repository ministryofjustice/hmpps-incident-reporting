#!/usr/bin/env npx tsx
import fs from 'node:fs'
import path from 'node:path'

import nunjucks from 'nunjucks'

import { printText } from './utils'
import type {
  IncidentReportingApi,
  Constant,
  TypeConstant,
  StaffRoleConstant,
  PrisonerRoleConstant,
  PrisonerOutcomeConstant,
} from '../server/data/incidentReportingApi'
import { formatCode } from '../server/data/incidentTypeConfiguration/persistance'

interface Arguments {
  scriptName: string
  filePath: string
  template: Template
}

type ConstantsMethod = keyof IncidentReportingApi['constants']
interface Template {
  method: ConstantsMethod
  identifier: string
  documentation: string
  asEnum?: boolean
}
const templates: Template[] = [
  { method: 'types', identifier: 'Type', documentation: 'Types of reportable incidents' },
  { method: 'typeFamilies', identifier: 'TypeFamily', documentation: 'Incident type families' },
  { method: 'statuses', identifier: 'Status', documentation: 'Report statuses' },
  {
    method: 'informationSources',
    identifier: 'InformationSource',
    documentation: 'Whether the report was first created in DPS or NOMIS',
  },
  {
    method: 'staffInvolvementRoles',
    identifier: 'StaffInvolvementRole',
    documentation: 'Roles of staff involvement in an incident',
  },
  {
    method: 'prisonerInvolvementRoles',
    identifier: 'PrisonerInvolvementRole',
    documentation: 'Roles of a prisoner’s involvement in an incident',
  },
  {
    method: 'prisonerInvolvementOutcomes',
    identifier: 'PrisonerInvolvementOutcome',
    documentation: 'Outcomes from a prisoner’s involvement in an incident',
  },
  {
    method: 'errorCodes',
    identifier: 'ErrorCode',
    documentation: 'Unique codes to discriminate errors returned from the incident reporting api',
    asEnum: true,
  },
]

const constantTemplate = `
// Generated with {{ scriptName }} at {{ generatedTimestamp }}

/** {{ documentation }} */
export const {{ method }} = [
  {%- for constant in constants %}
    {%- if constant.nomisCode === null %}
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore because typescript treats nomisCode as \`any\`
    {%- endif %}
    {{ constant | dump }},
  {%- endfor %}
] as const

/** {{ documentation }} */
type {{ identifier }}Details = (typeof {{ method }})[number]

/** Codes for {{ documentation.toLowerCase() }} */
export type {{ identifier }} = {{ identifier }}Details['code']

/** Code to description mapping for {{ documentation.toLowerCase() }} */
export const {{ method }}Descriptions: Record<{{ identifier }}, string> = {
  {%- for constant in constants %}
    {{ constant.code }}: '{{ constant.description }}',
  {%- endfor %}
}

{% if includeNomisCode %}
/**
 * NOMIS codes for {{ documentation }}
 * @deprecated
 */
export type Nomis{{ identifier }} = {{ identifier }}Details['nomisCode']
{% endif %}

{% if includeNomisCodes %}
/**
 * NOMIS codes for {{ documentation }}
 * @deprecated
 */
export type Nomis{{ identifier }} = {{ identifier }}Details['nomisCodes'][number]
{% endif %}

/** Lookup for {{ documentation.toLowerCase() }} */
export function get{{ identifier }}Details(code: string): {{ identifier }}Details | null {
 return {{ method }}.find(item => item.code === code) ?? null
}
`

const enumConstantTemplate = `
// Generated with {{ scriptName }} at {{ generatedTimestamp }}

/** {{ documentation }} */
export enum {{ identifier }} {
  {%- for constant in constants %}
    {{ constant.description }} = {{ constant.code }},
  {%- endfor %}
}
`

main()

function main() {
  const { scriptName, filePath, template } = parseArgs()
  const { method, identifier, documentation, asEnum } = template

  const constants: (Constant | TypeConstant | StaffRoleConstant | PrisonerRoleConstant | PrisonerOutcomeConstant)[] =
    JSON.parse(fs.readFileSync(filePath, { encoding: 'utf8' }))
  const includeNomisCode = constants.every(constant => 'nomisCode' in constant)
  const includeNomisCodes = constants.every(constant => 'nomisCodes' in constant)

  const outputPath = path.resolve(__dirname, `../server/reportConfiguration/constants/${method}.ts`)
  const outputFile = fs.openSync(outputPath, 'w')

  const nunjucksEnv = nunjucks.configure({ autoescape: false })
  fs.writeSync(
    outputFile,
    nunjucksEnv.renderString(asEnum ? enumConstantTemplate : constantTemplate, {
      scriptName,
      generatedTimestamp: new Date().toISOString(),
      method,
      identifier,
      documentation,
      constants,
      includeNomisCode,
      includeNomisCodes,
    }),
  )

  fs.closeSync(outputFile)

  formatCode(outputPath)
}

function parseArgs(): Arguments {
  const [, fullPath, type, filePath] = process.argv
  const scriptName = `./scripts/${path.basename(fullPath)}`

  if (!type || !filePath) {
    printHelpAndExit(scriptName)
  }
  const template = templates.find(t => t.method === type)
  if (!template) {
    printHelpAndExit(scriptName)
  }

  return { scriptName, filePath, template }
}

function printHelpAndExit(scriptName: string): never {
  const help = `
Imports constants from incident reporting api downloaded as JSON files.
Usage:
  ${scriptName} <type> <file path>

Where <type> is one of ${templates.map(template => template.method).join(', ')}
`
  printText(help.trim())
  process.exit(1)
}
