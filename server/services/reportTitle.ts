import type { ReportWithDetails } from '../data/incidentReportingApi'
import { getTypeDetails, type Type } from '../reportConfiguration/constants'
import { convertToTitleCase } from '../utils/utils'

// NB: Report titles are never displayed in this service, but they are saved for downstream services’ compatibility

/**
 * Auto-generated title used to save a minimal report:
 * `type (location)`
 */
export function newReportTitle(type: Type, locationDescription: string): string {
  const typeDetails = getTypeDetails(type)
  return `${typeDetails.description} (${locationDescription})`
}

/**
 * Auto-generated title for updating reports before submission:
 * `type: prisoner-involvements (location)`
 */
export function regenerateTitleForReport(report: ReportWithDetails, locationDescription: string): string {
  const typeDetails = getTypeDetails(report.type)
  const prisonerInvolvement = report.prisonersInvolved.length
    ? `: ${report.prisonersInvolved.map(prisoner => `${convertToTitleCase(prisoner.lastName)} ${prisoner.prisonerNumber}`).join(', ')}`
    : ''
  return `${typeDetails.description}${prisonerInvolvement} (${locationDescription})`
}
