import { type RequestHandler, Router } from 'express'
import { NotFound } from 'http-errors'

import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import HmppsAuthClient from '../data/hmppsAuthClient'
import RedisTokenStore from '../data/tokenStore/redisTokenStore'
import { createRedisClient } from '../data/redisClient'
import { IncidentReportingApi } from '../data/incidentReportingApi'
import config from '../config'
import ManageUsersApiClient from '../data/manageUsersApiClient'
import { OffenderSearchApi } from '../data/offenderSearchApi'

const hmppsAuthClient = new HmppsAuthClient(new RedisTokenStore(createRedisClient()))

export default function routes(service: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', (req, res, next) => {
    res.render('pages/index')
  })

  get('/incident/:id', async (req, res, next) => {
    const { id } = req.params

    const { user } = res.locals
    const systemToken = await hmppsAuthClient.getSystemClientToken(user.username)
    const incidentReportingApi = new IncidentReportingApi(systemToken)

    // No authorisation at this point, no data shown in production
    if (config.environment === 'prod') {
      throw new NotFound()
    }

    const event = await incidentReportingApi.getEventById(id)
    const inputUsernames = event.reports.map(report => report.modifiedBy)
    const users = await service.userService.getUsers(systemToken, inputUsernames)

    res.render('pages/incident', { event, users })
  })

  get('/report/:id', async (req, res, next) => {
    const { id } = req.params

    const { user } = res.locals
    const systemToken = await hmppsAuthClient.getSystemClientToken(user.username)
    const incidentReportingApi = new IncidentReportingApi(systemToken)
    const manageUsersApiClient = new ManageUsersApiClient()
    const offenderSearchApi = new OffenderSearchApi(systemToken)

    // No authorisation at this point, no data shown in production
    if (config.environment === 'prod') {
      throw new NotFound()
    }

    const report = await incidentReportingApi.getReportWithDetailsById(id)
    const reportedBy = (await manageUsersApiClient.getNamedUser(systemToken, report.reportedBy))?.name
    const prisonerNumbers = report.prisonersInvolved.map(pi => pi.prisonerNumber)
    const prisonersLookup = await offenderSearchApi.getPrisoners(prisonerNumbers)

    res.render('pages/report', { report, prisonersLookup, reportedBy })
  })

  get('/incidents', async (req, res, next) => {
    const { user } = res.locals
    const systemToken = await hmppsAuthClient.getSystemClientToken(user.username)
    const incidentReportingApi = new IncidentReportingApi(systemToken)

    // No authorisation at this point, no data shown in production
    if (config.environment === 'prod') {
      throw new NotFound()
    }

    const incidentsResponse = await incidentReportingApi.getEvents({
      // prisonId: user.activeCaseLoadId,
      // eventDateFrom: new Date('2024-07-30'),
      // eventDateUntil: new Date('2024-07-30'),
      // sort: ['eventDateAndTime,ASC'],
    })

    const incidents = incidentsResponse.content
    const inputUsernames = incidents.map(incident => incident.modifiedBy)
    const users = await service.userService.getUsers(systemToken, inputUsernames)

    res.render('pages/showIncidents', { incidents, users })
  })

  return router
}
