#!/usr/bin/env npx tsx

import { green, printText, red } from './utils'
import { validateConfig } from '../server/data/incidentTypeConfiguration/validation'
import { getAllIncidentTypeConfigurations } from '../server/reportConfiguration/types'

function main(): void {
  for (const incidentTypeConfiguration of getAllIncidentTypeConfigurations()) {
    printText(
      `Checking ${incidentTypeConfiguration.active ? 'active' : 'inactive'} type configuration for: ${incidentTypeConfiguration.incidentType}`,
    )
    const errors = validateConfig(incidentTypeConfiguration)
    if (errors.length > 0) {
      printText(`${red('WARNING')}: Errors found:`)
      for (const error of errors) {
        printText(` - ${error.message}`)
      }
    } else {
      printText(green('No errors found'))
    }
  }
}

main()
