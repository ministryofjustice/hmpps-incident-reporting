import { NextFunction, Request, Response } from 'express'
import logger from '../../logger'
import HmppsAuthClient from '../data/hmppsAuthClient'
import RedisTokenStore from '../data/tokenStore/redisTokenStore'
import { createRedisClient } from '../data/redisClient'
import { IncidentReportingApi } from '../data/incidentReportingApi'

export default function populateIncident(decorate = false) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {
      const { user } = res.locals
      const hmppsAuthClient = new HmppsAuthClient(new RedisTokenStore(createRedisClient()))
      const systemToken = await hmppsAuthClient.getSystemClientToken(user.username)
      const incidentReportingApi = new IncidentReportingApi(systemToken)
      res.locals.incident = await incidentReportingApi.getReportById(req.params.id)

    } catch (error) {
      logger.error(
        error,
        `Failed to populate incident`,
      )
      next(error)
    }

    return next()
  }
}
