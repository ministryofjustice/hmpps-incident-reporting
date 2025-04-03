import type { UsersSearchResult } from '../../../../server/data/manageUsersApiClient'
import { mockReport } from '../../../../server/data/testData/incidentReporting'
import { staffMary, staffBarry, moorland } from '../../../../server/data/testData/prisonApi'
import Page from '../../../pages/page'
import { StaffSearchPage } from '../../../pages/reports/involvements/staff'

context('Staff search page', () => {
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

  let staffSearchPage: StaffSearchPage

  beforeEach(() => {
    cy.resetBasicStubs()

    cy.signIn()

    cy.task('stubIncidentReportingApiGetReportWithDetailsById', { report: reportWithDetails })
  })

  context('before search terms entered', () => {
    beforeEach(() => {
      cy.visit(`/reports/${reportWithDetails.id}/staff/search`)
      staffSearchPage = Page.verifyOnPage(StaffSearchPage)
    })

    it('should have back link point to involvements page', () => {
      staffSearchPage.checkBackLink(`/reports/${reportWithDetails.id}/staff`)
    })

    it('should show no results table', () => {
      staffSearchPage.showsNoTable()
      staffSearchPage.doesNotLinkToManualEntry()
    })
  })

  context('when searching for a term', () => {
    context('and nobody was found', () => {
      beforeEach(() => {
        cy.task('stubSearchUsers', { query: 'MARY', results: [] })

        cy.visit(`/reports/${reportWithDetails.id}/staff/search?page=1&q=MARY`)
        staffSearchPage = Page.verifyOnPage(StaffSearchPage, { notFound: 'MARY' })
      })

      it('should have back link point to involvements page', () => {
        staffSearchPage.checkBackLink(`/reports/${reportWithDetails.id}/staff`)
      })

      it('should show no results table', () => {
        staffSearchPage.showsNoTable()
        staffSearchPage.linksToManualEntry()
      })
    })

    context('and results were returned', () => {
      beforeEach(() => {
        cy.task('stubSearchUsers', {
          query: 'AR',
          results: [
            {
              username: staffMary.username,
              firstName: staffMary.firstName,
              lastName: staffMary.lastName,
              email: 'mary@dps.local',
              activeCaseload: { id: 'MDI', name: moorland.description },
            } satisfies UsersSearchResult,
            {
              username: staffBarry.username,
              firstName: staffBarry.firstName,
              lastName: staffBarry.lastName,
              activeCaseload: null,
            } satisfies UsersSearchResult,
          ],
        })

        cy.visit(`/reports/${reportWithDetails.id}/staff/search?page=1&q=AR`)
        staffSearchPage = Page.verifyOnPage(StaffSearchPage, { found: true })
      })

      it('should have back link point to involvements page', () => {
        staffSearchPage.checkBackLink(`/reports/${reportWithDetails.id}/staff`)
      })

      it('should show results table', () => {
        staffSearchPage.tableContents.then(rows => {
          expect(rows).to.have.lengthOf(2)
          const [row1, row2] = rows

          expect(row1).to.contain({
            name: 'Mary Johnson',
            username: 'abc12a',
            location: 'Moorland (HMP & YOI)',
            email: 'mary@dps.local',
          })
          expect(row1.actionLink).to.contain('Select Mary Johnson')
          expect(row1.actionLink).to.have.attr('href', `/reports/${reportWithDetails.id}/staff/add/username/abc12a`)

          expect(row2).to.contain({
            name: 'Barry Harrison',
            username: 'lev79n',
            location: '',
            email: '',
          })
          expect(row2.actionLink).to.contain('Select Barry Harrison')
          expect(row2.actionLink).to.have.attr('href', `/reports/${reportWithDetails.id}/staff/add/username/lev79n`)
        })
      })
    })
  })
})
