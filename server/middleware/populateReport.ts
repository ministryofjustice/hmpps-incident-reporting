import type { NextFunction, Request, Response } from 'express'

import logger from '../../logger'
import { getIncidentTypeConfiguration } from '../reportConfiguration/types'

// eslint-disable-next-line import/prefer-default-export
export function populateReport() {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { incidentReportingApi } = res.locals.apis
    const reportId = req.params.id

    try {
      res.locals.report = await incidentReportingApi.getReportWithDetailsById(reportId)
    } catch (error) {
      logger.error(error, `Failed to populate report ${reportId}`)
      next(error)
      return
    }

    try {
      res.locals.reportConfig = await getIncidentTypeConfiguration(res.locals.report.type)
    } catch (error) {
      logger.error(error, `Failed to populate config for report ${reportId} (${res.locals.report.type})`)
      next(error)
      return
    }

    next()
  }
}
