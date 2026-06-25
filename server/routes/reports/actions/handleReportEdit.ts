import type express from 'express'
import logger from '../../../../logger'
import { ApiUserType } from '../../../middleware/permissions'
import { placeholderForCorrectionRequest } from './correctionRequestPlaceholder'
import { missingLocalsError } from '../../../errors'

/**
 * Users can edit report in various states, but sometimes this results in a status transition.
 * NB: Ensure there is a call to `handleReportEdit(res)` whenever a report is edited so this is handled!
 */
export async function handleReportEdit(res: express.Response): Promise<void> {
  const { incidentReportingApi } = res.locals.apis
  const { report, possibleTransitions, permissions } = res.locals

  if (!report) {
    throw missingLocalsError('handleReportEdit()', 'res.locals.report')
  }
  if (!possibleTransitions) {
    throw missingLocalsError('handleReportEdit()', 'res.locals.possibleTransitions')
  }

  // NB: transition is not being used for permissions check, so absence does not raise an error
  const newStatus = possibleTransitions.EDIT?.newStatus
  if (newStatus && newStatus !== report.status) {
    const { userType } = permissions
    // status must change as a side effect of editing report in current state
    await incidentReportingApi.changeReportStatus(report.id, {
      newStatus,
      correctionRequest: {
        userType: userType as ApiUserType,
        userAction: 'RECALL',
        descriptionOfChange: placeholderForCorrectionRequest('RECALL'),
      },
    })
    logger.info(`Report ${report.reportReference} status was updated`)
  }
}
