import type { RequestHandler } from 'express'
import { Router } from 'express'
import type { PathParams } from 'express-serve-static-core'

import type { Services } from '../../services'
import {
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
import { cannotViewReport } from './permissions'

// eslint-disable-next-line import/prefer-default-export
export function viewReportRouter(service: Services): Router {
  const { userService } = service

  const router = Router({ mergeParams: true })
  const get = (path: PathParams, handler: RequestHandler) =>
    router.get(
      path,
      populateReport(),
      logoutIf(cannotViewReport),
      populateReportConfiguration(true),
      asyncMiddleware(handler),
    )

  get('/', async (_req, res) => {
    const { prisonApi } = res.locals.apis

    const report = res.locals.report as ReportWithDetails
    const { permissions, questionProgress } = res.locals

    const usernames = [report.reportedBy]
    if (report.correctionRequests) {
      usernames.push(...report.correctionRequests.map(correctionRequest => correctionRequest.correctionRequestedBy))
    }

    const [usersLookup, prisonsLookup] = await Promise.all([
      userService.getUsers(res.locals.systemToken, usernames),
      prisonApi.getPrisons(),
    ])

    const typesLookup = Object.fromEntries(types.map(type => [type.code, type.description]))
    const statusLookup = Object.fromEntries(statuses.map(status => [status.code, status.description]))
    const prisonerInvolvementLookup = Object.fromEntries(
      prisonerInvolvementRoles.map(role => [role.code, role.description]),
    )
    const prisonerOutcomeLookup = Object.fromEntries(
      prisonerInvolvementOutcomes.map(outcome => [outcome.code, outcome.description]),
    )
    const staffInvolvementLookup = Object.fromEntries(staffInvolvementRoles.map(role => [role.code, role.description]))

    const questionProgressSteps = Array.from(questionProgress)

    const canEditReport = permissions.canEditReport(report)
    const canEditReportInNomisOnly = permissions.canEditReportInNomisOnly(report)

    res.render('pages/reports/view/index', {
      report,
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
  })

  return router
}
