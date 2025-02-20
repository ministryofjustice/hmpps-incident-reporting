import type { NextFunction, Request, Response } from 'express'
import { NotImplemented } from 'http-errors'

import logger from '../../logger'

/**
 * Loads a report by id from `req.params.reportId` and populates prisoner to be removed from report
 * using `req.params.prisonerReportIndex`
 */
// eslint-disable-next-line import/prefer-default-export
export function populatePrisonerToRemove() {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { incidentReportingApi } = res.locals.apis

    const { reportId, prisonerReportIndex } = req.params
    if (!reportId) {
      next(new NotImplemented('populatePrisonerToRemove() requires req.params.reportId'))
      return
    }
    if (!prisonerReportIndex) {
      next(new NotImplemented('populatePrisonerToRemove() requires req.params.prisonerReportIndex'))
      return
    }

    try {
      const report = await incidentReportingApi.getReportWithDetailsById(reportId)
      res.locals.report = report
      console.log(report)
      const reportPrisoners = Object.fromEntries(
        report.prisonersInvolved.map(prisoner => [prisoner.sequence, prisoner]),
      )
      res.locals.prisonerToRemove = reportPrisoners[prisonerReportIndex]

      next()
    } catch (error) {
      logger.error(error, `Failed to load prisoner ${prisonerReportIndex} from report ${reportId}`)
      next(error)
    }
  }
}
