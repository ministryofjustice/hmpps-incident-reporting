import { Router } from 'express'

import type { ReportWithDetails } from '../../../data/incidentReportingApi'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import { logoutIf } from '../../../middleware/permissions'
import { populateReport } from '../../../middleware/populateReport'
import { statuses } from '../../../reportConfiguration/constants'
import type { Services } from '../../../services'
import { cannotViewReport } from '../permissions'

// eslint-disable-next-line import/prefer-default-export
export function historyRouter(service: Services): Router {
  const { userService } = service

  const router = Router({ mergeParams: true })
  router.use(populateReport(), logoutIf(cannotViewReport))

  router.get(
    '/status',
    asyncMiddleware(async (_req, res) => {
      const report = res.locals.report as ReportWithDetails

      const usernames = report.historyOfStatuses.map(status => status.changedBy)
      const usersLookup = await userService.getUsers(res.locals.systemToken, usernames)
      const statusLookup = Object.fromEntries(statuses.map(status => [status.code, status.description]))

      res.render('pages/reports/history/status', {
        report,
        usersLookup,
        statusLookup,
      })
    }),
  )

  return router
}
