import type { Request, Response } from 'express'
import { NotFound } from 'http-errors'

export default function makeDebugRoutes() {
  return {
    async eventDetails(req: Request, res: Response): Promise<void> {
      const { incidentReportingApi, prisonApi } = res.locals.apis

      const { eventId } = req.params
      if (!eventId) {
        throw new NotFound()
      }

      const event = await incidentReportingApi.getEventById(eventId)
      const usernames = event.reports.map(report => report.reportedBy)
      const [usersLookup, prisonsLookup] = await Promise.all([
        res.locals.api.userService.getUsers(res.locals.systemToken, usernames),
        prisonApi.getPrisons(),
      ])

      res.render('pages/debug/eventDetails', { event, usersLookup, prisonsLookup })
    },
  } as const
}
