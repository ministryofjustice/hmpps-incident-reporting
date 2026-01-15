import { mockReport } from '../../../../server/data/testData/incidentReporting'
import { andrew, barry } from '../../../../server/data/testData/offenderSearch'
import { now } from '../../../../server/testutils/fakeClock'
import Page from '../../../pages/page'
import { PrisonerSearchPage } from '../../../pages/reports/involvements/prisoners'

context('Prisoner search page', () => {
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

  let prisonerSearchPage: PrisonerSearchPage

  beforeEach(() => {
    cy.resetBasicStubs()

    cy.signIn()

    cy.task('stubIncidentReportingApiGetReportWithDetailsById', { report: reportWithDetails })
  })

  context('before search terms entered', () => {
    beforeEach(() => {
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

  context('when searching locally', () => {
    context('and nobody was found', () => {
      beforeEach(() => {
        cy.task('stubOffenderSearchGlobally', { prisonIds: ['MDI'], andWords: 'ar', results: [] })

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

    context('and results were returned', () => {
      beforeEach(() => {
        cy.task('stubOffenderSearchGlobally', {
          prisonIds: ['MDI'],
          andWords: 'AR',
          location: 'ALL',
          gender: 'ALL',
          dateOfBirth: null,
          results: [andrew, barry],
        })
        cy.task('stubPrisonApiMockPrisonerPhoto', andrew.prisonerNumber)
        cy.task('stubPrisonApiMockPrisonerPhoto', barry.prisonerNumber)

        cy.visit(
          `/reports/${reportWithDetails.id}/prisoners/search?page=1&global=no&q=AR&prisonerLocationStatus=ALL&prisonerGender=ALL&prisonerDateOfBirth=`,
        )
        prisonerSearchPage = Page.verifyOnPage(PrisonerSearchPage)
      })

      it('should have back link point to involvements page', () => {
        prisonerSearchPage.checkBackLink(`/reports/${reportWithDetails.id}/prisoners`)
      })

      it('should show results table', () => {
        prisonerSearchPage.tableContents.then(rows => {
          expect(rows).to.have.lengthOf(2)
          const [row1, row2] = rows

          expect(row1).to.contain({
            name: 'Andrew Arnold (opens in a new tab)',
            prisonerNumber: 'A1111AA',
            establishment: 'Moorland (HMP & YOI)',
          })
          expect(row1.photo).to.have.attr('src', '/prisoner/A1111AA/photo.jpeg')
          expect(row1.actionLink).to.contain('Select Andrew Arnold')
          expect(row1.actionLink).to.have.attr('href', `/reports/${reportWithDetails.id}/prisoners/add/A1111AA`)

          expect(row2).to.contain({
            name: 'Barry Benjamin (opens in a new tab)',
            prisonerNumber: 'A2222BB',
            establishment: 'Moorland (HMP & YOI)',
          })
          expect(row2.photo).to.have.attr('src', '/prisoner/A2222BB/photo.jpeg')
          expect(row2.actionLink).to.contain('Select Barry Benjamin')
          expect(row2.actionLink).to.have.attr('href', `/reports/${reportWithDetails.id}/prisoners/add/A2222BB`)
        })
      })
    })
  })

  context('when searching globally', () => {
    context('and nobody was found', () => {
      beforeEach(() => {
        cy.task('stubOffenderSearchGlobally', { andWords: 'A1111', prisonIds: null, results: [] })

        cy.visit(`/reports/${reportWithDetails.id}/prisoners/search?page=1&global=yes&q=A1111`)
        prisonerSearchPage = Page.verifyOnPage(PrisonerSearchPage)
      })

      it('should have back link point to involvements page', () => {
        prisonerSearchPage.checkBackLink(`/reports/${reportWithDetails.id}/prisoners`)
      })

      it('should show no results table', () => {
        prisonerSearchPage.showsNoTable()
      })
    })

    context('and results were returned', () => {
      beforeEach(() => {
        cy.task('stubOffenderSearchGlobally', {
          andWords: 'A1111',
          prisonIds: null,
          location: 'ALL',
          gender: 'ALL',
          dateOfBirth: null,
          results: [andrew],
        })
        cy.task('stubPrisonApiMockPrisonerPhoto', andrew.prisonerNumber)

        cy.visit(
          `/reports/${reportWithDetails.id}/prisoners/search?page=1&global=yes&q=A1111&prisonerLocationStatus=ALL&prisonerGender=ALL&dateOfBirth=`,
        )
        prisonerSearchPage = Page.verifyOnPage(PrisonerSearchPage)
      })

      it('should have back link point to involvements page', () => {
        prisonerSearchPage.checkBackLink(`/reports/${reportWithDetails.id}/prisoners`)
      })

      it('should show results table', () => {
        prisonerSearchPage.tableContents.then(rows => {
          expect(rows).to.have.lengthOf(1)
          const [row1] = rows

          expect(row1).to.contain({
            name: 'Andrew Arnold (opens in a new tab)',
            prisonerNumber: 'A1111AA',
            establishment: 'Moorland (HMP & YOI)',
          })
          expect(row1.photo).to.have.attr('src', '/prisoner/A1111AA/photo.jpeg')
          expect(row1.actionLink).to.contain('Select Andrew Arnold')
          expect(row1.actionLink).to.have.attr('href', `/reports/${reportWithDetails.id}/prisoners/add/A1111AA`)
        })
      })
    })
  })
})
