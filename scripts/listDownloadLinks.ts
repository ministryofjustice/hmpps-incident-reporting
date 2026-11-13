#!/usr/bin/env npx tsx
import path from 'node:path'

import { getHelmEnvironments, type HelmEnvironment, printText } from './utils'

interface Arguments {
  baseUrl: string
}

main()

function main() {
  const { baseUrl } = parseArgs()

  const dpsUrlSlugs = [
    'types',
    'typeFamilies',
    'statuses',
    'informationSources',
    'staffInvolvementRoles',
    'prisonerInvolvementRoles',
    'prisonerInvolvementOutcomes',
    'errorCodes',
  ]

  printText('DPS configuration JSON downloads:')
  dpsUrlSlugs.forEach(urlSlug => {
    printText(`  - ${baseUrl}/download-report-config/dps/${urlSlug}.json`)
  })
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
Prints download links for DPS configuration:
Usage:
  ${scriptName} <env>

Where <env> is one of ${environments.map(e => e.environment).join(', ')}
`
  printText(help.trim())
  process.exit(1)
}
