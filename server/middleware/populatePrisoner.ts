import { NextFunction, Request, Response } from 'express'
import logger from '../../logger'
import HmppsAuthClient from '../data/hmppsAuthClient'
import RedisTokenStore from '../data/tokenStore/redisTokenStore'
import { createRedisClient } from '../data/redisClient'
import { OffenderSearchApi } from '../data/offenderSearchApi'

export default function populatePrisoner() {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { user } = res.locals
      const hmppsAuthClient = new HmppsAuthClient(new RedisTokenStore(createRedisClient()))
      const systemToken = await hmppsAuthClient.getSystemClientToken(user.username)
      const offenderSearchClient = new OffenderSearchApi(systemToken)

      res.locals.prisoner = await offenderSearchClient.getPrisoner(req.params.prisonerId)
    } catch (error) {
      logger.error(error, 'Failed to populate prisoner')
      next(error)
    }

    return next()
  }
}
