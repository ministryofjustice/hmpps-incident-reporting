#!/usr/bin/env npx tsx
import path from 'node:path'

import { getHelmEnvironments, type HelmEnvironment, printText } from './utils'
import { types } from '../server/reportConfiguration/constants'

interface Arguments {
  baseUrl: string
  verbose: boolean
}

main()

function main() {
  const { baseUrl, verbose } = parseArgs()

  const dpsUrlSlugs = [
    'types',
    'statuses',
    'informationSources',
    'staffInvolvementRoles',
    'prisonerInvolvementRoles',
    'prisonerInvolvementOutcomes',
    'errorCodes',
  ]

  const nomisUrlSlugs = [
    'incident-types',
    'incident-type/<nomisType>/questions',
    'incident-type/<nomisType>/prisoner-roles',
    'staff-involvement-roles',
    'prisoner-involvement-roles',
    'prisoner-involvement-outcome',
  ]

  printText('DPS configuration JSON downloads:')
  dpsUrlSlugs.forEach(urlSlug => {
    printText(`  - ${baseUrl}/download-report-config/dps/${urlSlug}.json`)
  })

  printText('\nNOMIS configuration JSON downloads:')
  nomisUrlSlugs.forEach(urlSlug => {
    if (verbose && urlSlug.includes('<nomisType>')) {
      types.forEach(({ nomisCode }) => {
        if (nomisCode) {
          printText(`  - ${baseUrl}/download-report-config/nomis/${urlSlug.replace('<nomisType>', nomisCode)}.json`)
        }
      })
    } else {
      printText(`  - ${baseUrl}/download-report-config/nomis/${urlSlug}.json`)
    }
  })

  printText('\nNOMIS configuration CSV downloads:')
  nomisUrlSlugs.forEach(urlSlug => {
    if (verbose && urlSlug.includes('<nomisType>')) {
      types.forEach(({ nomisCode }) => {
        if (nomisCode) {
          printText(`  - ${baseUrl}/download-report-config/nomis/${urlSlug.replace('<nomisType>', nomisCode)}.csv`)
        }
      })
    } else {
      printText(`  - ${baseUrl}/download-report-config/nomis/${urlSlug}.csv`)
    }
  })

  if (verbose) {
    printText('\nNB: Download links are only listed with known NOMIS types, it’s possible that newer types may exist.')
  } else {
    printText(
      `\nWhere <nomisType> is the NOMIS incident report type code, such as ${types[0].nomisCode}. Use --verbose flag to list known types.`,
    )
  }
}

function parseArgs(): Arguments {
  const [, fullPath, env, flags] = process.argv
  const scriptName = `./scripts/${path.basename(fullPath)}`
  const environments = getHelmEnvironments()
  const verbose = flags === '--verbose'

  if (!env) {
    printHelpAndExit(scriptName, environments)
  }

  const environment = environments.find(e => e.environment === env)
  if (!environment) {
    printHelpAndExit(scriptName, environments)
  }

  return { baseUrl: environment.baseUrl, verbose }
}

function printHelpAndExit(scriptName: string, environments: HelmEnvironment[]): never {
  const help = `
Prints download links for DPS and NOMIS configuration:
Usage:
  ${scriptName} <env>

Where <env> is one of ${environments.map(e => e.environment).join(', ')}
`
  printText(help.trim())
  process.exit(1)
}
