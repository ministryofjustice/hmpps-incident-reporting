import format from '../../server/utils/format'
import { mockReport } from '../../server/data/testData/incidentReporting'
import HomePage from '../pages/home'
import Page from '../pages/page'
import { TypePage } from '../pages/reports/type'
import DetailsPage from '../pages/reports/details'
import { PrisonerInvolvementsPage } from '../pages/reports/involvements/prisoners'

context('Creating a new minimal draft report', () => {
  const now = new Date()
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

  const longAgo = new Date()
  longAgo.setFullYear(longAgo.getFullYear() - 1)
  longAgo.setDate(longAgo.getDate() - 1)
  longAgo.setSeconds(0)
  longAgo.setMilliseconds(0)

  it('should allow confirming entry of a date that’s over a year in the past', () => {
    const typePage = Page.verifyOnPage(TypePage)
    typePage.checkBackLink('/')
    typePage.selectType(reportWithDetails.type)
    typePage.submit()

    const detailsPage = Page.verifyOnPage(DetailsPage)
    detailsPage.checkBackLink('/create-report')
    detailsPage.enterDate(longAgo)
    detailsPage.enterTime(longAgo.getHours().toString(), longAgo.getMinutes().toString())
    detailsPage.enterDescription(reportWithDetails.description)

    detailsPage.dialogue.should('not.be.visible')
    detailsPage.submit()
    Page.verifyOnPage(DetailsPage)
    detailsPage.dialogue.should('be.visible')

    // stub report creation
    cy.task('stubIncidentReportingApiCreateReport', {
      request: {
        type: reportWithDetails.type,
        incidentDateAndTime: format.isoDateTime(longAgo),
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
    detailsPage.enterDate(longAgo)
    detailsPage.enterTime(longAgo.getHours().toString(), longAgo.getMinutes().toString())
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
