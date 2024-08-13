import type { RequestHandler } from 'express'
import { NotFound } from 'http-errors'

import type { Services } from '../services'
import HmppsAuthClient from '../data/hmppsAuthClient'
import { createRedisClient } from '../data/redisClient'
import RedisTokenStore from '../data/tokenStore/redisTokenStore'
import { IncidentReportingApi } from '../data/incidentReportingApi'
import ManageUsersApiClient from '../data/manageUsersApiClient'
import { OffenderSearchApi } from '../data/offenderSearchApi'

export default function makeDebugRoutes(services: Services): Record<string, RequestHandler> {
  const hmppsAuthClient = new HmppsAuthClient(new RedisTokenStore(createRedisClient()))

  return {
    async incidentList(req, res) {
      const { user } = res.locals
      const systemToken = await hmppsAuthClient.getSystemClientToken(user.username)
      const incidentReportingApi = new IncidentReportingApi(systemToken)

      const incidentsResponse = await incidentReportingApi.getEvents({
        // prisonId: user.activeCaseLoadId,
        // eventDateFrom: new Date('2024-07-30'),
        // eventDateUntil: new Date('2024-07-30'),
        // sort: ['eventDateAndTime,ASC'],
      })

      const incidents = incidentsResponse.content
      const inputUsernames = incidents.map(incident => incident.modifiedBy)
      const users = await services.userService.getUsers(systemToken, inputUsernames)

      res.render('pages/debug/incidentList', { incidents, users })
    },

    async incidentDetails(req, res) {
      const { id } = req.params
      if (!id) {
        throw new NotFound()
      }

      const { user } = res.locals
      const systemToken = await hmppsAuthClient.getSystemClientToken(user.username)
      const incidentReportingApi = new IncidentReportingApi(systemToken)

      const event = await incidentReportingApi.getEventById(id)
      const inputUsernames = event.reports.map(report => report.modifiedBy)
      const users = await services.userService.getUsers(systemToken, inputUsernames)

      res.render('pages/debug/incidentDetails', { event, users })
    },

    async reportDetails(req, res) {
      const { id } = req.params
      if (!id) {
        throw new NotFound()
      }

      const { user } = res.locals
      const systemToken = await hmppsAuthClient.getSystemClientToken(user.username)
      const incidentReportingApi = new IncidentReportingApi(systemToken)
      const manageUsersApiClient = new ManageUsersApiClient()
      const offenderSearchApi = new OffenderSearchApi(systemToken)

      const report = await incidentReportingApi.getReportWithDetailsById(id)
      const reportedBy = (await manageUsersApiClient.getNamedUser(systemToken, report.reportedBy))?.name
      const prisonerNumbers = report.prisonersInvolved.map(pi => pi.prisonerNumber)
      const prisonersLookup = await offenderSearchApi.getPrisoners(prisonerNumbers)

      res.render('pages/debug/reportDetails', { report, prisonersLookup, reportedBy })
    },
  }
}
