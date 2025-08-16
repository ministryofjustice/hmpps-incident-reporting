import { mockReport } from '../../server/data/testData/incidentReporting'
import { moorland } from '../../server/data/testData/prisonApi'
import { now } from '../../server/testutils/fakeClock'
import Page from '../pages/page'
import { DetailsPage } from '../pages/reports/details'
import { ReportPage } from '../pages/reports/report'

context('Update an existing report’s details', () => {
  const reportWithDetails = mockReport({
    type: 'DISORDER_2',
    reportReference: '6544',
    reportDateAndTime: now,
    withDetails: true,
  })
  reportWithDetails.prisonersInvolved = []
  reportWithDetails.prisonerInvolvementDone = false
  reportWithDetails.staffInvolved = []
  reportWithDetails.staffInvolvementDone = false
  reportWithDetails.questions = []
  reportWithDetails.correctionRequests = []

  beforeEach(() => {
    cy.clock(now)
    cy.resetBasicStubs()

    cy.signIn()
    cy.task('stubIncidentReportingApiGetReportById', { report: reportWithDetails })
    cy.visit(`/reports/${reportWithDetails.id}/update-details`)
  })

  it('should allow entering the basic information', () => {
    const detailsPage = Page.verifyOnPage(DetailsPage)
    detailsPage.checkBackLink(`/reports/${reportWithDetails.id}`)

    detailsPage.enterDate('5/12/2023')
    detailsPage.enterTime('11', '34')
    detailsPage.enterDescription(reportWithDetails.description)

    // stub report details update
    cy.task('stubIncidentReportingApiUpdateReport', {
      request: {
        incidentDateAndTime: reportWithDetails.incidentDateAndTime,
        description: reportWithDetails.description,
      },
      report: reportWithDetails,
    })
    // stub lookups from next page, the report view
    cy.task('stubIncidentReportingApiGetReportWithDetailsById', { report: reportWithDetails })
    cy.task('stubPrisonApiMockPrison', moorland)
    cy.task('stubManageKnownUsers')

    detailsPage.submit()

    Page.verifyOnPage(ReportPage, reportWithDetails.reportReference, true)
  })

  it('should show errors if information is missing', () => {
    const detailsPage = Page.verifyOnPage(DetailsPage)
    detailsPage.enterDescription(' ')
    detailsPage.submit()
    detailsPage.errorSummary.should('contain.text', 'There is a problem')
    detailsPage.errorSummary.should('contain.text', 'Enter a description of the incident')
    Page.verifyOnPage(DetailsPage)
  })
})
