import { Router } from 'express'
import { MethodNotAllowed } from 'http-errors'

import logger from '../../../logger'
import { updateReportTitle } from '../../services/reportTitle'
import {
  aboutTheType,
  prisonerInvolvementOutcomesDescriptions,
  prisonerInvolvementRolesDescriptions,
  staffInvolvementRolesDescriptions,
  statusesDescriptions,
  typesDescriptions,
  dwNotReviewed,
  workListMapping,
} from '../../reportConfiguration/constants'
import {
  logoutUnless,
  hasPermissionTo,
  parseUserActionCode,
  userActionMapping,
  type ApiUserType,
  type ApiUserAction,
  type UserAction,
} from '../../middleware/permissions'
import { populateReport } from '../../middleware/populateReport'
import { populateReportConfiguration } from '../../middleware/populateReportConfiguration'
import type { AddCorrectionRequestRequest, ReportBasic, ReportWithDetails } from '../../data/incidentReportingApi'
import { isPecsRegionCode } from '../../data/pecsRegions'
import { validateReport } from '../../data/reportValidity'
import type { GovukErrorSummaryItem } from '../../utils/govukFrontend'
import { correctionRequestActionLabels } from './actions/correctionRequestLabels'
import { placeholderForCorrectionRequest } from './actions/correctionRequestPlaceholder'
import { findRequestDuplicate } from './actions/findRequestDuplicate'

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
      const isPecsReport = isPecsRegionCode(report.location)
      const { permissions, allowedActions, reportConfig, reportUrl, questionProgress } = res.locals
      const { userType } = permissions

      const usernames = [report.reportedBy]
      if (report.correctionRequests?.length) {
        usernames.push(...report.correctionRequests.map(correctionRequest => correctionRequest.correctionRequestedBy))
      }
      const [usersLookup, locationDescription] = await Promise.all([
        userService.getUsers(res.locals.systemToken, usernames),
        prisonApi.getPrison(report.location, false).then(agency => agency?.description || report.location),
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

      const reportTransitions = res.locals.possibleTransitions

      let requestedOriginalReportReference: string | undefined
      if (allowedActions.has('MARK_DUPLICATE')) {
        requestedOriginalReportReference = findRequestDuplicate(report)?.originalReportReference
      }

      let formValues: object = {}
      const errors: GovukErrorSummaryItem[] = []
      if (req.method === 'POST') {
        const { userAction } = req.body ?? {}
        if (parseUserActionCode(userAction) && userAction in reportTransitions) {
          const transition = reportTransitions[userAction]

          if (
            userAction === 'RECALL' &&
            userType === 'REPORTING_OFFICER' &&
            workListMapping.completed.includes(report.status)
          ) {
            res.redirect(`${reportUrl}/reopen`)
            return
          }
          if (userAction === 'REQUEST_REMOVAL') {
            res.redirect(`${reportUrl}/request-remove`)
            return
          }

          // check DPS report is valid if required; reports made in NOMIS do not get validated
          if (!report.createdInNomis && transition.mustBeValid) {
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
          let originalReport: ReportBasic | undefined
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
                originalReport = await incidentReportingApi.getReportByReference(originalReportReference)
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
              // force-regenerate title on most important author-initiated transitions
              if (
                // TODO: update for requesting duplicate/not-reportable?
                userAction === 'REQUEST_REVIEW' ||
                (isPecsReport && userAction === 'CLOSE')
              ) {
                await updateReportTitle(res)
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
                const addCorrectionRequest: AddCorrectionRequestRequest = {
                  userType: userType as ApiUserType, // HQ viewer can’t get here
                  userAction: apiUserAction,
                  descriptionOfChange: comment,
                }
                if (originalReportReference) {
                  addCorrectionRequest.originalReportReference = originalReportReference
                }
                await incidentReportingApi.correctionRequests.addToReport(report.id, addCorrectionRequest)
              }

              const { newStatus } = transition
              if (newStatus && newStatus !== report.status) {
                await incidentReportingApi.changeReportStatus(report.id, { newStatus })
              }

              if (userAction === 'MARK_DUPLICATE' && originalReport) {
                // link report to the original of which this is a duplicate
                await incidentReportingApi.updateReport(report.id, {
                  duplicatedReportId: originalReport.id,
                })
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
      } else if (
        !report.createdInNomis &&
        !isPecsReport &&
        allowedActionsNeedingForm.has('CLOSE') &&
        reportTransitions.CLOSE?.mustBeValid
      ) {
        // check DPS prison report is valid and hide “Close” option otherwise (reports made in NOMIS do not get validated)
        // unfortunately, data wardens are provided no feedback as to why they cannot close the report; the option simply is absent
        const errorGenerator = validateReport(report, reportConfig, questionProgressSteps, reportUrl)
        if (errorGenerator.next().value) {
          allowedActionsNeedingForm.delete('CLOSE')
        }
      }

      // Gather notification banner entries if they exist
      const banners = req.flash()

      // “About the [incident]”
      res.locals.aboutTheType = aboutTheType(res.locals.report.type)
      const descriptionAppendOnly = !dwNotReviewed.includes(report.status)

      res.render('pages/reports/view/index', {
        errors,
        banners,
        questionProgressSteps,
        allowedActionsNeedingForm,
        canEditReport,
        canEditReportInNomisOnly,
        descriptionAppendOnly,
        usersLookup,
        prisonerInvolvementOutcomesDescriptions,
        prisonerInvolvementRolesDescriptions,
        staffInvolvementRolesDescriptions,
        statusesDescriptions,
        typesDescriptions,
        correctionRequestActionLabels,
        workListMapping,
        locationDescription,
        reportTransitions,
        formValues,
        requestedOriginalReportReference,
      })
    },
  )

  return router
}
