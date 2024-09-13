#!/usr/bin/env npx tsx
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

import type { IncidentReportingApi, Constant, TypeConstant } from '../server/data/incidentReportingApi'

interface Arguments {
  scriptName: string
  filePath: string
  template: Template
}

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

main()

function main() {
  const { scriptName, filePath, template } = parseArgs()

  const { method, enumName, documentation } = template

  const constants: (Constant | TypeConstant)[] = JSON.parse(fs.readFileSync(filePath, { encoding: 'utf8' }))

  const outputPath = path.resolve(__dirname, `../server/reportConfiguration/constants/${method}.ts`)
  const outputFile = fs.openSync(outputPath, 'w')

  fs.writeSync(outputFile, `// Generated with ${scriptName} at ${new Date().toISOString()}\n\n`)
  if (method === 'errorCodes') {
    // error codes are numbers so need special treatment

    fs.writeSync(outputFile, `/** ${documentation} */\n`)
    fs.writeSync(outputFile, '// eslint-disable-next-line import/prefer-default-export\n')
    fs.writeSync(outputFile, `export enum ${enumName} {\n`)
    constants.forEach(constant => {
      fs.writeSync(outputFile, `${constant.description} = ${constant.code},\n`)
    })
    fs.writeSync(outputFile, '}\n')
  } else {
    // other constants are strings with extra info

    fs.writeSync(outputFile, `/** ${documentation} */\n`)
    fs.writeSync(outputFile, `export const ${method} = [\n`)
    constants.forEach(constant => {
      fs.writeSync(
        outputFile,
        `{ code: ${JSON.stringify(constant.code)}, description: ${JSON.stringify(constant.description)},\n`,
      )
      if ('active' in constant) {
        fs.writeSync(outputFile, `active: ${constant.active}, nomisCode: ${JSON.stringify(constant.nomisCode)} },\n`)
      } else {
        fs.writeSync(outputFile, '},\n')
      }
    })
    fs.writeSync(outputFile, '] as const\n\n')
    fs.writeSync(outputFile, `/** ${documentation} */\n`)
    fs.writeSync(outputFile, `export type ${enumName} = (typeof ${method})[number]['code']\n`)
    if (method === 'types') {
      fs.writeSync(outputFile, `\n/** ${documentation}\n * @deprecated\n */\n`)
      fs.writeSync(outputFile, `export type Nomis${enumName} = (typeof ${method})[number]['nomisCode']\n`)
    }
  }
  fs.closeSync(outputFile)

  spawnSync('npx', ['prettier', '--write', outputPath], { encoding: 'utf8' })
}

function parseArgs(): Arguments {
  const [, fullPath, type, filePath] = process.argv
  const scriptName = `./scripts/${path.basename(fullPath)}`

  if (!type || !filePath) {
    printHelp(scriptName)
  }
  const template = templates.find(t => t.method === type)
  if (!template) {
    printHelp(scriptName)
  }

  return { scriptName, filePath, template }
}

function printHelp(scriptName: string): never {
  const help = `
Imports constants from incident reporting api downloaded as JSON files.
Usage:
  ${scriptName} <type> <file path>

Where <type> is one of ${templates.map(template => template.method).join(', ')}
`.trim()
  process.stderr.write(`${help}\n`)
  process.exit(1)
}
