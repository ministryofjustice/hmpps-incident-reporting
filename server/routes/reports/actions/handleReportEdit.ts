import type express from 'express'
import logger from '../../../../logger'

/**
 * Users can edit report in various states, but sometimes this results in a status transition.
 * NB: Ensure there is a call to `handleReportEdit(res)` whenever a report is edited so this is handled!
 */
export async function handleReportEdit(res: express.Response): Promise<void> {
  const { report } = res.locals
  const { incidentReportingApi } = res.locals.apis

  // NB: transition is not being used for permissions check, so absence does not raise an error
  const reportTransitions = res.locals.possibleTransitions
  const newStatus = reportTransitions.EDIT?.newStatus
  if (newStatus && newStatus !== report.status) {
    // status must change as a side effect of editing report in current state
    await incidentReportingApi.changeReportStatus(report.id, { newStatus })
    logger.info(`Report ${report.reportReference} status was updated`)
  }
}
