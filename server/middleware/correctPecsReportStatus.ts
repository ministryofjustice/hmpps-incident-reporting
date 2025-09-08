import type { RequestHandler } from 'express'
import { NotImplemented } from 'http-errors'

import { isPecsRegionCode } from '../data/pecsRegions'
import { type Status, statuses } from '../reportConfiguration/constants'

/**
 * When a PECS report is accessed by a data warden, and it is found to be in an unexpected status,
 * automatically move it to the most sensible one and redirect to refresh.
 */
export function correctPecsReportStatus(): RequestHandler {
  return async (req, res, next): Promise<void> => {
    const { report, permissions } = res.locals
    if (!report) {
      next(new NotImplemented('correctPecsReportStatus() requires res.locals.report'))
      return
    }
    if (!permissions) {
      next(new NotImplemented('correctPecsReportStatus() requires permissions middleware'))
      return
    }

    if (permissions.isDataWarden && isPecsRegionCode(report.location) && report.status in pecsStatusCorrections) {
      await res.locals.apis.incidentReportingApi.changeReportStatus(report.id, {
        newStatus: pecsStatusCorrections[report.status],
      })
      res.redirect(req.originalUrl) // NB: req.url is not right for some reason
      return
    }

    next()
  }
}

/**
 * Which statuses should be corrected if such a PECS report is found?
 */
export const pecsStatusCorrections: Partial<Record<Status, Status>> = {
  AWAITING_REVIEW: 'DRAFT',
  UPDATED: 'REOPENED',
  ON_HOLD: 'REOPENED',
  NEEDS_UPDATING: 'REOPENED',
  WAS_CLOSED: 'REOPENED',
}

/**
 * Statuses that are expected for PECS reports
 */
export const possiblePecsStatuses = statuses
  .map(({ code: status }) => status)
  .filter(status => !(status in pecsStatusCorrections))
