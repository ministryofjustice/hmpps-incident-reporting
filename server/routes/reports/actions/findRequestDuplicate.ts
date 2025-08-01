import type { CorrectionRequest, ReportWithDetails } from '../../../data/incidentReportingApi'
import { workListMapping } from '../../../reportConfiguration/constants'

/**
 * When a report has a status in the submitted work list, there might be a request to mark it as a duplicate.
 * Once a report leaves this set of statuses, any prior request is cleared.
 *
 * This helper function finds the last such request if it was the latest correction request
 * to take the report into the submitted work list.
 *
 * Assumes the list is presorted in ascending date order (as currently returned by api; though that is technically insertion order).
 */
// eslint-disable-next-line import/prefer-default-export
export function findRequestDuplicate(report: ReportWithDetails): CorrectionRequest | null {
  if (!workListMapping.submitted.includes(report.status)) {
    // not in submitted work list so there cannot be a recent enough request
    return null
  }
  for (const correctionRequest of report.correctionRequests.toReversed()) {
    if (correctionRequest.userAction === 'REQUEST_DUPLICATE') {
      return correctionRequest
    }
    if (correctionRequest.userAction !== 'HOLD') {
      // any action other than HOLD would have taken the report out of the submitted work list
      break
    }
  }
  return null
}
