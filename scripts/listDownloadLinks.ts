#!/usr/bin/env npx tsx
import path from 'node:path'

import { getHelmEnvironments, type HelmEnvironment, printText } from './utils'

interface Arguments {
  baseUrl: string
}

main()

function main() {
  const { baseUrl } = parseArgs()

  const dpsTypes = [
    'types',
    'statuses',
    'informationSources',
    'staffInvolvementRoles',
    'prisonerInvolvementRoles',
    'prisonerInvolvementOutcomes',
    'correctionRequestReasons',
    'errorCodes',
  ]

  const nomisTypes = [
    'incident-types',
    'incident-type/<type>/questions',
    'incident-type/<type>/prisoner-roles',
    'staff-involvement-roles',
    'prisoner-involvement-roles',
    'prisoner-involvement-outcome',
  ]

  printText('DPS configuration JSON downloads:')
  dpsTypes.forEach(type => {
    printText(`  - ${baseUrl}/download-report-config/dps/${type}.json`)
  })

  printText('\nNOMIS configuration JSON downloads:')
  nomisTypes.forEach(urlSlug => {
    printText(`  - ${baseUrl}/download-report-config/nomis/${urlSlug}.json`)
  })
  printText('Where <type> is the NOMIS incident report type code.')

  printText('\nNOMIS configuration CSV downloads:')
  nomisTypes.forEach(urlSlug => {
    printText(`  - ${baseUrl}/download-report-config/nomis/${urlSlug}.csv`)
  })
  printText('Where <type> is the NOMIS incident report type code.')
}

function parseArgs(): Arguments {
  const [, fullPath, env] = process.argv
  const scriptName = `./scripts/${path.basename(fullPath)}`
  const environments = getHelmEnvironments()

  if (!env) {
    printHelpAndExit(scriptName, environments)
  }

  const environment = environments.find(e => e.environment === env)
  if (!environment) {
    printHelpAndExit(scriptName, environments)
  }

  return { baseUrl: environment.baseUrl }
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
