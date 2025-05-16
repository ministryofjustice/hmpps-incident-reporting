#!/usr/bin/env npx tsx

import { printText } from './utils'
import { getAllIncidentTypeConfigurations } from '../server/reportConfiguration/types'
import { saveAsGraphviz } from '../server/data/incidentTypeConfiguration/persistance'

function main(): void {
  for (const incidentTypeConfiguration of getAllIncidentTypeConfigurations()) {
    printText(
      `Graphing ${incidentTypeConfiguration.active ? 'active' : 'inactive'} type configuration for ${incidentTypeConfiguration.incidentType}`,
    )
    saveAsGraphviz(incidentTypeConfiguration)
  }
}

main()
