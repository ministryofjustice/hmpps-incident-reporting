import { mockReport } from '../../server/data/testData/incidentReporting'
import { andrew, barry } from '../../server/data/testData/offenderSearch'
import Page from '../pages/page'
import TypePage from '../pages/createReport/type'
import DetailsPage from '../pages/createReport/details'

context('Creating a new report', () => {
  beforeEach(() => {
    cy.resetBasicStubs()
  })

  it('should allow entering the basic information', () => {
    const now = new Date()
    const reportWithDetails = mockReport({
      type: 'DAMAGE',
      reportReference: '6544',
      reportDateAndTime: now,
      withDetails: true,
    })

    cy.signIn()
    // TODO: start on home page and navigate to:
    cy.visit('/create-report')

    const typePage = Page.verifyOnPage(TypePage)
    typePage.checkBackLink('/')
    typePage.selectType(reportWithDetails.type)
    typePage.submit()

    cy.task('stubIncidentReportingApiCreateReport', {
      request: {
        type: reportWithDetails.type,
        incidentDateAndTime: reportWithDetails.incidentDateAndTime,
        prisonId: 'MDI',
        title: 'Report: damage',
        description: reportWithDetails.description,
        createNewEvent: true,
      },
      report: reportWithDetails,
    })
    cy.task('stubIncidentReportingApiGetReportWithDetailsById', { report: reportWithDetails })
    cy.task('stubOffenderSearchByNumber', [andrew, barry])
    cy.task('stubPrisonApiMockPrisons')
    cy.task('stubManageKnownUsers')

    const detailsPage = Page.verifyOnPage(DetailsPage)
    typePage.checkBackLink('/create-report')
    detailsPage.enterDate(new Date(reportWithDetails.incidentDateAndTime))
    const time = /(?<hours>\d\d):(?<minutes>\d\d)/.exec(reportWithDetails.incidentDateAndTime)
    detailsPage.enterTime(time.groups.hours, time.groups.minutes)
    detailsPage.enterDescription(reportWithDetails.description)
    detailsPage.submit()
  })
})
