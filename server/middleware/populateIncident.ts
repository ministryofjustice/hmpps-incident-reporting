import { NextFunction, Request, Response } from 'express'
import logger from '../../logger'

export default function populateIncident() {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { incidentReportingApi } = res.locals.apis
      res.locals.incident = await incidentReportingApi.getReportById(req.params.id)
    } catch (error) {
      logger.error(error, 'Failed to populate incident')
      next(error)
    }

    return next()
  }
}
