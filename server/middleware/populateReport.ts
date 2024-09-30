import type { NextFunction, Request, Response } from 'express'

import logger from '../../logger'

// eslint-disable-next-line import/prefer-default-export
export function populateReport() {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { incidentReportingApi } = res.locals.apis
      res.locals.incident = await incidentReportingApi.getReportById(req.params.id)
    } catch (error) {
      logger.error(error, 'Failed to populate report')
      next(error)
      return
    }

    next()
  }
}
