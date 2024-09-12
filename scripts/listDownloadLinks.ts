#!/usr/bin/env npx tsx
import fs from 'node:fs'
import path from 'node:path'

import { parse as parseYaml } from 'yaml'

const scriptName = path.basename(process.argv[1])

const helmRootPath = path.resolve(__dirname, '../helm_deploy')
const environments = fs
  .readdirSync(helmRootPath, { encoding: 'utf8' })
  .filter(p => p.startsWith('values-') && p.endsWith('.yaml'))
  .map(p => {
    const { environment } = /^values-(?<environment>.*?).yaml$/.exec(p).groups
    const helmValuesPath = path.join(helmRootPath, p)
    const helmValues: { 'generic-service': { ingress: { host: string } } } = parseYaml(
      fs.readFileSync(helmValuesPath, { encoding: 'utf8' }),
    )
    const baseUrl = `https://${helmValues['generic-service'].ingress.host}`
    return { environment, baseUrl }
  })

function printHelp(): never {
  const help = `
Prints download links for DPS and NOMIS configuration:
Usage:
  ./scripts/${scriptName} <env>

Where <env> is one of ${environments.map(e => e.environment).join(', ')}
`.trim()
  process.stderr.write(`${help}\n`)
  process.exit(1)
}

const [, , env] = process.argv
if (!env) {
  printHelp()
}
const environment = environments.find(e => e.environment === env)
if (!environment) {
  printHelp()
}
const { baseUrl } = environment

process.stderr.write('DPS configuration JSON downloads:\n')
;[
  'types',
  'statuses',
  'informationSources',
  'staffInvolvementRoles',
  'prisonerInvolvementRoles',
  'prisonerInvolvementOutcomes',
  'correctionRequestReasons',
  'errorCodes',
].forEach(type => {
  process.stderr.write(`  - ${baseUrl}/download-report-config/dps/${type}.json\n`)
})

process.stderr.write('\nNOMIS configuration JSON downloads:\n')
;[
  'incident-types',
  'incident-type/<type>/questions',
  'incident-type/<type>/prisoner-roles',
  'staff-involvement-roles',
  'prisoner-involvement-roles',
  'prisoner-involvement-outcome',
].forEach(urlSlug => {
  process.stderr.write(`  - ${baseUrl}/download-report-config/nomis/${urlSlug}.json\n`)
})
process.stderr.write('Where <type> is the NOMIS incident report type code.\n')

process.stderr.write('\nNOMIS configuration CSV downloads:\n')
;[
  'incident-types',
  'incident-type/<type>/questions',
  'incident-type/<type>/prisoner-roles',
  'staff-involvement-roles',
  'prisoner-involvement-roles',
  'prisoner-involvement-outcome',
].forEach(urlSlug => {
  process.stderr.write(`  - ${baseUrl}/download-report-config/nomis/${urlSlug}.csv\n`)
})
process.stderr.write('Where <type> is the NOMIS incident report type code.\n')
