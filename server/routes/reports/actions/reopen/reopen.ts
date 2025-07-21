import { Router } from 'express'
import { MethodNotAllowed } from 'http-errors'

import logger from '../../../../../logger'
import { regenerateTitleForReport } from '../../../../services/reportTitle'
import { logoutUnless, hasPermissionTo, prisonReportTransitions } from '../../../../middleware/permissions'
import { populateReport } from '../../../../middleware/populateReport'
import type { GovukErrorSummaryItem } from '../../../../utils/govukFrontend'
import { ReportWithDetails } from '../../../../data/incidentReportingApi'

// eslint-disable-next-line import/prefer-default-export
export function reopenReportRouter(): Router {
  const router = Router({ mergeParams: true })

  router.all(
    '/',
    (req, _res, next) => {
      if (req.method === 'GET' || req.method === 'POST') {
        next()
      } else {
        next(new MethodNotAllowed())
      }
    },
    populateReport(true),
    // TODO: incorrect action check
    logoutUnless(hasPermissionTo('view')),
    async (req, res) => {
      const { incidentReportingApi, prisonApi } = res.locals.apis

      const report = res.locals.report as ReportWithDetails
      const { reportUrl } = res.locals

      const prisonsLookup = await prisonApi.getPrisons()

      const errors: GovukErrorSummaryItem[] = []
      if (req.method === 'POST') {
        if (req.body?.userAction === 'reopenReport') {
          try {
            // TODO: PECS regions need a different lookup
            const newTitle = regenerateTitleForReport(
              report,
              prisonsLookup[report.location].description || report.location,
            )
            await incidentReportingApi.updateReport(report.id, {
              title: newTitle,
            })

            const { newStatus } = prisonReportTransitions.reportingOfficer[report.status].recall
            await incidentReportingApi.changeReportStatus(report.id, { newStatus })
            // TODO: set report validation=true flag? not supported by api/db yet / ever will be?

            logger.info(
              `Report ${report.reportReference} has been reopened and changed status from ${report.status} to ${newStatus}`,
            )
            res.redirect(reportUrl)
            return
          } catch (e) {
            logger.error(e, `Report ${report.reportReference} status could not be changed: %j`, e)
            errors.push({
              text: 'Action could not be submitted, please try again',
              href: '#user-actions',
            })
          }
        } else {
          // failsafe; users would never reach here through normal actions
          errors.push({
            text: 'Unknown action, please try again',
            href: '?',
          })
        }
      }

      res.render('pages/reports/actions/reopen', {
        report,
        reportUrl,
      })
    },
  )

  return router
}
