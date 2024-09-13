#!/usr/bin/env npx tsx

import fs from 'node:fs'
import path from 'node:path'

import { fromNomis } from '../server/data/incidentTypeConfiguration/conversion'
import { saveAsTypescript } from '../server/data/incidentTypeConfiguration/persistance'
import { type IncidentTypeConfiguration } from '../server/data/prisonApi'

interface Arguments {
  scriptName: string
  nomisConfigFile: string
}

main()

function main() {
  const { scriptName, nomisConfigFile } = parseArgs()

  const jsonConfig = fs.readFileSync(nomisConfigFile, { encoding: 'utf8' })
  const nomisIncidentTypes: IncidentTypeConfiguration[] = JSON.parse(jsonConfig)

  for (const nomisConfig of nomisIncidentTypes) {
    const dpsConfig = fromNomis(nomisConfig)
    const outputFile = saveAsTypescript({ scriptName, dpsConfig })

    process.stderr.write(`Config for ${dpsConfig.incidentType} written to ${outputFile}\n`)
  }
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
