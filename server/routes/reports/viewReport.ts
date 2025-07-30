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
  workListMapping,
} from '../../reportConfiguration/constants'
import {
  logoutUnless,
  hasPermissionTo,
  parseUserActionCode,
  prisonReportTransitions,
  userActionMapping,
  type ApiUserType,
  type ApiUserAction,
  type UserAction,
} from '../../middleware/permissions'
import { populateReport } from '../../middleware/populateReport'
import { populateReportConfiguration } from '../../middleware/populateReportConfiguration'
import type { ReportWithDetails } from '../../data/incidentReportingApi'
import { validateReport } from '../../data/reportValidity'
import type { GovukErrorSummaryItem } from '../../utils/govukFrontend'
import { correctionRequestActionLabels } from './actions/correctionRequestLabels'
import { placeholderForCorrectionRequest } from './actions/correctionRequestPlaceholder'

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
    logoutUnless(hasPermissionTo('VIEW')),
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

      const canEditReport = allowedActions.has('EDIT')
      const allowedActionsInNomisOnly = permissions.allowedActionsOnReport(report, 'nomis')
      const canEditReportInNomisOnly = allowedActionsInNomisOnly.has('EDIT')

      const allowedActionsNeedingForm = new Set<UserAction>()
      for (const action of allowedActions) {
        // these user actions are not part of this form
        if (!['VIEW', 'EDIT'].includes(action)) {
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
          const transition = reportTransitions[userAction]

          if (
            userAction === 'RECALL' &&
            userType === 'REPORTING_OFFICER' &&
            workListMapping.done.includes(report.status)
          ) {
            res.redirect(`${reportUrl}/reopen`)
            return
          }
          if (userAction === 'REQUEST_REMOVAL') {
            res.redirect(`${reportUrl}/request-remove`)
            return
          }

          // check report is valid if required
          // TODO: may need report.isValid flag or similar so that validation is forced when RO submits but is not repeated when DW closes
          if (transition.mustBeValid) {
            for (const error of validateReport(report, reportConfig, questionProgressSteps, reportUrl)) {
              errors.push(error)
            }
          }

          const commentFieldName = `${userAction}_COMMENT`
          let comment: string | undefined = req.body[commentFieldName]?.trim()
          const originalReportReference: string | undefined = req.body.originalReportReference?.trim()
          formValues = {
            userAction,
            [commentFieldName]: comment,
            originalReportReference,
          }

          // check comment if required
          if (transition.comment === 'required') {
            const nonWhitespace = /\S+/
            if (!comment || !nonWhitespace.test(comment)) {
              const commentMissingError =
                transition.commentMissingError ||
                // fallback; doesn’t currently appear
                'Please enter a comment'
              errors.push({
                text: commentMissingError,
                href: `#${commentFieldName}`,
              })
            }
          }

          // check original incident number if required
          if (transition.originalReportReferenceRequired) {
            const numbersOnly = /\d+/
            if (!originalReportReference || !numbersOnly.test(originalReportReference)) {
              errors.push({
                text: 'Enter a valid incident report number',
                href: '#originalReportReference',
              })
            } else if (originalReportReference === report.reportReference) {
              errors.push({
                text: 'Enter a different report number',
                href: '#originalReportReference',
              })
            } else {
              try {
                await incidentReportingApi.getReportByReference(originalReportReference)
                logger.debug(`Original report incident number ${originalReportReference} does belong to a valid report`)
              } catch (e) {
                let errorMessage = 'Incident number could not be looked up, please try again'
                if ('responseStatus' in e && e.responseStatus === 404) {
                  logger.debug(
                    `Original report incident number ${originalReportReference} does NOT belong to a valid report`,
                  )
                  errorMessage = 'Enter a valid incident report number'
                }
                errors.push({
                  text: errorMessage,
                  href: '#originalReportReference',
                })
              }
            }
          }

          if (errors.length === 0) {
            // can submit action
            try {
              if (userAction === 'REQUEST_REVIEW') {
                // TODO: regeneration will be moved elsewhere
                // TODO: PECS regions need a different lookup
                const newTitle = regenerateTitleForReport(
                  report,
                  prisonsLookup[report.location].description || report.location,
                )
                await incidentReportingApi.updateReport(report.id, {
                  title: newTitle,
                })
              }

              if (transition.postCorrectionRequest) {
                const apiUserAction = userAction as ApiUserAction // transitions config ensures this is possible
                if (!comment) {
                  if (apiUserAction === 'MARK_DUPLICATE') {
                    comment = placeholderForCorrectionRequest(apiUserAction, originalReportReference)
                  }
                  if (apiUserAction === 'MARK_NOT_REPORTABLE') {
                    comment = placeholderForCorrectionRequest(apiUserAction)
                  }
                }
                await incidentReportingApi.correctionRequests.addToReport(report.id, {
                  userType: userType as ApiUserType, // HQ viewer can’t get here
                  userAction: apiUserAction,
                  descriptionOfChange: comment,
                  originalReportReference,
                })
              }

              const { newStatus } = transition
              if (newStatus && newStatus !== report.status) {
                await incidentReportingApi.changeReportStatus(report.id, { newStatus })
                // TODO: set report validation=true flag? not supported by api/db yet / ever will be?
              }

              logger.info(
                `Report ${report.reportReference} actioned: “${userActionMapping[userAction].description}” (${userAction}), and changed status from ${report.status} to ${newStatus}`,
              )
              const { successBanner } = transition
              if (successBanner) {
                req.flash('success', { title: successBanner.replace('$reportReference', report.reportReference) })
              }

              if (userAction === 'RECALL') {
                res.redirect(reportUrl)
              } else {
                res.redirect('/reports')
              }
              return
            } catch (e) {
              logger.error(e, `Report ${report.reportReference} status could not be changed: %j`, e)
              errors.push({
                text: 'Sorry, there was a problem with your request',
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
                'Select what you want to do with this report'
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
        questionProgressSteps,
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
        correctionRequestActionLabels,
        workListMapping,
        reportTransitions,
        formValues,
      })
    },
  )

  return router
}
