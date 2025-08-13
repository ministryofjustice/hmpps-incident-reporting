import { RelatedObjectUrlSlug, type ReportWithDetails } from '../../../server/data/incidentReportingApi'
import { mockReport } from '../../../server/data/testData/incidentReporting'
import { moorland } from '../../../server/data/testData/prisonApi'
import { mockDataWarden } from '../../../server/data/testData/users'
import type { UserAction } from '../../../server/middleware/permissions'
import type { Status } from '../../../server/reportConfiguration/constants'
import { now } from '../../../server/testutils/fakeClock'
import Page from '../../pages/page'
import { DashboardPage } from '../../pages/dashboard'
import { ReportPage } from '../../pages/reports/report'

describe('Actioning submitted reports', () => {
  beforeEach(() => {
    cy.clock(now)
  })

  const scenarios = [
    { currentStatus: 'AWAITING_REVIEW', sentBackTo: 'NEEDS_UPDATING' },
    { currentStatus: 'UPDATED', sentBackTo: 'NEEDS_UPDATING' },
    { currentStatus: 'ON_HOLD', sentBackTo: 'NEEDS_UPDATING' },
    { currentStatus: 'WAS_CLOSED', sentBackTo: 'REOPENED' },
  ] as const
  scenarios.forEach(({ currentStatus, sentBackTo }) => {
    context(`a data warden viewing a report with status ${currentStatus}`, () => {
      const reportWithDetails = mockReport({
        type: 'DISORDER_2',
        status: currentStatus,
        reportReference: '6544',
        reportDateAndTime: now,
        withDetails: true,
      })

      beforeEach(() => {
        cy.resetBasicStubs({ user: mockDataWarden })
        cy.task('stubPrisonApiMockPrison', moorland)
        cy.task('stubManageKnownUsers')
        cy.signIn()

        cy.task('stubIncidentReportingApiGetReportWithDetailsById', { report: reportWithDetails })
        cy.visit(`/reports/${reportWithDetails.id}`)
      })

      it(`should be able to send it back to ${sentBackTo}`, () => {
        actionTestCase(
          reportWithDetails,
          'Send back',
          'REQUEST_CORRECTION',
          sentBackTo,
          'Add prisoner number to description',
          'Incident report 6544 has been sent back',
        )
      })

      if (['AWAITING_REVIEW', 'UPDATED'].includes(currentStatus)) {
        it('should be able to put it on hold', () => {
          actionTestCase(
            reportWithDetails,
            'Put on hold',
            'HOLD',
            'ON_HOLD',
            'Checking policy…',
            'Incident report 6544 has been put on hold',
          )
        })
      }
    })
  })
})

function actionTestCase(
  report: DatesAsStrings<ReportWithDetails>,
  actionLabel: string,
  userAction: UserAction,
  newStatus: Status,
  comment: string,
  banner: string,
) {
  const reportPage = Page.verifyOnPage(ReportPage, report.reportReference)
  reportPage.selectAction(actionLabel)
  reportPage.enterComment(userAction, comment)

  cy.task('stubIncidentReportingApiCreateRelatedObject', {
    urlSlug: RelatedObjectUrlSlug.correctionRequests,
    reportId: report.id,
    request: {
      userType: 'DATA_WARDEN',
      userAction,
      descriptionOfChange: comment,
    },
    response: report.correctionRequests, // technically, missing new comment
  })
  cy.task('stubIncidentReportingApiChangeReportStatus', {
    request: { newStatus },
    report: {
      ...report,
      status: newStatus,
    },
  })
  cy.task('stubIncidentReportingApiGetReports')

  reportPage.continueButton.click()

  const dashboardPage = Page.verifyOnPage(DashboardPage)
  dashboardPage.checkNotificationBannerContent(banner)
}
