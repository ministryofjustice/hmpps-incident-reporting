import type express from 'express'

import logger from '../../logger'
import type { ReportWithDetails } from '../data/incidentReportingApi'
import { reportHasDetails } from '../data/incidentReportingApiUtils'
import { getTypeDetails, type Type } from '../reportConfiguration/constants'
import { convertToTitleCase } from '../utils/utils'
import { isPecsRegionCode } from '../data/pecsRegions'
import { AgencyType } from '../data/constants'
import { missingLocalsError } from '../errors'

// NB: Report titles are never displayed in this service, but they are saved for downstream services’ compatibility

/**
 * Auto-generated title used to save a minimal report:
 * `type (location)`
 */
export function newReportTitle(type: Type, locationDescription: string): string {
  const typeDetails = getTypeDetails(type)
  const description = typeDetails?.description ?? 'Incident'
  return `${description} (${locationDescription})`
}

/**
 * Auto-generated title for updating reports before submission:
 * `type: prisoner-involvements (location)`
 */
export function regenerateTitleForReport(report: ReportWithDetails, locationDescription: string): string {
  const typeDetails = getTypeDetails(report.type)
  const description = typeDetails?.description ?? 'Incident'
  const prisonerInvolvement = report.prisonersInvolved.length
    ? `: ${report.prisonersInvolved.map(prisoner => `${convertToTitleCase(prisoner.lastName)} ${prisoner.prisonerNumber}`).join(', ')}`
    : ''
  return `${description}${prisonerInvolvement} (${locationDescription})`
}

/** Updates report title */
export async function updateReportTitle(res: express.Response): Promise<void> {
  const { incidentReportingApi, prisonApi } = res.locals.apis
  const { report } = res.locals

  if (!report) {
    throw missingLocalsError('updateReportTitle()', 'res.locals.report')
  }
  if (!reportHasDetails(report)) {
    throw missingLocalsError('updateReportTitle()', 'res.locals.report (with details)')
  }

  const isPecsReport = isPecsRegionCode(report.location)

  const locationDescription = await prisonApi
    .getAgency(report.location, false, isPecsReport ? AgencyType.PECS : AgencyType.INST, isPecsReport)
    .then(prison => prison?.description || report.location)
    // fall back to code
    .catch(() => report.location)

  const newTitle = regenerateTitleForReport(report, locationDescription)
  return incidentReportingApi.updateReport(report.id, { title: newTitle }).then(() => {
    logger.info('Title of report %s updated', report.id)
  })
}

/**
 * Asynchronously updates report title.
 * NB: errors are logged but ignored!
 * This is to facilitate a different action that should not be cancelled if prison lookup or title update fails.
 * The title will again be regenerated on submission of the report, when such errors are not ignored.
 */
export function fallibleUpdateReportTitle(res: express.Response): void {
  const { report } = res.locals
  const reportId = report?.id ?? 'unknown'

  updateReportTitle(res).catch(e => {
    // NB: errors are logged but ignored!
    logger.error(e, 'Failed to update title of report %s, ignoring error: %j', reportId, e)
  })
}
