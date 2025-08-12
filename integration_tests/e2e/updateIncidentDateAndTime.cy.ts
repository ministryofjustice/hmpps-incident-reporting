import { mockReport } from '../../server/data/testData/incidentReporting'
import { moorland } from '../../server/data/testData/prisonApi'
import { now } from '../../server/testutils/fakeClock'
import Page from '../pages/page'
import { IncidentDateTimePage } from '../pages/reports/incidentDateTime'
import { ReportPage } from '../pages/reports/report'

context('Update an existing report’s date after it’s been reviewed', () => {
  const reportWithDetails = mockReport({
    type: 'DISORDER_2',
    status: 'NEEDS_UPDATING',
    reportReference: '6544',
    reportDateAndTime: now,
    withDetails: true,
    withAddendums: true,
  })
  reportWithDetails.prisonersInvolved = []
  reportWithDetails.prisonerInvolvementDone = true
  reportWithDetails.staffInvolved = []
  reportWithDetails.staffInvolvementDone = true
  reportWithDetails.questions = []
  reportWithDetails.correctionRequests = []

  beforeEach(() => {
    cy.clock(now)
    cy.resetBasicStubs()

    cy.signIn()
    cy.task('stubIncidentReportingApiGetReportById', { report: reportWithDetails })
    cy.visit(`/reports/${reportWithDetails.id}/update-date-and-time`)
  })

  it('should allow entering the basic information', () => {
    const incidentDateTimePage = Page.verifyOnPage(IncidentDateTimePage)

    incidentDateTimePage.checkBackLink(`/reports/${reportWithDetails.id}`)
    incidentDateTimePage.checkCancelLink(`/reports/${reportWithDetails.id}`)

    incidentDateTimePage.enterDate('5/12/2023')
    incidentDateTimePage.enterTime('11', '34')

    // stub report details update
    cy.task('stubIncidentReportingApiUpdateReport', {
      request: {
        incidentDateAndTime: reportWithDetails.incidentDateAndTime,
      },
      report: reportWithDetails,
    })
    // stub lookups from next page, the report view
    cy.task('stubIncidentReportingApiGetReportWithDetailsById', { report: reportWithDetails })
    cy.task('stubPrisonApiMockPrison', moorland)
    cy.task('stubManageKnownUsers')

    incidentDateTimePage.submit()

    Page.verifyOnPage(ReportPage, reportWithDetails.reportReference, true)
  })

  it('should show errors if information is missing', () => {
    const incidentDateTimePage = Page.verifyOnPage(IncidentDateTimePage)
    incidentDateTimePage.enterTime('10', ' ')
    incidentDateTimePage.submit()
    incidentDateTimePage.errorSummary.contains('There is a problem')
    incidentDateTimePage.errorSummary.contains('Enter the time of the incident using the 24 hour clock')
    Page.verifyOnPage(IncidentDateTimePage)
  })
})
