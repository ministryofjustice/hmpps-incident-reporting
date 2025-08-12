import { mockReport } from '../../../server/data/testData/incidentReporting'
import { now } from '../../../server/testutils/fakeClock'
import Page from '../../pages/page'
import { HomePage } from '../../pages/home'
import { TypePage } from '../../pages/reports/type'
import { DetailsPage } from '../../pages/reports/details'
import { PrisonerInvolvementsPage } from '../../pages/reports/involvements/prisoners'

context('Creating a new minimal draft report', () => {
  const reportWithDetails = mockReport({
    type: 'MISCELLANEOUS_1',
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
    detailsPage.enterDate('05/12/2023')
    detailsPage.enterTime('11', '34')
    detailsPage.enterDescription(reportWithDetails.description)

    // stub report creation
    cy.task('stubIncidentReportingApiCreateReport', {
      request: {
        type: reportWithDetails.type,
        incidentDateAndTime: reportWithDetails.incidentDateAndTime,
        location: 'MDI',
        title: 'Miscellaneous (Moorland (HMP & YOI))',
        description: reportWithDetails.description,
      },
      report: reportWithDetails,
    })
    // stub lookups from next page, adding a prisoner
    cy.task('stubIncidentReportingApiGetReportWithDetailsById', { report: reportWithDetails })

    detailsPage.submit()
    Page.verifyOnPage(PrisonerInvolvementsPage, false)
  })

  it('should allow confirming entry of a date that’s over a year in the past', () => {
    const typePage = Page.verifyOnPage(TypePage)
    typePage.checkBackLink('/')
    typePage.selectType(reportWithDetails.type)
    typePage.submit()

    const detailsPage = Page.verifyOnPage(DetailsPage)
    detailsPage.checkBackLink('/create-report')
    detailsPage.enterDate('5/10/2022')
    detailsPage.enterTime('10', '30')
    detailsPage.enterDescription(reportWithDetails.description)

    detailsPage.dialogue.should('not.be.visible')
    detailsPage.submit()
    Page.verifyOnPage(DetailsPage)
    detailsPage.dialogue.should('be.visible')

    // stub report creation
    cy.task('stubIncidentReportingApiCreateReport', {
      request: {
        type: reportWithDetails.type,
        incidentDateAndTime: '2022-10-05T10:30:00',
        location: 'MDI',
        title: 'Miscellaneous (Moorland (HMP & YOI))',
        description: reportWithDetails.description,
      },
      report: reportWithDetails,
    })
    // stub lookups from next page, adding a prisoner
    cy.task('stubIncidentReportingApiGetReportWithDetailsById', { report: reportWithDetails })

    detailsPage.dialogueYesButton.click()
    Page.verifyOnPage(PrisonerInvolvementsPage, false)
  })

  it('should allow re-entry of a date that’s over a year in the past after warning', () => {
    const typePage = Page.verifyOnPage(TypePage)
    typePage.checkBackLink('/')
    typePage.selectType(reportWithDetails.type)
    typePage.submit()

    const detailsPage = Page.verifyOnPage(DetailsPage)
    detailsPage.checkBackLink('/create-report')
    detailsPage.enterDate('5/10/2022')
    detailsPage.enterTime('10', '30')
    detailsPage.enterDescription(reportWithDetails.description)

    detailsPage.dialogue.should('not.be.visible')
    detailsPage.submit()
    Page.verifyOnPage(DetailsPage)
    detailsPage.dialogue.should('be.visible')
    detailsPage.dialogueNoButton.click()
    detailsPage.dialogue.should('not.be.visible')
    Page.verifyOnPage(DetailsPage)
  })

  it('should show errors if information is missing', () => {
    const typePage = Page.verifyOnPage(TypePage)
    typePage.submit()
    typePage.errorSummary.contains('There is a problem')
    typePage.errorSummary.contains('Select the incident type')
    typePage.selectType(reportWithDetails.type)
    typePage.submit()

    const detailsPage = Page.verifyOnPage(DetailsPage)
    detailsPage.enterDescription(reportWithDetails.description)
    detailsPage.submit()
    detailsPage.errorSummary.contains('There is a problem')
    detailsPage.errorSummary.contains('Enter the date of the incident')
    detailsPage.errorSummary.contains('Enter the time of the incident using the 24 hour clock ')
    Page.verifyOnPage(DetailsPage)
  })
})
