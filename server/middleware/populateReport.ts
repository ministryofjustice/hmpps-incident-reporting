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
    const { permissions } = res.locals
    if (!reportId) {
      next(new NotImplemented('populateReport() requires req.params.reportId'))
      return
    }
    if (!permissions) {
      next(new NotImplemented('populateReport() requires permissions middleware'))
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

      res.locals.allowedActions = permissions.allowedActionsOnReport(res.locals.report)

      next()
    } catch (error) {
      logger.error(error, `Failed to load report ${reportId}`)
      if (error.responseStatus === 400) {
        // if a mistyped UUID is looked up, the api response is 400, but for the purpose of this app the report simply can't be found
        error.responseStatus = 404
      }
      next(error)
    }
  }
}
