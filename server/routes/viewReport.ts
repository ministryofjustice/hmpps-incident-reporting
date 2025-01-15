import type { RequestHandler } from 'express'

import { Router } from 'express'
import type { PathParams } from 'express-serve-static-core'
import type { Services } from '../services'
import {
  prisonerInvolvementOutcomes,
  prisonerInvolvementRoles,
  staffInvolvementRoles,
  statuses,
  types,
} from '../reportConfiguration/constants'
import asyncMiddleware from '../middleware/asyncMiddleware'
import { populateReport } from '../middleware/populateReport'
import { populateReportConfiguration } from '../middleware/populateReportConfiguration'
import { type ReportWithDetails } from '../data/incidentReportingApi'
import {
  findAnswerConfigByCode,
  stripQidPrefix,
  type IncidentTypeConfiguration,
} from '../data/incidentTypeConfiguration/types'

export default function viewReport(service: Services): Router {
  const router = Router({ mergeParams: true })
  const { userService } = service
  const get = (path: PathParams, handler: RequestHandler) =>
    router.get(path, [populateReport(), populateReportConfiguration(false), asyncMiddleware(handler)])

  get('/', async (req, res) => {
    const { prisonApi, offenderSearchApi } = res.locals.apis

    const reportConfig = res.locals.reportConfig as IncidentTypeConfiguration
    const report = useReportConfigLabels(res.locals.report as ReportWithDetails, reportConfig)

    let usernames = [report.reportedBy]
    if (report.staffInvolved) {
      usernames = [...report.staffInvolved.map(staff => staff.staffUsername), ...usernames]
    }
    if (report.correctionRequests) {
      usernames = [
        ...report.correctionRequests.map(correctionRequest => correctionRequest.correctionRequestedBy),
        ...usernames,
      ]
    }
    const usersLookup = await userService.getUsers(res.locals.systemToken, usernames)

    let prisonersLookup = null
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

    res.render('pages/debug/reportDetails', {
      report,
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

/**
 * Replaces the questions/responses with the labels in the report config
 */
function useReportConfigLabels(report: ReportWithDetails, reportConfig: IncidentTypeConfiguration): ReportWithDetails {
  for (const question of report.questions) {
    const questionCode = stripQidPrefix(question.code)
    const questionConfig = reportConfig.questions[questionCode]
    if (!questionConfig) {
      // eslint-disable-next-line no-continue
      continue
    }

    question.question = questionConfig?.label ?? question.question
    for (const response of question.responses) {
      const answerConfig = findAnswerConfigByCode(response.response, questionConfig)
      response.response = answerConfig?.label ?? response.response
    }
  }

  return report
}
