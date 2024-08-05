import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import HmppsAuthClient from '../data/hmppsAuthClient'
import RedisTokenStore from '../data/tokenStore/redisTokenStore'
import { createRedisClient } from '../data/redisClient'
import { IncidentReportingApi } from '../data/incidentReportingApi'

const hmppsAuthClient = new HmppsAuthClient(new RedisTokenStore(createRedisClient()))

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(service: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', (req, res, next) => {
    res.render('pages/index')
  })

  get('/events', async (req, res, next) => {
    const { user } = res.locals
    const systemToken = await hmppsAuthClient.getSystemClientToken(user.username)
    const incidentReportingApi = new IncidentReportingApi(systemToken)

    const response = await incidentReportingApi.getEvents({
      prisonId: user.activeCaseLoadId,
      // eventDateFrom: new Date('2024-07-30'),
      // eventDateUntil: new Date('2024-07-30'),
      // sort: ['eventDateAndTime,ASC'],
    })

    res.render('pages/events', { response })
  })

  return router
}
