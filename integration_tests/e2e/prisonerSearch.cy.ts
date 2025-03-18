import { mockReport } from '../../server/data/testData/incidentReporting'
import { andrew, barry } from '../../server/data/testData/offenderSearch'
import Page from '../pages/page'
import PrisonerSearchPage from '../pages/reports/prisoners/search'

context('Prisoner search page', () => {
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

  let prisonerSearchPage: PrisonerSearchPage

  beforeEach(() => {
    cy.resetBasicStubs()

    cy.signIn()
  })

  context('before search terms entered', () => {
    beforeEach(() => {
      cy.task('stubIncidentReportingApiGetReportWithDetailsById', { report: reportWithDetails })

      cy.visit(`/reports/${reportWithDetails.id}/prisoners/search`)
      prisonerSearchPage = Page.verifyOnPage(PrisonerSearchPage)
    })

    it('should have back link point to involvements page', () => {
      prisonerSearchPage.checkBackLink(`/reports/${reportWithDetails.id}/prisoners`)
    })

    it('should show no results table', () => {
      prisonerSearchPage.showsNoTable()
    })
  })

  context('when nobody was found', () => {
    beforeEach(() => {
      cy.task('stubIncidentReportingApiGetReportWithDetailsById', { report: reportWithDetails })
      cy.task('stubOffenderSearchInPrison', { prisonId: 'MDI', term: 'ar', results: [] })

      cy.visit(`/reports/${reportWithDetails.id}/prisoners/search?page=1&global=no&q=ar`)
      prisonerSearchPage = Page.verifyOnPage(PrisonerSearchPage)
    })

    it('should have back link point to involvements page', () => {
      prisonerSearchPage.checkBackLink(`/reports/${reportWithDetails.id}/prisoners`)
    })

    it('should show no results table', () => {
      prisonerSearchPage.showsNoTable()
    })
  })

  context('when results were returned', () => {
    beforeEach(() => {
      cy.task('stubIncidentReportingApiGetReportWithDetailsById', { report: reportWithDetails })
      cy.task('stubOffenderSearchInPrison', { prisonId: 'MDI', term: 'AR', results: [andrew, barry] })

      cy.visit(`/reports/${reportWithDetails.id}/prisoners/search?page=1&global=no&q=AR`)
      prisonerSearchPage = Page.verifyOnPage(PrisonerSearchPage)
    })

    it('should have back link point to involvements page', () => {
      prisonerSearchPage.checkBackLink(`/reports/${reportWithDetails.id}/prisoners`)
    })

    it('should show results table', () => {
      prisonerSearchPage.tableContents.then(tableContents => {
        expect(tableContents).to.have.lengthOf(2)

        expect(tableContents[0]).to.contain({
          name: 'Andrew Arnold',
          prisonerNumber: 'A1111AA',
          establishment: 'Moorland (HMP & YOI)',
        })
        expect(tableContents[0].photo).to.have.attr('src', '/prisoner/A1111AA/photo.jpeg')
        expect(tableContents[0].actionLink).to.contain('Select Andrew Arnold')
        expect(tableContents[0].actionLink).to.have.attr(
          'href',
          `/reports/${reportWithDetails.id}/prisoners/add/A1111AA`,
        )

        expect(tableContents[1]).to.contain({
          name: 'Barry Benjamin',
          prisonerNumber: 'A2222BB',
          establishment: 'Moorland (HMP & YOI)',
        })
        expect(tableContents[1].photo).to.have.attr('src', '/prisoner/A2222BB/photo.jpeg')
        expect(tableContents[1].actionLink).to.contain('Select Barry Benjamin')
        expect(tableContents[1].actionLink).to.have.attr(
          'href',
          `/reports/${reportWithDetails.id}/prisoners/add/A2222BB`,
        )
      })
    })
  })
})
