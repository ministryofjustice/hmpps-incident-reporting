import type { IncidentTypeConfiguration } from '../data/prisonApi'

/**
 * Check that NOMIS report configuration is logically consistent:
 * - ensures types are unique
 *
 * @param incidentTypes must include ALL report configuration, not just active
 */
// eslint-disable-next-line import/prefer-default-export
export function analyseNomisReportConfiguration(incidentTypes: IncidentTypeConfiguration[]): Error[] {
  const results: Error[] = []

  const typeCount = new Set(incidentTypes.map(incidentType => incidentType.incidentType)).size
  if (typeCount !== incidentTypes.length) {
    results.push(new Error(`There are ${incidentTypes.length} configurations but ${typeCount} unique type codes`))
  }

  return results
}
