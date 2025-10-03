import { Router } from 'express'
import { MethodNotAllowed } from 'http-errors'

import logger from '../../../logger'
import { updateReportTitle } from '../../services/reportTitle'
import {
  aboutTheType,
  dwNotReviewed,
  prisonerInvolvementOutcomesDescriptions,
  prisonerInvolvementRolesDescriptions,
  staffInvolvementRolesDescriptions,
  statusesDescriptions,
  typesDescriptions,
  workListMapping,
} from '../../reportConfiguration/constants'
import { correctPecsReportStatus } from '../../middleware/correctPecsReportStatus'
import {
  type ApiUserAction,
  type ApiUserType,
  hasPermissionTo,
  logoutUnless,
  parseUserActionCode,
  type UserAction,
  userActionMapping,
} from '../../middleware/permissions'
import { populateReport } from '../../middleware/populateReport'
import { populateReportConfiguration } from '../../middleware/populateReportConfiguration'
import type {
  AddCorrectionRequestRequest,
  HistoricType,
  ReportBasic,
  ReportWithDetails,
} from '../../data/incidentReportingApi'
import { isPecsRegionCode } from '../../data/pecsRegions'
import { validateReport } from '../../data/reportValidity'
import type { GovukErrorSummaryItem } from '../../utils/govukFrontend'
import { correctionRequestActionLabels } from './actions/correctionRequestLabels'
import { placeholderForCorrectionRequest } from './actions/correctionRequestPlaceholder'
import { findRequestDuplicate } from './actions/findRequestDuplicate'
import { AgencyType } from '../../data/prisonApi'

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
    correctPecsReportStatus(),
    populateReportConfiguration(true),
    async (req, res) => {
      const { incidentReportingApi, prisonApi, userService } = res.locals.apis

      const report = res.locals.report as ReportWithDetails
      const isPecsReport = isPecsRegionCode(report.location)
      const { permissions, allowedActions, reportConfig, reportUrl, questionProgress } = res.locals
      const { userType } = permissions

      const usernames = [report.reportedBy]
      if (report.reportedBy !== report.modifiedBy) {
        usernames.push(report.modifiedBy)
      }
      if (report.incidentTypeHistory?.length) {
        usernames.push(...report.incidentTypeHistory.map(typeChange => typeChange.changedBy))
      }
      if (report.correctionRequests?.length) {
        usernames.push(...report.correctionRequests.map(correctionRequest => correctionRequest.correctionRequestedBy))
      }
      const [usersLookup, locationDescription] = await Promise.all([
        userService.getUsers(res.locals.systemToken, usernames),
        prisonApi
          .getAgency(report.location, false, isPecsReport ? AgencyType.PECS : AgencyType.INST, isPecsReport)
          .then(agency => agency?.description || report.location),
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

              const { newStatus } = transition
              let addCorrectionRequest: AddCorrectionRequestRequest
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
                addCorrectionRequest = {
                  userType: userType as ApiUserType, // HQ viewer can’t get here
                  userAction: apiUserAction,
                  descriptionOfChange: comment,
                }
                if (originalReportReference) {
                  addCorrectionRequest.originalReportReference = originalReportReference
                }
              }

              if (newStatus && newStatus !== report.status) {
                await incidentReportingApi.changeReportStatus(report.id, {
                  newStatus,
                  correctionRequest: addCorrectionRequest,
                })
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

      const incidentTypeHistory = cleanTypeHistory(report)

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
        incidentTypeHistory,
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

/**
 * Converts the report's type history to a format easier to present
 *
 * The `report.typeHistory` is updated every time the report type changes
 * but its format is a bit tricky to display as-is because each entry
 * is for the *previous* type, e.g.:
 * - Type A, changed at T2 by U2
 * - Type B, changed at T3 by U3
 * (doesn't include creation metadata nor final type)
 *
 * While the UI wants to display something like:
 *  - Created as Type A at T1 by U1
 *  - Updated to Type B as T2 by U2
 *  - Updated to Type C as T3 by U3
 *
 * This function returns an array of HistoricType that can be mostly be
 * displayed as-is. The result also adds an entry for when the report was
 * created.
 */
function cleanTypeHistory(report: ReportWithDetails): HistoricType[] {
  if (report.incidentTypeHistory.length === 0) {
    return []
  }

  const cleaned: HistoricType[] = []

  // Add an entry for Report creation
  cleaned.push({
    type: report.incidentTypeHistory[0].type,
    changedAt: report.reportedAt,
    changedBy: report.reportedBy,
  })

  for (const [index, typeChange] of report.incidentTypeHistory.entries()) {
    // Last entry corresponds to last update (to current type)
    if (index === report.incidentTypeHistory.length - 1) {
      cleaned.push({
        type: report.type, // current type
        changedAt: typeChange.changedAt,
        changedBy: typeChange.changedBy,
      })
    } else {
      // Use type from next entry
      cleaned.push({
        type: report.incidentTypeHistory[index + 1].type,
        changedAt: typeChange.changedAt,
        changedBy: typeChange.changedBy,
      })
    }
  }

  return cleaned
}
