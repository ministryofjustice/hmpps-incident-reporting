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
import { makeUsernameLookup } from '../utils/utils'
import { OffenderSearchApi } from '../data/offenderSearchApi'

const hmppsAuthClient = new HmppsAuthClient(new RedisTokenStore(createRedisClient()))

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    const manageUsersApiClient = new ManageUsersApiClient()

    // No authorisation at this point, no data shown in production
    if (config.environment === 'prod') {
      throw new NotFound()
    }

    const event = await incidentReportingApi.getEventById(id)

    const inputUsernames = []
    for (const report of event.reports) {
      inputUsernames.push(report.reportedBy)
    }

    const nameMappings = await makeUsernameLookup(manageUsersApiClient, systemToken, inputUsernames)

    res.render('pages/incident', { event, nameMappings })
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

    const report = await incidentReportingApi.getReportWithDetailsById(id
    const reportedBy = (await manageUsersApiClient.getNamedUser(systemToken, report.reportedBy))?.name
    const prisonerNumbers = report.prisonersInvolved.map(pi => pi.prisonerNumber)
    const prisonersLookup = await offenderSearchApi.getPrisoners(prisonerNumbers)

    res.render('pages/report', { report, prisonersLookup, reportedBy })
  })

  get('/incidents', async (req, res, next) => {
    const { user } = res.locals
    const systemToken = await hmppsAuthClient.getSystemClientToken(user.username)
    const incidentReportingApi = new IncidentReportingApi(systemToken)
    const manageUsersApiClient = new ManageUsersApiClient()

    const incidents = (
      await incidentReportingApi.getEvents({
        // prisonId: user.activeCaseLoadId,
        // eventDateFrom: new Date('2024-07-30'),
        // eventDateUntil: new Date('2024-07-30'),
        // sort: ['eventDateAndTime,ASC'],
      })
    )?.content

    const inputUsernames = []
    for (const incident of incidents) {
      inputUsernames.push(incident.modifiedBy)
    }

    const nameMappings = await makeUsernameLookup(manageUsersApiClient, systemToken, inputUsernames)

    res.render('pages/showIncidents', { incidents, nameMappings })
  })

  return router
}
