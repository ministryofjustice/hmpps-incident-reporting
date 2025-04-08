import { Router } from 'express'
import { MethodNotAllowed } from 'http-errors'

import type { Services } from '../../services'
import {
  aboutTheType,
  prisonerInvolvementOutcomes,
  prisonerInvolvementRoles,
  staffInvolvementRoles,
  statuses,
  types,
} from '../../reportConfiguration/constants'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import { logoutIf } from '../../middleware/permissions'
import { populateReport } from '../../middleware/populateReport'
import { populateReportConfiguration } from '../../middleware/populateReportConfiguration'
import { type ReportWithDetails } from '../../data/incidentReportingApi'
import type { GovukErrorSummaryItem } from '../../utils/govukFrontend'
import { cannotViewReport } from './permissions'

const typesLookup = Object.fromEntries(types.map(type => [type.code, type.description]))
const statusLookup = Object.fromEntries(statuses.map(status => [status.code, status.description]))
const prisonerInvolvementLookup = Object.fromEntries(
  prisonerInvolvementRoles.map(role => [role.code, role.description]),
)
const prisonerOutcomeLookup = Object.fromEntries(
  prisonerInvolvementOutcomes.map(outcome => [outcome.code, outcome.description]),
)
const staffInvolvementLookup = Object.fromEntries(staffInvolvementRoles.map(role => [role.code, role.description]))

// eslint-disable-next-line import/prefer-default-export
export function viewReportRouter(service: Services): Router {
  const { userService } = service

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
    logoutIf(cannotViewReport),
    populateReportConfiguration(true),
    asyncMiddleware(async (req, res) => {
      const { prisonApi } = res.locals.apis

      const report = res.locals.report as ReportWithDetails
      const { permissions, reportConfig, questionProgress } = res.locals

      const usernames = [report.reportedBy]
      if (report.correctionRequests) {
        usernames.push(...report.correctionRequests.map(correctionRequest => correctionRequest.correctionRequestedBy))
      }
      const [usersLookup, prisonsLookup] = await Promise.all([
        userService.getUsers(res.locals.systemToken, usernames),
        prisonApi.getPrisons(),
      ])

      const questionProgressSteps = Array.from(questionProgress)

      const canEditReport = permissions.canEditReport(report)
      const canEditReportInNomisOnly = permissions.canEditReportInNomisOnly(report)

      const errors: GovukErrorSummaryItem[] = []
      if (req.method === 'POST') {
        errors.push({ text: 'TODO: not implemented', href: '?' })
      }

      // Gather notification banner entries if they exist
      const banners = req.flash()

      // “About the [incident]”
      res.locals.aboutTheType = aboutTheType(res.locals.report.type)

      res.render('pages/reports/view/index', {
        errors,
        banners,
        report,
        reportConfig,
        questionProgressSteps,
        canEditReport,
        canEditReportInNomisOnly,
        usersLookup,
        prisonsLookup,
        prisonerInvolvementLookup,
        prisonerOutcomeLookup,
        staffInvolvementLookup,
        typesLookup,
        statusLookup,
      })
    }),
  )

  return router
}
