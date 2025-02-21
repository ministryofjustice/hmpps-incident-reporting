import type { NextFunction, Request, Response } from 'express'
import { NotImplemented } from 'http-errors'

import logger from '../../logger'

// eslint-disable-next-line import/prefer-default-export
export function populatePrisoner() {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { prisonerNumber } = req.params
    if (!prisonerNumber) {
      next(new NotImplemented('populatePrisoner() requires req.params.prisonerNumber'))
      return
    }

    try {
      const { offenderSearchApi } = res.locals.apis
      res.locals.prisoner = await offenderSearchApi.getPrisoner(prisonerNumber)
      next()
    } catch (error) {
      logger.error(error, 'Failed to populate prisoner')
      next(error)
    }
  }
}
