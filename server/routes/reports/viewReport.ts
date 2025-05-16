import { Router } from 'express'
import { MethodNotAllowed } from 'http-errors'

import logger from '../../../logger'
import type { Services } from '../../services'
import { regenerateTitleForReport } from '../../services/reportTitle'
import {
  type Status,
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
import type { ReportWithDetails } from '../../data/incidentReportingApi'
import type { QuestionProgressStep } from '../../data/incidentTypeConfiguration/questionProgress'
import type { IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'
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
      const { incidentReportingApi, prisonApi } = res.locals.apis

      const report = res.locals.report as ReportWithDetails
      const { permissions, reportConfig, reportUrl, questionProgress } = res.locals

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
        if (req.body.userAction === 'submit') {
          // TODO: will need to work for other statuses too once lifecycle confirmed
          if (report.status !== 'DRAFT') {
            // incorrect status; users would never reach here through normal actions
            errors.push({
              text: 'Only a draft report can be submitted',
              href: '?',
            })
          } else if (!canEditReport) {
            // missing edit permission; users would never reach here through normal actions
            errors.push({
              text: 'You do not have permission to submit this report',
              href: '?',
            })
          } else {
            // allowed to submit so check report for validity
            for (const error of checkReportIsComplete(report, reportConfig, questionProgressSteps, reportUrl)) {
              errors.push(error)
            }
          }

          if (errors.length === 0) {
            // can submit for review
            try {
              // TODO: PECS regions need a different lookup
              const newTitle = regenerateTitleForReport(
                report,
                prisonsLookup[report.location].description || report.location,
              )
              await incidentReportingApi.updateReport(report.id, {
                title: newTitle,
              })

              // TODO: will need to work for other statuses too once lifecycle confirmed
              const newStatus: Status = 'AWAITING_REVIEW'
              await incidentReportingApi.changeReportStatus(report.id, { newStatus })
              // TODO: set report validation=true flag? not supported by api/db yet / ever will be?

              logger.info(
                `Report ${report.reportReference} submitted for review and changed status from ${report.status} to ${newStatus}`,
              )
              req.flash('success', { title: `You have submitted incident report ${report.reportReference}` })
              res.redirect('/reports')
              return
            } catch (e) {
              logger.error(e, `Report ${report.reportReference} could not be submitted: %j`, e)
              errors.push({
                text: 'Report could not be submitted, please try again',
                href: '#user-actions',
              })
            }
          }
        } else {
          // failsafe; users would never reach here through normal actions
          errors.push({
            text: 'Unknown action, please try again',
            href: '?',
          })
        }
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

/**
 * Generates error messages for incomplete reports:
 * - not all questions are complete
 * - prisoner involvements skipped initially
 * - prisoner involvements not added but incident type requires some
 * - staff involvements skipped initially
 * - staff involvements not added but incident type requires some
 */
function* checkReportIsComplete(
  report: ReportWithDetails,
  reportConfig: IncidentTypeConfiguration,
  questionProgressSteps: QuestionProgressStep[],
  reportUrl: string,
): Generator<GovukErrorSummaryItem, void, void> {
  if (!report.prisonerInvolvementDone) {
    // prisoners skipped, so must return
    yield {
      text: 'Please complete the prisoner involvement section',
      href: `${reportUrl}/prisoners`,
    }
  } else if (report.prisonersInvolved.length === 0 && reportConfig.requiresPrisoners) {
    // prisoner required
    yield {
      text: 'You need to add a prisoner',
      href: `${reportUrl}/prisoners`,
    }
  }

  if (!report.staffInvolvementDone) {
    // staff skipped, so must return
    yield {
      text: 'Please complete the staff involvement section',
      href: `${reportUrl}/staff`,
    }
  } else if (report.staffInvolved.length === 0 && reportConfig.requiresStaff) {
    // staff required
    yield {
      text: 'You need to add a member of staff',
      href: `${reportUrl}/staff`,
    }
  }

  const lastQuestion = questionProgressSteps.at(-1)
  if (!lastQuestion.isComplete) {
    // last question is incomplete
    yield {
      text: `You must answer question ${lastQuestion.questionNumber}`,
      href: `${reportUrl}/questions${lastQuestion.urlSuffix}`,
    }
  }
}
