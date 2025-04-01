#!/usr/bin/env npx tsx

import fs from 'node:fs'
import path from 'node:path'

import { printText, red } from './utils'
import { fromNomis } from '../server/data/incidentTypeConfiguration/conversion'
import { saveAsGraphviz, saveAsTypescript } from '../server/data/incidentTypeConfiguration/persistance'
import { type IncidentTypeConfiguration as DpsIncidentTypeConfiguration } from '../server/data/incidentTypeConfiguration/types'
import { validateConfig } from '../server/data/incidentTypeConfiguration/validation'
import type { IncidentTypeConfiguration as NomisIncidentTypeConfiguration } from '../server/data/prisonApi'

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

    const tsFile = saveAsTypescript({ scriptName, dpsConfig })
    printText(
      `\n\nConfig for ${dpsConfig.incidentType} (NOMIS code '${nomisConfig.incidentType}') written to ${tsFile}`,
    )

    checkConfig(dpsConfig)

    saveAsGraphviz(dpsConfig)
  }
}

function checkConfig(config: DpsIncidentTypeConfiguration) {
  const errors = validateConfig(config)
  if (errors.length > 0) {
    printText(`${red('WARNING')}: Config for ${config.incidentType} has the following errors:`)
    if (config.active === true) {
      printText(' - config is active')
    }
    for (const error of errors) {
      printText(` - ${error.message}`)
    }
  }
}

function parseArgs(): Arguments {
  const [, fullPath, nomisConfigFile] = process.argv
  const scriptName = `./scripts/${path.basename(fullPath)}`
  if (!nomisConfigFile) {
    printHelpAndExit(scriptName)
  }

  return { scriptName, nomisConfigFile }
}

function printHelpAndExit(scriptName: string): never {
  const help = `
Regenarates Incident Types configuration for NOMIS types.

Usage:
  ${scriptName} <nomisConfigFile>

Where <nomisConfigFile> is a JSON file with a list of NOMIS IncidentTypeConfiguration values.

NOTE: The script uses Graphviz cli to generate SVG files for the questionnaires flows:
      https://graphviz.org/download/
  `

  printText(help.trim())
  process.exit(1)
}
