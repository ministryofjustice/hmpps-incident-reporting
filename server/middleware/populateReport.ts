import type { NextFunction, Request, Response } from 'express'
import { NotImplemented } from 'http-errors'

import logger from '../../logger'

/**
 * Loads a report by id from `req.params.reportId`
 */
// eslint-disable-next-line import/prefer-default-export
export function populateReport(withDetails = true) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { reportId } = req.params
    if (!reportId) {
      next(new NotImplemented('populateReport() requires req.params.reportId'))
      return
    }

    try {
      const { incidentReportingApi } = res.locals.apis

      if (withDetails) {
        res.locals.report = await incidentReportingApi.getReportWithDetailsById(reportId)
      } else {
        res.locals.report = await incidentReportingApi.getReportById(reportId)
      }
      res.locals.reportUrl = `/reports/${reportId}`
      res.locals.reportSubUrlPrefix = res.locals.reportUrl

      next()
    } catch (error) {
      logger.error(error, `Failed to load report ${reportId}`)
      if (error.status === 400) {
        // if a mistyped UUID is looked up, the api response is 400, but for the purpose of this app the report simply can't be found
        error.status = 404
      }
      next(error)
    }
  }
}
