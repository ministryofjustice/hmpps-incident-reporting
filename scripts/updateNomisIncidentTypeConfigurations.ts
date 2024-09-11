#!/usr/bin/env npx tsx

import fs from 'node:fs'

import { fromNomis } from '../server/data/incidentTypeConfiguration/conversion'
import { saveAsTypescript } from '../server/data/incidentTypeConfiguration/persistance'
import { type IncidentTypeConfiguration } from '../server/data/prisonApi'

const scriptName = './scripts/updateNomisIncidentTypeConfigurations.ts'

interface Arguments {
  nomisConfigFile: string
}

main()

function main() {
  const { nomisConfigFile } = parseArgs()

  const jsonConfig = fs.readFileSync(nomisConfigFile, { encoding: 'utf8' })
  const nomisIncidentTypes: IncidentTypeConfiguration[] = JSON.parse(jsonConfig)

  for (const nomisConfig of nomisIncidentTypes) {
    const dpsConfig = fromNomis(nomisConfig)
    saveAsTypescript({ scriptName, dpsConfig })
  }
}

function parseArgs(): Arguments {
  const [, , nomisConfigFile] = process.argv
  if (!nomisConfigFile) {
    printHelp()
  }

  return { nomisConfigFile }
}

function printHelp(): never {
  const help = `
Regenarates Incident Types configuration for NOMIS types.

Usage:
  ${scriptName} <nomisConfigFile>

Where <nomisConfigFile> is a JSON file with a list of NOMIS IncidentTypeConfiguration values
  `.trim()

  process.stderr.write(`${help}\n`)
  process.exit(1)
}
