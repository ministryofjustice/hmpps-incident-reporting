import { mockReport } from '../../server/data/testData/incidentReporting'
import { andrew, barry } from '../../server/data/testData/offenderSearch'
import Page from '../pages/page'
import DetailsPage from '../pages/reports/details'
import ReportPage from '../pages/reports/report'

context('Update an existing report’s details', () => {
  const now = new Date()
  const reportWithDetails = mockReport({
    type: 'DISORDER',
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
    cy.resetBasicStubs()

    cy.signIn()
    cy.task('stubIncidentReportingApiGetReportById', { report: reportWithDetails })
    cy.visit(`/reports/${reportWithDetails.id}/update-details`)
  })

  it('should allow entering the basic information', () => {
    const detailsPage = Page.verifyOnPage(DetailsPage)
    detailsPage.checkBackLink(`/reports/${reportWithDetails.id}`)
    detailsPage.enterDate(new Date(reportWithDetails.incidentDateAndTime))
    const time = /(?<hours>\d\d):(?<minutes>\d\d)/.exec(reportWithDetails.incidentDateAndTime)
    detailsPage.enterTime(time.groups.hours, time.groups.minutes)
    detailsPage.enterDescription(reportWithDetails.description)

    // stub report details update
    cy.task('stubIncidentReportingApiUpdateReport', {
      request: {
        incidentDateAndTime: reportWithDetails.incidentDateAndTime,
        description: reportWithDetails.description,
        updateEvent: true,
      },
      report: reportWithDetails,
    })
    // stub lookups from next page, the report view
    cy.task('stubIncidentReportingApiGetReportWithDetailsById', { report: reportWithDetails })
    cy.task('stubOffenderSearchByNumber', [andrew, barry])
    cy.task('stubPrisonApiMockPrisons')
    cy.task('stubManageKnownUsers')

    detailsPage.submit()

    Page.verifyOnPage(ReportPage, reportWithDetails.reportReference, true)
  })

  it('should show errors if information is missing', () => {
    const detailsPage = Page.verifyOnPage(DetailsPage)
    detailsPage.enterDescription(' ')
    detailsPage.submit()
    detailsPage.errorSummary.contains('There is a problem')
    Page.verifyOnPage(DetailsPage)
  })
})
