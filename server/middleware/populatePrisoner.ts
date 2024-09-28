import type { NextFunction, Request, Response } from 'express'

import logger from '../../logger'

export default function populatePrisoner() {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { offenderSearchApi } = res.locals.apis
      res.locals.prisoner = await offenderSearchApi.getPrisoner(req.params.prisonerId)
    } catch (error) {
      logger.error(error, 'Failed to populate prisoner')
      next(error)
      return
    }

    next()
  }
}
