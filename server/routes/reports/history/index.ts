import { Router } from 'express'

import type { ReportWithDetails } from '../../../data/incidentReportingApi'
import { logoutUnless, hasPermissionTo } from '../../../middleware/permissions'
import { populateReport } from '../../../middleware/populateReport'
import { statuses, types } from '../../../reportConfiguration/constants'
import { populateReportConfiguration } from '../../../middleware/populateReportConfiguration'

// eslint-disable-next-line import/prefer-default-export
export function historyRouter(): Router {
  const router = Router({ mergeParams: true })
  router.use(populateReport(), logoutUnless(hasPermissionTo('view')))

  router.get('/status', async (_req, res) => {
    const report = res.locals.report as ReportWithDetails

    const usernames = report.historyOfStatuses.map(status => status.changedBy)
    const usersLookup = await res.locals.apis.userService.getUsers(res.locals.systemToken, usernames)
    const statusLookup = Object.fromEntries(statuses.map(status => [status.code, status.description]))

    res.render('pages/reports/history/status', {
      report,
      usersLookup,
      statusLookup,
    })
  })

  router.get('/type', populateReportConfiguration(false), async (_req, res) => {
    const report = res.locals.report as ReportWithDetails

    const usernames = report.history.map(history => history.changedBy)
    const usersLookup = await res.locals.apis.userService.getUsers(res.locals.systemToken, usernames)
    const typesLookup = Object.fromEntries(types.map(type => [type.code, type.description]))

    res.render('pages/reports/history/type', {
      report,
      usersLookup,
      typesLookup,
    })
  })

  return router
}
