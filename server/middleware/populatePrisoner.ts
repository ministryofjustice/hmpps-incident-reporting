import type { RequestHandler } from 'express'
import { NotImplemented } from 'http-errors'

import logger from '../../logger'

export function populatePrisoner(): RequestHandler {
  return async (req, res, next): Promise<void> => {
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
