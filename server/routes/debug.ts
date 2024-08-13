import type { RequestHandler } from 'express'
import { NotFound } from 'http-errors'

import { pagination } from '../utils/pagination'
import type { Services } from '../services'
import HmppsAuthClient from '../data/hmppsAuthClient'
import { createRedisClient } from '../data/redisClient'
import RedisTokenStore from '../data/tokenStore/redisTokenStore'
import { IncidentReportingApi } from '../data/incidentReportingApi'
import { OffenderSearchApi } from '../data/offenderSearchApi'

export default function makeDebugRoutes(services: Services): Record<string, RequestHandler> {
  const hmppsAuthClient = new HmppsAuthClient(new RedisTokenStore(createRedisClient()))

  return {
    async incidentList(req, res) {
      const { page } = req.query

      const { user } = res.locals
      const systemToken = await hmppsAuthClient.getSystemClientToken(user.username)
      const incidentReportingApi = new IncidentReportingApi(systemToken)

      let pageNumber = (page && typeof page === 'string' && parseInt(page, 10)) || 1
      if (pageNumber < 1) {
        pageNumber = 1
      }

      const urlPrefix = '/incidents?' // TODO: fill with filters
      const incidentsResponse = await incidentReportingApi.getEvents({
        page: pageNumber - 1,
        // prisonId: user.activeCaseLoadId,
        // eventDateFrom: new Date('2024-07-30'),
        // eventDateUntil: new Date('2024-07-30'),
        // sort: ['eventDateAndTime,ASC'],
      })
      const paginationParams = pagination(
        pageNumber,
        incidentsResponse.totalPages,
        urlPrefix,
        'moj',
        incidentsResponse.totalElements,
        incidentsResponse.size,
      )

      const incidents = incidentsResponse.content
      const inputUsernames = incidents.map(incident => incident.modifiedBy)
      const usersLookup = await services.userService.getUsers(systemToken, inputUsernames)

      res.render('pages/debug/incidentList', { incidents, usersLookup, paginationParams })
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
      const inputUsernames = event.reports.map(report => report.reportedBy)
      const usersLookup = await services.userService.getUsers(systemToken, inputUsernames)

      res.render('pages/debug/incidentDetails', { event, usersLookup })
    },

    async reportDetails(req, res) {
      const { id } = req.params
      if (!id) {
        throw new NotFound()
      }

      const { user } = res.locals
      const systemToken = await hmppsAuthClient.getSystemClientToken(user.username)
      const incidentReportingApi = new IncidentReportingApi(systemToken)
      const offenderSearchApi = new OffenderSearchApi(systemToken)

      const report = await incidentReportingApi.getReportWithDetailsById(id)
      const usersLookup = await services.userService.getUsers(systemToken, [
        ...report.staffInvolved.map(staff => staff.staffUsername),
        report.reportedBy,
      ])
      const prisonerNumbers = report.prisonersInvolved.map(pi => pi.prisonerNumber)
      const prisonersLookup = await offenderSearchApi.getPrisoners(prisonerNumbers)

      res.render('pages/debug/reportDetails', { report, prisonersLookup, usersLookup })
    },
  }
}
