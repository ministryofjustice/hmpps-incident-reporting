import { mockReport } from '../../server/data/testData/incidentReporting'
import HomePage from '../pages/home'
import Page from '../pages/page'
import { TypePage } from '../pages/reports/type'
import DetailsPage from '../pages/reports/details'
import { PrisonerInvolvementsPage } from '../pages/reports/involvements/prisoners'

context('Creating a new minimal draft report', () => {
  const now = new Date()
  const reportWithDetails = mockReport({
    type: 'MISCELLANEOUS',
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
    const indexPage = Page.verifyOnPage(HomePage)
    indexPage.clickCreateReportCard()
  })

  it('should allow entering the basic information', () => {
    const typePage = Page.verifyOnPage(TypePage)
    typePage.checkBackLink('/')
    typePage.selectType(reportWithDetails.type)
    typePage.submit()

    const detailsPage = Page.verifyOnPage(DetailsPage)
    detailsPage.checkBackLink('/create-report')
    detailsPage.enterDate(new Date(reportWithDetails.incidentDateAndTime))
    const time = /(?<hours>\d\d):(?<minutes>\d\d)/.exec(reportWithDetails.incidentDateAndTime)
    detailsPage.enterTime(time.groups.hours, time.groups.minutes)
    detailsPage.enterDescription(reportWithDetails.description)

    // stub report creation
    cy.task('stubIncidentReportingApiCreateReport', {
      request: {
        type: reportWithDetails.type,
        incidentDateAndTime: reportWithDetails.incidentDateAndTime,
        location: 'MDI',
        title: reportWithDetails.title,
        description: reportWithDetails.description,
        createNewEvent: true,
      },
      report: reportWithDetails,
    })
    // stub lookups from next page, adding a prisoner
    cy.task('stubIncidentReportingApiGetReportWithDetailsById', { report: reportWithDetails })

    detailsPage.submit()
    Page.verifyOnPage(PrisonerInvolvementsPage, false)
  })

  it('should show errors if information is missing', () => {
    const typePage = Page.verifyOnPage(TypePage)
    typePage.submit()
    typePage.errorSummary.contains('There is a problem')
    typePage.selectType(reportWithDetails.type)
    typePage.submit()

    const detailsPage = Page.verifyOnPage(DetailsPage)
    detailsPage.enterDescription(reportWithDetails.description)
    detailsPage.submit()
    detailsPage.errorSummary.contains('There is a problem')
    Page.verifyOnPage(DetailsPage)
  })
})
