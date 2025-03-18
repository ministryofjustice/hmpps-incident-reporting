import { mockReport } from '../../server/data/testData/incidentReporting'
import { staffMary, staffBarry } from '../../server/data/testData/prisonApi'
import Page from '../pages/page'
import StaffInvolvementsPage from '../pages/reports/staff/involvements'
import StaffSearchPage from '../pages/reports/staff/search'
import ReportPage from '../pages/reports/report'

context('Staff involvements page', () => {
  const now = new Date()
  const reportWithDetails = mockReport({
    type: 'MISCELLANEOUS',
    reportReference: '6544',
    reportDateAndTime: now,
    withDetails: true,
  })
  reportWithDetails.prisonersInvolved = []
  reportWithDetails.prisonerInvolvementDone = false
  reportWithDetails.questions = []
  reportWithDetails.correctionRequests = []

  let staffInvolvementsPage: StaffInvolvementsPage

  beforeEach(() => {
    cy.resetBasicStubs()

    cy.signIn()
  })

  context('before anyone has been added', () => {
    beforeEach(() => {
      reportWithDetails.staffInvolved = []
      reportWithDetails.staffInvolvementDone = false

      cy.task('stubIncidentReportingApiGetReportWithDetailsById', { report: reportWithDetails })
      cy.visit(`/reports/${reportWithDetails.id}/staff`)
      staffInvolvementsPage = Page.verifyOnPage(StaffInvolvementsPage, false)
    })

    it('should have back link point to report', () => {
      staffInvolvementsPage.checkBackLink(`/reports/${reportWithDetails.id}`)
    })

    it('should show 3 options for what can be done next', () => {
      staffInvolvementsPage.radioButtonChoices.then(choices => {
        expect(choices).to.deep.equal([
          { label: 'Yes', value: 'yes', checked: false },
          { label: 'No', value: 'no', checked: false },
          { label: 'Skip for now', value: 'skip', checked: false },
        ])
      })
    })

    it('should return to report if no is chosen', () => {
      cy.task('stubIncidentReportingApiUpdateReport', {
        request: { staffInvolvementDone: true },
        report: reportWithDetails,
      })

      cy.task('stubIncidentReportingApiGetReportById', { report: reportWithDetails })
      cy.task('stubPrisonApiMockPrisons')

      staffInvolvementsPage.selectRadioButton('No')
      staffInvolvementsPage.submit()

      Page.verifyOnPage(ReportPage, reportWithDetails.reportReference, true)
    })

    it('should return to report if skip is chosen', () => {
      cy.task('stubIncidentReportingApiGetReportById', { report: reportWithDetails })
      cy.task('stubPrisonApiMockPrisons')

      staffInvolvementsPage.selectRadioButton('Skip for now')
      staffInvolvementsPage.submit()

      Page.verifyOnPage(ReportPage, reportWithDetails.reportReference, true)
    })

    it('should go to search page if yes is chosen', () => {
      staffInvolvementsPage.selectRadioButton('Yes')
      staffInvolvementsPage.submit()

      Page.verifyOnPage(StaffSearchPage)
    })

    it('should not show a table', () => {
      staffInvolvementsPage.showsNoTable()
    })
  })

  context('if user chose to add nobody', () => {
    beforeEach(() => {
      reportWithDetails.staffInvolved = []
      reportWithDetails.staffInvolvementDone = true

      cy.task('stubIncidentReportingApiGetReportWithDetailsById', { report: reportWithDetails })
      cy.visit(`/reports/${reportWithDetails.id}/staff`)
      staffInvolvementsPage = Page.verifyOnPage(StaffInvolvementsPage)
    })

    it('should have back link point to report', () => {
      staffInvolvementsPage.checkBackLink(`/reports/${reportWithDetails.id}`)
    })

    it('should show 2 options for what can be done next', () => {
      staffInvolvementsPage.radioButtonChoices.then(choices => {
        expect(choices).to.deep.equal([
          { label: 'Yes', value: 'yes', checked: false },
          { label: 'No', value: 'no', checked: false },
        ])
      })
    })

    it('should return to report if no is chosen', () => {
      cy.task('stubIncidentReportingApiUpdateReport', {
        request: { staffInvolvementDone: true },
        report: reportWithDetails,
      })

      cy.task('stubIncidentReportingApiGetReportById', { report: reportWithDetails })
      cy.task('stubPrisonApiMockPrisons')

      staffInvolvementsPage.selectRadioButton('No')
      staffInvolvementsPage.submit()

      Page.verifyOnPage(ReportPage, reportWithDetails.reportReference, true)
    })

    it('should go to search page if yes is chosen', () => {
      staffInvolvementsPage.selectRadioButton('Yes')
      staffInvolvementsPage.submit()

      Page.verifyOnPage(StaffSearchPage)
    })

    it('should not show a table', () => {
      staffInvolvementsPage.showsNoTable()
    })
  })

  context('if people were added', () => {
    beforeEach(() => {
      reportWithDetails.staffInvolved = [
        {
          staffUsername: staffMary.username,
          firstName: staffMary.firstName,
          lastName: staffMary.lastName,
          staffRole: 'NEGOTIATOR',
          comment: 'See duty log',
        },
        {
          staffUsername: staffBarry.username,
          firstName: staffBarry.firstName,
          lastName: staffBarry.lastName,
          staffRole: 'WITNESS',
          comment: 'See duty log addendum',
        },
      ]
      reportWithDetails.staffInvolvementDone = true

      cy.task('stubIncidentReportingApiGetReportWithDetailsById', { report: reportWithDetails })
      cy.visit(`/reports/${reportWithDetails.id}/staff`)
      staffInvolvementsPage = Page.verifyOnPage(StaffInvolvementsPage)
    })

    it('should have back link point to report', () => {
      staffInvolvementsPage.checkBackLink(`/reports/${reportWithDetails.id}`)
    })

    it('should show 2 options for what can be done next', () => {
      staffInvolvementsPage.radioButtonChoices.then(choices => {
        expect(choices).to.deep.equal([
          { label: 'Yes', value: 'yes', checked: false },
          { label: 'No', value: 'no', checked: false },
        ])
      })
    })

    it('should return to report if no is chosen', () => {
      cy.task('stubIncidentReportingApiGetReportById', { report: reportWithDetails })
      cy.task('stubPrisonApiMockPrisons')

      staffInvolvementsPage.selectRadioButton('No')
      staffInvolvementsPage.submit()

      Page.verifyOnPage(ReportPage, reportWithDetails.reportReference, true)
    })

    it('should go to search page if yes is chosen', () => {
      staffInvolvementsPage.selectRadioButton('Yes')
      staffInvolvementsPage.submit()

      Page.verifyOnPage(StaffSearchPage)
    })

    it('should show a table', () => {
      staffInvolvementsPage.tableContents.then(rows => {
        expect(rows).to.have.lengthOf(2)
        const [row1, row2] = rows

        expect(row1).to.contain({
          staff: 'Mary Johnson',
          role: 'Negotiator',
          details: 'See duty log',
        })
        expect(row1.actionLinks).to.have.lengthOf(2)
        expect(row1.actionLinks[0]).to.contain('Remove')
        expect(row1.actionLinks[0]).to.have.attr('href', `/reports/${reportWithDetails.id}/staff/remove/1`)
        expect(row1.actionLinks[1]).to.contain('Edit')
        expect(row1.actionLinks[1]).to.have.attr('href', `/reports/${reportWithDetails.id}/staff/1`)

        expect(row2).to.contain({
          staff: 'Barry Harrison',
          role: 'Witness',
          details: 'See duty log addendum',
        })
        expect(row2.actionLinks).to.have.lengthOf(2)
        expect(row2.actionLinks[0]).to.contain('Remove')
        expect(row2.actionLinks[0]).to.have.attr('href', `/reports/${reportWithDetails.id}/staff/remove/2`)
        expect(row2.actionLinks[1]).to.contain('Edit')
        expect(row2.actionLinks[1]).to.have.attr('href', `/reports/${reportWithDetails.id}/staff/2`)
      })
    })
  })
})
