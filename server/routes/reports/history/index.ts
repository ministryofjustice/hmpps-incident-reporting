import { Router } from 'express'

import type { ReportWithDetails } from '../../../data/incidentReportingApi'
import { logoutUnless, hasPermissionTo } from '../../../middleware/permissions'
import { populateReport } from '../../../middleware/populateReport'
import { statusesDescriptions, typesDescriptions } from '../../../reportConfiguration/constants'
import { populateReportConfiguration } from '../../../middleware/populateReportConfiguration'

export function historyRouter(): Router {
  const router = Router({ mergeParams: true })
  router.use(populateReport(true), logoutUnless(hasPermissionTo('VIEW')))

  router.get('/status', async (_req, res) => {
    const report = res.locals.report as ReportWithDetails

    const usernames = report.historyOfStatuses.map(status => status.changedBy)
    const usersLookup = await res.locals.apis.userService.getUsers(res.locals.systemToken, usernames)

    res.render('pages/reports/history/status', {
      usersLookup,
      statusesDescriptions,
    })
  })

  router.get('/type', populateReportConfiguration(false), async (_req, res) => {
    const report = res.locals.report as ReportWithDetails

    const usernames = report.history.map(history => history.changedBy)
    const usersLookup = await res.locals.apis.userService.getUsers(res.locals.systemToken, usernames)

    res.render('pages/reports/history/type', {
      usersLookup,
      typesDescriptions,
    })
  })

  return router
}
