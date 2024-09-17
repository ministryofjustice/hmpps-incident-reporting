#!/usr/bin/env npx tsx

import fs from 'node:fs'
import path from 'node:path'

import { fromNomis } from '../server/data/incidentTypeConfiguration/conversion'
import { saveAsTypescript } from '../server/data/incidentTypeConfiguration/persistance'
import { type IncidentTypeConfiguration as DpsIncidentTypeConfiguration } from '../server/data/incidentTypeConfiguration/types'
import { validateConfig } from '../server/data/incidentTypeConfiguration/validation'
import { type IncidentTypeConfiguration as NomisIncidentTypeConfiguration } from '../server/data/prisonApi'

interface Arguments {
  scriptName: string
  nomisConfigFile: string
}

main()

function main() {
  const { scriptName, nomisConfigFile } = parseArgs()

  const jsonConfig = fs.readFileSync(nomisConfigFile, { encoding: 'utf8' })
  const nomisIncidentTypes: NomisIncidentTypeConfiguration[] = JSON.parse(jsonConfig)

  for (const nomisConfig of nomisIncidentTypes) {
    const dpsConfig = fromNomis(nomisConfig)

    const outputFile = saveAsTypescript({ scriptName, dpsConfig })
    process.stderr.write(`\n\nConfig for ${dpsConfig.incidentType} written to ${outputFile}\n`)

    checkConfig(dpsConfig)
  }
}

function checkConfig(config: DpsIncidentTypeConfiguration) {
  const errors = validateConfig(config)
  if (errors.length > 0) {
    process.stderr.write(`${red('WARNING')}: Config for ${config.incidentType} has the following errors:\n`)
    for (const error of errors) {
      process.stderr.write(` - ${error.message}\n`)
    }
  }
}

function red(text: string): string {
  return `\x1b[31m${text}\x1b[0m`
}

function parseArgs(): Arguments {
  const [, fullPath, nomisConfigFile] = process.argv
  const scriptName = `./scripts/${path.basename(fullPath)}`
  if (!nomisConfigFile) {
    printHelp(scriptName)
  }

  return { scriptName, nomisConfigFile }
}

function printHelp(scriptName: string): never {
  const help = `
Regenarates Incident Types configuration for NOMIS types.

Usage:
  ${scriptName} <nomisConfigFile>

Where <nomisConfigFile> is a JSON file with a list of NOMIS IncidentTypeConfiguration values
  `.trim()

  process.stderr.write(`${help}\n`)
  process.exit(1)
}
