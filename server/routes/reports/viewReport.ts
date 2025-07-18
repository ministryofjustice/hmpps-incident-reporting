import { Router } from 'express'
import { MethodNotAllowed } from 'http-errors'

import logger from '../../../logger'
import { regenerateTitleForReport } from '../../services/reportTitle'
import {
  aboutTheType,
  prisonerInvolvementOutcomes,
  prisonerInvolvementRoles,
  staffInvolvementRoles,
  statuses,
  types,
  dwNotReviewed,
} from '../../reportConfiguration/constants'
import {
  logoutUnless,
  canViewReport,
  parseUserActionCode,
  prisonReportTransitions,
  userActionMapping,
  type UserAction,
} from '../../middleware/permissions'
import { populateReport } from '../../middleware/populateReport'
import { populateReportConfiguration } from '../../middleware/populateReportConfiguration'
import type { ReportWithDetails } from '../../data/incidentReportingApi'
import type { QuestionProgressStep } from '../../data/incidentTypeConfiguration/questionProgress'
import type { IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'
import type { GovukErrorSummaryItem } from '../../utils/govukFrontend'

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
export function viewReportRouter(): Router {
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
    logoutUnless(canViewReport),
    populateReportConfiguration(true),
    async (req, res) => {
      const { incidentReportingApi, prisonApi, userService } = res.locals.apis

      const report = res.locals.report as ReportWithDetails
      const { permissions, allowedActions, reportConfig, reportUrl, questionProgress } = res.locals
      const { userType } = permissions

      const usernames = [report.reportedBy]
      if (report.correctionRequests) {
        usernames.push(...report.correctionRequests.map(correctionRequest => correctionRequest.correctionRequestedBy))
      }
      const [usersLookup, prisonsLookup] = await Promise.all([
        userService.getUsers(res.locals.systemToken, usernames),
        prisonApi.getPrisons(),
      ])

      const questionProgressSteps = Array.from(questionProgress)

      const canEditReport = allowedActions.has('edit')
      const allowedActionsInNomisOnly = permissions.allowedActionsOnReport(report, 'nomis')
      const canEditReportInNomisOnly = allowedActionsInNomisOnly.has('edit')

      const allowedActionsNeedingForm = new Set<UserAction>()
      for (const action of allowedActions) {
        // these user actions are not part of this form
        if (!['view', 'edit'].includes(action)) {
          allowedActionsNeedingForm.add(action)
        }
      }

      // TODO: PECS lookup is different
      const reportTransitions = prisonReportTransitions?.[userType]?.[report.status] ?? {}

      let formValues: object = {}
      const errors: GovukErrorSummaryItem[] = []
      if (req.method === 'POST') {
        const { userAction } = req.body ?? {}
        if (parseUserActionCode(userAction) && userAction in reportTransitions) {
          let comment: string | undefined
          if (userAction) {
            comment = req.body[`${userAction}Comment`]?.trim()
          }
          const incidentNumber: string = req.body?.incidentNumber?.trim()
          formValues = {
            userAction,
            [`${userAction}Comment`]: comment,
            incidentNumber,
          }

          const transition = reportTransitions[userAction]
          if (
            userAction === 'recall' &&
            userType === 'reportingOfficer' &&
            ['CLOSED', 'NOT_REPORTABLE', 'DUPLICATE'].includes(report.status)
          ) {
            res.redirect(`${reportUrl}/reopen`)
            return
          }
          if (userAction === 'requestRemoval') {
            res.redirect(`${reportUrl}/remove-report`)
            return
          }
          if (transition.mustBeValid) {
            for (const error of checkReportIsComplete(report, reportConfig, questionProgressSteps, reportUrl)) {
              errors.push(error)
            }
          }

          // TODO: this should be in transition config: if a comment is optional!
          if (transition.commentRequired && !transition.incidentNumberRequired) {
            const nonWhitespace = /\S+/
            if (!comment || !nonWhitespace.test(comment)) {
              if (userAction === 'requestReview') {
                errors.push({
                  text: 'Enter what has changed in the report',
                  href: `#${userAction}Comment`,
                })
              } else if (userAction === 'markNotReportable') {
                errors.push({
                  text: 'Describe why incident is not reportable',
                  href: `#${userAction}Comment`,
                })
              } else {
                errors.push({
                  text: 'Please enter a comment',
                  href: `#${userAction}Comment`,
                })
              }
            }
          }

          if (transition.incidentNumberRequired) {
            const numbersOnly = /\d+/
            if (!incidentNumber || !numbersOnly.test(incidentNumber)) {
              errors.push({
                text: 'Please enter a numerical reference number',
                href: '#incidentNumber',
              })
            } else if (incidentNumber === report.reportReference) {
              errors.push({
                text: 'Enter a different report number',
                href: '#incidentNumber',
              })
            } else {
              try {
                await incidentReportingApi.getReportByReference(incidentNumber)
                logger.info(`Duplicate report incident number ${incidentNumber} does belong to a valid report`)
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
              } catch (e) {
                errors.push({
                  text: 'Enter a valid incident report number',
                  href: '#incidentNumber',
                })
              }
            }
          }

          if (errors.length === 0) {
            // can submit action
            try {
              // TODO: PECS regions need a different lookup
              const newTitle = regenerateTitleForReport(
                report,
                prisonsLookup[report.location].description || report.location,
              )
              await incidentReportingApi.updateReport(report.id, {
                title: newTitle,
              })

              const { newStatus } = transition
              if (newStatus && newStatus !== report.status) {
                await incidentReportingApi.changeReportStatus(report.id, { newStatus })
                // TODO: set report validation=true flag? not supported by api/db yet / ever will be?
              }

              logger.info(
                `Report ${report.reportReference} submitted the following action: ${userActionMapping[userAction].description}, and changed status from ${report.status} to ${newStatus}`,
              )
              if (userAction === 'recall') {
                res.redirect(reportUrl)
              } else {
                const { successBanner } = transition
                if (successBanner) {
                  req.flash('success', { title: successBanner.replace('$reportReference', report.reportReference) })
                }
                res.redirect('/reports')
              }
              return
            } catch (e) {
              logger.error(e, `Report ${report.reportReference} status could not be changed: %j`, e)
              errors.push({
                text: 'Action could not be submitted, please try again',
                href: '#userAction',
              })
            }
          }
        } else {
          // submitted but action is not chosen, unknown or explicitly not allowed
          const userActionError =
            allowedActionsNeedingForm.size === 0
              ? // User is not permitted to take any actions
                'You do not have permission to action this report'
              : // Ensures that users click an option before submitting
                'Select an action to take'
          errors.push({
            text: userActionError,
            href: '#userAction',
          })
        }
      }

      // Gather notification banner entries if they exist
      const banners = req.flash()

      // “About the [incident]”
      res.locals.aboutTheType = aboutTheType(res.locals.report.type)
      let descriptionAppendOnly: boolean = false
      if (dwNotReviewed.includes(report.status)) {
        descriptionAppendOnly = true
      }

      res.render('pages/reports/view/index', {
        errors,
        banners,
        report,
        reportConfig,
        questionProgressSteps,
        userType,
        allowedActionsNeedingForm,
        canEditReport,
        canEditReportInNomisOnly,
        descriptionAppendOnly,
        usersLookup,
        prisonsLookup,
        prisonerInvolvementLookup,
        prisonerOutcomeLookup,
        staffInvolvementLookup,
        typesLookup,
        statusLookup,
        reportTransitions,
        formValues,
      })
    },
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
