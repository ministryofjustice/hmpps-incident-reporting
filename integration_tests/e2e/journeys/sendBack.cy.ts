import { RelatedObjectUrlSlug } from '../../../server/data/incidentReportingApi'
import { mockReport } from '../../../server/data/testData/incidentReporting'
import { moorland } from '../../../server/data/testData/prisonApi'
import { mockDataWarden } from '../../../server/data/testData/users'
import { now } from '../../../server/testutils/fakeClock'
import Page from '../../pages/page'
import { DashboardPage } from '../../pages/dashboard'
import { ReportPage } from '../../pages/reports/report'

context('Send a report back for correction', () => {
  beforeEach(() => {
    cy.clock(now)
  })

  const scenarios = [
    { currentStatus: 'AWAITING_REVIEW', newStatus: 'NEEDS_UPDATING' },
    { currentStatus: 'UPDATED', newStatus: 'NEEDS_UPDATING' },
    { currentStatus: 'ON_HOLD', newStatus: 'NEEDS_UPDATING' },
    { currentStatus: 'WAS_CLOSED', newStatus: 'REOPENED' },
  ] as const
  scenarios.forEach(({ currentStatus, newStatus }) => {
    context(`a data warden viewing a report with status ${currentStatus}`, () => {
      const reportWithDetails = mockReport({
        type: 'DISORDER_2',
        status: currentStatus,
        reportReference: '6544',
        reportDateAndTime: now,
        withDetails: true,
      })

      it(`should be able to send it back to ${newStatus}`, () => {
        cy.resetBasicStubs({ user: mockDataWarden })
        cy.task('stubPrisonApiMockPrison', moorland)
        cy.task('stubManageKnownUsers')
        cy.signIn()

        cy.task('stubIncidentReportingApiGetReportWithDetailsById', { report: reportWithDetails })
        cy.visit(`/reports/${reportWithDetails.id}`)

        const reportPage = Page.verifyOnPage(ReportPage, reportWithDetails.reportReference)
        reportPage.selectAction('Send back')
        reportPage.enterComment('REQUEST_CORRECTION', 'Add prisoner number to description')

        cy.task('stubIncidentReportingApiCreateRelatedObject', {
          urlSlug: RelatedObjectUrlSlug.correctionRequests,
          reportId: reportWithDetails.id,
          request: {
            userType: 'DATA_WARDEN',
            userAction: 'REQUEST_CORRECTION',
            descriptionOfChange: 'Add prisoner number to description',
          },
          response: reportWithDetails.correctionRequests, // technically, missing new comment
        })
        cy.task('stubIncidentReportingApiChangeReportStatus', {
          request: { newStatus },
          report: {
            ...reportWithDetails,
            status: newStatus,
          },
        })
        cy.task('stubIncidentReportingApiGetReports')

        reportPage.continueButton.click()

        const dashboardPage = Page.verifyOnPage(DashboardPage)
        dashboardPage.checkNotificationBannerContent('Incident report 6544 has been sent back')
      })
    })
  })
})
