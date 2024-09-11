#!/usr/bin/env npx tsx
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

import type { IncidentReportingApi, Constant, TypeConstant } from '../server/data/incidentReportingApi'

type ConstantsMethod = keyof IncidentReportingApi['constants']
interface Template {
  method: ConstantsMethod
  enumName: string
  documentation: string
}
const templates: Template[] = [
  { method: 'types', enumName: 'Type', documentation: 'Types of reportable incidents' },
  { method: 'statuses', enumName: 'Status', documentation: 'Report statuses' },
  {
    method: 'informationSources',
    enumName: 'InformationSource',
    documentation: 'Whether the report was first created in DPS or NOMIS',
  },
  {
    method: 'staffInvolvementRoles',
    enumName: 'StaffInvolvementRole',
    documentation: 'Roles of staff involvement in an incident',
  },
  {
    method: 'prisonerInvolvementRoles',
    enumName: 'PrisonerInvolvementRole',
    documentation: 'Roles of a prisoner’s involvement in an incident',
  },
  {
    method: 'prisonerInvolvementOutcomes',
    enumName: 'PrisonerInvolvementOutcome',
    documentation: 'Outcomes from a prisoner’s involvement in an incident',
  },
  {
    method: 'correctionRequestReasons',
    enumName: 'CorrectionRequestReason',
    documentation: 'Reasons for correction requests made about a report',
  },
  {
    method: 'errorCodes',
    enumName: 'ErrorCode',
    documentation: 'Unique codes to discriminate errors returned from the incident reporting api',
  },
]

function printHelp(): never {
  const help = `
Imports constants from incident reporting api downloaded as JSON files.
Usage:
  ./scripts/importDpsConstants.ts <type> <file path>

Where <type> is one of ${templates.map(template => template.method).join(', ')}
`.trim()
  process.stderr.write(`${help}\n`)
  process.exit(1)
}

const [, , type, filePath] = process.argv
if (!type || !filePath) {
  printHelp()
}
const template = templates.find(t => t.method === type)
if (!template) {
  printHelp()
}
const { method, enumName, documentation } = template

const constants: Constant[] = JSON.parse(fs.readFileSync(filePath, { encoding: 'utf8' }))

const outputPath = path.resolve(__dirname, `../server/reportConfiguration/dpsConstants/${method}.ts`)
const outputFile = fs.openSync(outputPath, 'w')

fs.writeSync(outputFile, `// Generated with ./scripts/importDpsConstants.ts at ${new Date().toISOString()}\n\n`)
if (method === 'errorCodes') {
  // error codes are numbers so need special treatment

  fs.writeSync(outputFile, `/** ${documentation} */\n`)
  fs.writeSync(outputFile, '// eslint-disable-next-line import/prefer-default-export\n')
  fs.writeSync(outputFile, `export enum ${enumName} {\n`)
  constants.forEach(constant => {
    fs.writeSync(outputFile, `${constant.description} = ${constant.code},\n`)
  })
  fs.writeSync(outputFile, '}\n')
} else if (method === 'types') {
  // types are string constants but have extra info

  fs.writeSync(outputFile, `/** ${documentation} */\n`)
  fs.writeSync(outputFile, `export const ${method} = [\n`)
  constants.forEach((constant: TypeConstant) => {
    fs.writeSync(outputFile, `/** ${constant.description} */\n`)
    fs.writeSync(
      outputFile,
      `{ code: ${JSON.stringify(constant.code)}, active: ${constant.active}, nomisCode: ${JSON.stringify(constant.nomisCode)} },\n`,
    )
  })
  fs.writeSync(outputFile, '] as const\n\n')
  fs.writeSync(outputFile, `/** ${documentation} */\n`)
  fs.writeSync(outputFile, `export type ${enumName} = (typeof ${method})[number]['code']\n`)
  fs.writeSync(outputFile, `/** ${documentation}\n * @deprecated\n */\n`)
  fs.writeSync(outputFile, `export type Nomis${enumName} = (typeof ${method})[number]['nomisCode']\n`)
} else {
  // all other constants are just strings

  fs.writeSync(outputFile, `/** ${documentation} */\n`)
  fs.writeSync(outputFile, `export const ${method} = [\n`)
  constants.forEach(constant => {
    fs.writeSync(outputFile, `/** ${constant.description} */\n`)
    fs.writeSync(outputFile, `${JSON.stringify(constant.code)},\n`)
  })
  fs.writeSync(outputFile, '] as const\n\n')
  if (documentation) {
    fs.writeSync(outputFile, `/** ${documentation} */\n`)
  }
  fs.writeSync(outputFile, `export type ${enumName} = (typeof ${method})[number]\n`)
}
fs.closeSync(outputFile)

spawnSync('npx', ['prettier', '--write', outputPath], { encoding: 'utf8' })
