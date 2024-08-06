import { type RequestHandler, Router } from 'express'
import { NotFound } from 'http-errors'

import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import HmppsAuthClient from '../data/hmppsAuthClient'
import RedisTokenStore from '../data/tokenStore/redisTokenStore'
import { createRedisClient } from '../data/redisClient'
import { IncidentReportingApi } from '../data/incidentReportingApi'
import config from '../config'

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

    // No authorisation at this point, no data shown in production
    if (config.environment === 'prod') {
      response.content = []
    }

    res.render('pages/events', { response })
  })

  get('/event/:id', async (req, res, next) => {
    const { id } = req.params

    const { user } = res.locals
    const systemToken = await hmppsAuthClient.getSystemClientToken(user.username)
    const incidentReportingApi = new IncidentReportingApi(systemToken)

    // No authorisation at this point, no data shown in production
    if (config.environment === 'prod') {
      throw new NotFound()
    }

    const event = await incidentReportingApi.getEventById(id)

    res.render('pages/event', { event })
  })

  get('/report/:id', async (req, res, next) => {
    const { id } = req.params

    const { user } = res.locals
    const systemToken = await hmppsAuthClient.getSystemClientToken(user.username)
    const incidentReportingApi = new IncidentReportingApi(systemToken)

    // No authorisation at this point, no data shown in production
    if (config.environment === 'prod') {
      throw new NotFound()
    }

    const report = await incidentReportingApi.getReportWithDetailsById(id)

    res.render('pages/report', { report })
  })

  return router
}
