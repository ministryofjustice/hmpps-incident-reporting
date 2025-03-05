import { Router } from 'express'

import type { ReportWithDetails } from '../../../data/incidentReportingApi'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import { logoutIf } from '../../../middleware/permissions'
import { populateReport } from '../../../middleware/populateReport'
import { statuses, types } from '../../../reportConfiguration/constants'
import type { Services } from '../../../services'
import { cannotViewReport } from '../permissions'
import { populateReportConfiguration } from '../../../middleware/populateReportConfiguration'

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

  router.get(
    '/type',
    populateReportConfiguration(false),
    asyncMiddleware(async (_req, res) => {
      const report = res.locals.report as ReportWithDetails

      const usernames = report.history.map(history => history.changedBy)
      const usersLookup = await userService.getUsers(res.locals.systemToken, usernames)
      const typesLookup = Object.fromEntries(types.map(type => [type.code, type.description]))

      res.render('pages/reports/history/type', {
        report,
        usersLookup,
        typesLookup,
      })
    }),
  )

  return router
}
