#!/usr/bin/env npx tsx
import fs from 'node:fs'
import path from 'node:path'

import { parse as parseYaml } from 'yaml'

interface Arguments {
  baseUrl: string
}

interface Environment {
  environment: string
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

  process.stderr.write('DPS configuration JSON downloads:\n')
  dpsTypes.forEach(type => {
    process.stderr.write(`  - ${baseUrl}/download-report-config/dps/${type}.json\n`)
  })

  process.stderr.write('\nNOMIS configuration JSON downloads:\n')
  nomisTypes.forEach(urlSlug => {
    process.stderr.write(`  - ${baseUrl}/download-report-config/nomis/${urlSlug}.json\n`)
  })
  process.stderr.write('Where <type> is the NOMIS incident report type code.\n')

  process.stderr.write('\nNOMIS configuration CSV downloads:\n')
  nomisTypes.forEach(urlSlug => {
    process.stderr.write(`  - ${baseUrl}/download-report-config/nomis/${urlSlug}.csv\n`)
  })
  process.stderr.write('Where <type> is the NOMIS incident report type code.\n')
}

function parseArgs(): Arguments {
  const [, fullPath, env] = process.argv
  const scriptName = `./scripts/${path.basename(fullPath)}`
  const environments = getEnvironments()

  if (!env) {
    printHelp(scriptName, environments)
  }

  const environment = environments.find(e => e.environment === env)
  if (!environment) {
    printHelp(scriptName, environments)
  }

  return { baseUrl: environment.baseUrl }
}

function getEnvironments(): Environment[] {
  const helmRootPath = path.resolve(__dirname, '../helm_deploy')

  return fs
    .readdirSync(helmRootPath, { encoding: 'utf8' })
    .filter(p => p.startsWith('values-') && p.endsWith('.yaml'))
    .map(p => {
      const helmValuesPath = path.join(helmRootPath, p)
      const helmValues: { 'generic-service': { ingress: { host: string } } } = parseYaml(
        fs.readFileSync(helmValuesPath, { encoding: 'utf8' }),
      )

      const { environment } = /^values-(?<environment>.*?).yaml$/.exec(p).groups
      const baseUrl = `https://${helmValues['generic-service'].ingress.host}`
      return { environment, baseUrl }
    })
}

function printHelp(scriptName: string, environments: Environment[]): never {
  const help = `
Prints download links for DPS and NOMIS configuration:
Usage:
  ${scriptName} <env>

Where <env> is one of ${environments.map(e => e.environment).join(', ')}
`.trim()
  process.stderr.write(`${help}\n`)
  process.exit(1)
}
