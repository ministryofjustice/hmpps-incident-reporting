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
    const { prisonApi, offenderSearchApi } = res.locals.apis

    const report = res.locals.report as ReportWithDetails
    const { permissions, questionProgress } = res.locals

    const usernames = [report.reportedBy]
    if (report.staffInvolved) {
      usernames.push(...report.staffInvolved.map(staff => staff.staffUsername))
    }
    if (report.correctionRequests) {
      usernames.push(...report.correctionRequests.map(correctionRequest => correctionRequest.correctionRequestedBy))
    }
    const usersLookup = await userService.getUsers(res.locals.systemToken, usernames)

    let prisonersLookup = {}
    if (report.prisonersInvolved) {
      const prisonerNumbers = report.prisonersInvolved.map(pi => pi.prisonerNumber)
      prisonersLookup = await offenderSearchApi.getPrisoners(prisonerNumbers)
    }
    const prisonsLookup = await prisonApi.getPrisons()

    const typesLookup = Object.fromEntries(types.map(type => [type.code, type.description]))
    const statusLookup = Object.fromEntries(statuses.map(status => [status.code, status.description]))
    const prisonerInvolvementLookup = Object.fromEntries(
      prisonerInvolvementRoles.map(role => [role.code, role.description]),
    )
    const prisonerOutcomeLookup = Object.fromEntries(
      prisonerInvolvementOutcomes.map(outcome => [outcome.code, outcome.description]),
    )
    const staffInvolvementLookup = Object.fromEntries(staffInvolvementRoles.map(role => [role.code, role.description]))

    const questionProgressSteps = questionProgress.completedSteps()

    const canEditReport = permissions.canEditReport(report)
    const notEditableInDps = permissions.canEditReportInNomisOnly(report)

    res.render('pages/debug/reportDetails', {
      report,
      questionProgressSteps,
      canEditReport,
      notEditableInDps,
      prisonersLookup,
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
