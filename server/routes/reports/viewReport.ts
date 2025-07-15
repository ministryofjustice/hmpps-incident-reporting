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
  prisonReportTransitions,
  userActions,
  UserAction,
  Transition,
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
      const { userType } = permissions

      const { userAction, incidentNumber } = req.body ?? {}
      const submittedAction = (req.body ?? {}).submittedAction as UserAction | undefined

      let comment: string
      if (submittedAction) {
        comment = req.body[`${submittedAction}Comment`]
      }

      const formValues = {
        userAction,
        submittedAction,
        [`${submittedAction}Comment`]: comment,
      }

      const pageTransitions = prisonReportTransitions[userType][report.status]
      const actionItems = Object.fromEntries(
        userActions.map(action => [
          action.code,
          {
            value: action.code,
            text: action.description,
          },
        ]),
      )

      const errors: GovukErrorSummaryItem[] = []
      if (req.method === 'POST') {
        const submittedTransition: Transition = pageTransitions[submittedAction]
        if (['changeReport', 'dwChangeStatus', 'dwChangeClosed'].includes(req.body?.userAction)) {
          try {
            // TODO: PECS regions need a different lookup
            const newTitle = regenerateTitleForReport(
              report,
              prisonsLookup[report.location].description || report.location,
            )
            await incidentReportingApi.updateReport(report.id, {
              title: newTitle,
            })

            const { newStatus } = pageTransitions.recall
            await incidentReportingApi.changeReportStatus(report.id, { newStatus })
            // TODO: set report validation=true flag? not supported by api/db yet / ever will be?

            logger.info(`Report ${report.reportReference} changed status from ${report.status} to ${newStatus}`)
            res.redirect(`${reportUrl}`)
            return
          } catch (e) {
            logger.error(e, `Report ${report.reportReference} status could not be changed: %j`, e)
            errors.push({
              text: 'Action could not be submitted, please try again',
              href: '#user-actions',
            })
          }
        } else if (req.body?.userAction === 'reopenReport') {
          res.redirect(`${reportUrl}/reopen`)
          return
        } else if (req.body?.userAction === 'submit') {
          if (submittedAction === 'requestRemoval') {
            res.redirect(`${reportUrl}/remove-report`)
            return
          }
          if ('mustBeValid' in submittedTransition) {
            for (const error of checkReportIsComplete(report, reportConfig, questionProgressSteps, reportUrl)) {
              errors.push(error)
            }
          }

          if ('commentRequired' in submittedTransition && !('incidentNumberRequired' in submittedTransition)) {
            const alphaNum = /[a-zA-Z0-9]+'/
            if (!comment || !alphaNum.test(comment)) {
              if (submittedAction === 'requestReview') {
                errors.push({
                  text: 'Enter what has changed in the report',
                  href: `#${submittedAction}Comment`,
                })
              } else if (submittedAction === 'markNotReportable') {
                errors.push({
                  text: 'Describe why incident is not reportable',
                  href: `#${submittedAction}Comment`,
                })
              } else {
                errors.push({
                  text: 'Please enter a comment',
                  href: `#${submittedAction}Comment`,
                })
              }
            }
          }

          if ('incidentNumberRequired' in submittedTransition) {
            const numbersOnly = /[0-9]+/
            if (!numbersOnly.test(incidentNumber)) {
              errors.push({
                text: 'Please enter a numerical reference number',
                href: `#incidentNumber`,
              })
            } else if (incidentNumber === report.reportReference) {
              errors.push({
                text: 'Enter a different report number',
                href: `#incidentNumber`,
              })
            } else {
              try {
                await incidentReportingApi.getReportByReference(incidentNumber)
                logger.info(`Duplicate report incident number ${incidentNumber} does belong to a valid report`)
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
              } catch (e) {
                errors.push({
                  text: 'Enter a valid incident report number',
                  href: `#incidentNumber`,
                })
              }
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

              const { newStatus } = submittedTransition
              await incidentReportingApi.changeReportStatus(report.id, { newStatus })
              // TODO: set report validation=true flag? not supported by api/db yet / ever will be?

              logger.info(
                `Report ${report.reportReference} submitted the following action: ${actionItems[submittedAction].text}, and changed status from ${report.status} to ${newStatus}`,
              )
              const { bannerText } = submittedTransition
              req.flash('success', { title: bannerText.replace('reportReference', `${report.reportReference}`) })
              res.redirect('/reports')
              return
            } catch (e) {
              logger.error(e, `Report ${report.reportReference} status could not be changed: %j`, e)
              errors.push({
                text: 'Action could not be submitted, please try again',
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
        pageTransitions,
        actionItems,
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
