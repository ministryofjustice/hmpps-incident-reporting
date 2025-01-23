import type { NextFunction, Request, Response } from 'express'
import { NotImplemented } from 'http-errors'

import logger from '../../logger'

/**
 * Loads a report by id from `req.params.id`
 */
// eslint-disable-next-line import/prefer-default-export
export function populateReport(withDetails = true) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { incidentReportingApi } = res.locals.apis
    const reportId = req.params.id

    if (!reportId) {
      next(new NotImplemented('populateReport() requires req.params.id'))
      return
    }

    try {
      if (withDetails) {
        res.locals.report = await incidentReportingApi.getReportWithDetailsById(reportId)
      } else {
        res.locals.report = await incidentReportingApi.getReportById(reportId)
      }
      next()
    } catch (error) {
      logger.error(error, `Failed to load report ${reportId}`)
      next(error)
    }
  }
}
