import { type AddCorrectionRequestRequest, type ReportWithDetails } from '../../../server/data/incidentReportingApi'
import type { ApiUserAction, UserAction } from '../../../server/middleware/permissions'
import type { Status } from '../../../server/reportConfiguration/constants'
import Page from '../../pages/page'
import { ReportPage } from '../../pages/reports/report'
import { DashboardPage } from '../../pages/dashboard'

export function actionTestCase({
  reportWithDetails,
  reportInToDoWorkList = false,
  actionLabel,
  userAction,
  newStatus,
  comment,
  commentSentToApi,
  originalReportReference,
  originalReportReferenceSentToApi,
  banner,
}: {
  reportWithDetails: DatesAsStrings<ReportWithDetails>
  reportInToDoWorkList?: boolean
  actionLabel: string
  userAction: ApiUserAction & UserAction
  newStatus: Status
  /** Comment entered by user */
  comment?: string
  /** Comment sent to api if different from that entered by user */
  commentSentToApi?: string
  /** Reference entered by user */
  originalReportReference?: string
  /** Reference sent to api if different from that entered by user */
  originalReportReferenceSentToApi?: string
  banner: string
}) {
  const reportPage = Page.verifyOnPage(ReportPage, reportWithDetails.reportReference, reportInToDoWorkList)
  reportPage.selectAction(actionLabel)
  if (originalReportReference) {
    reportPage.enterOriginalReportReference(originalReportReference)
  }
  if (comment) {
    reportPage.enterComment(userAction, comment)
  }

  if (reportInToDoWorkList) {
    cy.task('stubIncidentReportingApiUpdateReport', {
      request: { title: reportWithDetails.title },
      report: reportWithDetails,
    })
  }
  const correctionRequestPayload: AddCorrectionRequestRequest = {
    userType: 'DATA_WARDEN',
    userAction,
    descriptionOfChange: commentSentToApi ?? comment,
  }
  if (originalReportReferenceSentToApi ?? originalReportReference) {
    correctionRequestPayload.originalReportReference = originalReportReferenceSentToApi ?? originalReportReference
  }
  cy.task('stubIncidentReportingApiChangeReportStatus', {
    request: {
      newStatus,
      correctionRequest: correctionRequestPayload,
    },
    report: {
      ...reportWithDetails,
      status: newStatus,
    },
  })

  cy.task('stubIncidentReportingApiGetReports') // for empty dashboard page

  reportPage.continueButton.click()

  const dashboardPage = Page.verifyOnPage(DashboardPage)
  dashboardPage.checkNotificationBannerContent(banner)
}
