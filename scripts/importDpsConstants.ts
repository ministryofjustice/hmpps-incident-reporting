#!/usr/bin/env npx tsx
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

import { printText } from './utils'
import type { IncidentReportingApi, Constant, TypeConstant } from '../server/data/incidentReportingApi'

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
  includeNomisType?: boolean
  asEnum?: boolean
}
const templates: Template[] = [
  { method: 'types', identifier: 'Type', documentation: 'Types of reportable incidents', includeNomisType: true },
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
    includeNomisType: true,
  },
  {
    method: 'prisonerInvolvementOutcomes',
    identifier: 'PrisonerInvolvementOutcome',
    documentation: 'Outcomes from a prisoner’s involvement in an incident',
  },
  {
    method: 'correctionRequestReasons',
    identifier: 'CorrectionRequestReason',
    documentation: 'Reasons for correction requests made about a report',
  },
  {
    method: 'errorCodes',
    identifier: 'ErrorCode',
    documentation: 'Unique codes to discriminate errors returned from the incident reporting api',
    asEnum: true,
  },
]

main()

function main() {
  const { scriptName, filePath, template } = parseArgs()
  const { method, identifier, documentation, asEnum, includeNomisType } = template

  const constants: (Constant | TypeConstant)[] = JSON.parse(fs.readFileSync(filePath, { encoding: 'utf8' }))

  const outputPath = path.resolve(__dirname, `../server/reportConfiguration/constants/${method}.ts`)
  const outputFile = fs.openSync(outputPath, 'w')

  fs.writeSync(outputFile, `// Generated with ${scriptName} at ${new Date().toISOString()}\n\n`)

  if (asEnum) {
    // error codes are numbers so need special treatment

    fs.writeSync(outputFile, `/** ${documentation} */\n`)
    fs.writeSync(outputFile, '// eslint-disable-next-line import/prefer-default-export\n')
    fs.writeSync(outputFile, `export enum ${identifier} {\n`)
    constants.forEach(constant => {
      fs.writeSync(outputFile, `${constant.description} = ${constant.code},\n`)
    })
    fs.writeSync(outputFile, '}\n')
  } else {
    // other constants are strings with extra info

    fs.writeSync(outputFile, `/** ${documentation} */\n`)
    fs.writeSync(outputFile, `export const ${method} = ${JSON.stringify(constants)} as const\n\n`)

    fs.writeSync(outputFile, `/** ${documentation} */\n`)
    fs.writeSync(outputFile, `export type ${identifier}Details = (typeof ${method})[number]\n\n`)

    fs.writeSync(outputFile, `/** Codes for ${documentation.toLowerCase()} */\n`)
    fs.writeSync(outputFile, `export type ${identifier} = ${identifier}Details['code']\n\n`)

    if (includeNomisType) {
      fs.writeSync(outputFile, `\n/** NOMIS codes for ${documentation}\n * @deprecated\n */\n`)
      fs.writeSync(outputFile, `export type Nomis${identifier} = ${identifier}Details['nomisCode']\n\n`)
    }

    fs.writeSync(outputFile, `/** Lookup for ${documentation.toLowerCase()} */\n`)
    fs.writeSync(
      outputFile,
      `export function get${identifier}Details(code: string): ${identifier}Details | null {
         return ${method}.find(item => item.code === code) ?? null
       }\n`,
    )
  }

  fs.closeSync(outputFile)

  spawnSync('npx', ['prettier', '--write', outputPath], { encoding: 'utf8' })
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
