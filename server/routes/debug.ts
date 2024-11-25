import type { RequestHandler } from 'express'
import { NotFound } from 'http-errors'

import type { Services } from '../services'

export default function makeDebugRoutes(services: Services): Record<string, RequestHandler> {
  const { userService } = services

  return {
    async eventDetails(req, res) {
      const { incidentReportingApi, prisonApi } = res.locals.apis

      const { id } = req.params
      if (!id) {
        throw new NotFound()
      }

      const event = await incidentReportingApi.getEventById(id)
      const usernames = event.reports.map(report => report.reportedBy)
      const usersLookup = await userService.getUsers(res.locals.systemToken, usernames)
      const prisonsLookup = await prisonApi.getPrisons()

      res.render('pages/debug/eventDetails', { event, usersLookup, prisonsLookup })
    },
  }
}
