import type { NextFunction, Request, Response } from 'express'

import logger from '../../logger'

// eslint-disable-next-line import/prefer-default-export
export function populatePrisoner() {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { offenderSearchApi } = res.locals.apis
      res.locals.prisoner = await offenderSearchApi.getPrisoner(req.params.prisonerNumber)
    } catch (error) {
      logger.error(error, 'Failed to populate prisoner')
      next(error)
      return
    }

    next()
  }
}
