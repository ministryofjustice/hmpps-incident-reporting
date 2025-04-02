import { mockReport } from '../../../../server/data/testData/incidentReporting'
import { andrew, barry } from '../../../../server/data/testData/offenderSearch'
import Page from '../../../pages/page'
import { PrisonerInvolvementsPage, PrisonerSearchPage } from '../../../pages/reports/involvements/prisoners'
import ReportPage from '../../../pages/reports/report'

context('Prisoner involvements page', () => {
  const now = new Date()
  const reportWithDetails = mockReport({
    type: 'MISCELLANEOUS_1',
    reportReference: '6544',
    reportDateAndTime: now,
    withDetails: true,
  })
  reportWithDetails.staffInvolved = []
  reportWithDetails.staffInvolvementDone = false
  reportWithDetails.questions = []
  reportWithDetails.correctionRequests = []

  let prisonerInvolvementsPage: PrisonerInvolvementsPage

  beforeEach(() => {
    cy.resetBasicStubs()

    cy.signIn()
  })

  context('before anyone has been added', () => {
    beforeEach(() => {
      reportWithDetails.prisonersInvolved = []
      reportWithDetails.prisonerInvolvementDone = false

      cy.task('stubIncidentReportingApiGetReportWithDetailsById', { report: reportWithDetails })
      cy.visit(`/reports/${reportWithDetails.id}/prisoners`)
      prisonerInvolvementsPage = Page.verifyOnPage(PrisonerInvolvementsPage, false)
    })

    it('should have back link point to report', () => {
      prisonerInvolvementsPage.checkBackLink(`/reports/${reportWithDetails.id}`)
    })

    it('should show 3 options for what can be done next', () => {
      prisonerInvolvementsPage.radioButtonChoices.then(choices => {
        expect(choices).to.deep.equal([
          { label: 'Yes', value: 'yes', checked: false },
          { label: 'No', value: 'no', checked: false },
          { label: 'Skip for now', value: 'skip', checked: false },
        ])
      })
    })

    it('should return to report if no is chosen', () => {
      cy.task('stubIncidentReportingApiUpdateReport', {
        request: { prisonerInvolvementDone: true },
        report: reportWithDetails,
      })

      cy.task('stubIncidentReportingApiGetReportById', { report: reportWithDetails })
      cy.task('stubPrisonApiMockPrisons')

      prisonerInvolvementsPage.selectRadioButton('No')
      prisonerInvolvementsPage.submit()

      Page.verifyOnPage(ReportPage, reportWithDetails.reportReference, true)
    })

    it('should return to report if skip is chosen', () => {
      cy.task('stubIncidentReportingApiGetReportById', { report: reportWithDetails })
      cy.task('stubPrisonApiMockPrisons')

      prisonerInvolvementsPage.selectRadioButton('Skip for now')
      prisonerInvolvementsPage.submit()

      Page.verifyOnPage(ReportPage, reportWithDetails.reportReference, true)
    })

    it('should go to search page if yes is chosen', () => {
      prisonerInvolvementsPage.selectRadioButton('Yes')
      prisonerInvolvementsPage.submit()

      Page.verifyOnPage(PrisonerSearchPage)
    })

    it('should not show a table', () => {
      prisonerInvolvementsPage.showsNoTable()
    })
  })

  context('if user chose to add nobody', () => {
    beforeEach(() => {
      reportWithDetails.prisonersInvolved = []
      reportWithDetails.prisonerInvolvementDone = true

      cy.task('stubIncidentReportingApiGetReportWithDetailsById', { report: reportWithDetails })
      cy.visit(`/reports/${reportWithDetails.id}/prisoners`)
      prisonerInvolvementsPage = Page.verifyOnPage(PrisonerInvolvementsPage)
    })

    it('should have back link point to report', () => {
      prisonerInvolvementsPage.checkBackLink(`/reports/${reportWithDetails.id}`)
    })

    it('should show 2 options for what can be done next', () => {
      prisonerInvolvementsPage.radioButtonChoices.then(choices => {
        expect(choices).to.deep.equal([
          { label: 'Yes', value: 'yes', checked: false },
          { label: 'No', value: 'no', checked: false },
        ])
      })
    })

    it('should return to report if no is chosen', () => {
      cy.task('stubIncidentReportingApiUpdateReport', {
        request: { prisonerInvolvementDone: true },
        report: reportWithDetails,
      })

      cy.task('stubIncidentReportingApiGetReportById', { report: reportWithDetails })
      cy.task('stubPrisonApiMockPrisons')

      prisonerInvolvementsPage.selectRadioButton('No')
      prisonerInvolvementsPage.submit()

      Page.verifyOnPage(ReportPage, reportWithDetails.reportReference, true)
    })

    it('should go to search page if yes is chosen', () => {
      prisonerInvolvementsPage.selectRadioButton('Yes')
      prisonerInvolvementsPage.submit()

      Page.verifyOnPage(PrisonerSearchPage)
    })

    it('should not show a table', () => {
      prisonerInvolvementsPage.showsNoTable()
    })
  })

  context('if people were added', () => {
    beforeEach(() => {
      reportWithDetails.prisonersInvolved = [
        {
          prisonerNumber: andrew.prisonerNumber,
          firstName: andrew.firstName,
          lastName: andrew.lastName,
          prisonerRole: 'IMPEDED_STAFF',
          outcome: 'LOCAL_INVESTIGATION',
          comment: 'Some comments',
        },
        {
          prisonerNumber: barry.prisonerNumber,
          firstName: barry.firstName,
          lastName: barry.lastName,
          prisonerRole: 'ESCAPE',
          outcome: 'POLICE_INVESTIGATION',
          comment: 'Matter being handled by police',
        },
      ]
      reportWithDetails.prisonerInvolvementDone = true

      cy.task('stubIncidentReportingApiGetReportWithDetailsById', { report: reportWithDetails })
      cy.visit(`/reports/${reportWithDetails.id}/prisoners`)
      prisonerInvolvementsPage = Page.verifyOnPage(PrisonerInvolvementsPage)
    })

    it('should have back link point to report', () => {
      prisonerInvolvementsPage.checkBackLink(`/reports/${reportWithDetails.id}`)
    })

    it('should show 2 options for what can be done next', () => {
      prisonerInvolvementsPage.radioButtonChoices.then(choices => {
        expect(choices).to.deep.equal([
          { label: 'Yes', value: 'yes', checked: false },
          { label: 'No', value: 'no', checked: false },
        ])
      })
    })

    it('should return to report if no is chosen', () => {
      cy.task('stubIncidentReportingApiGetReportById', { report: reportWithDetails })
      cy.task('stubPrisonApiMockPrisons')

      prisonerInvolvementsPage.selectRadioButton('No')
      prisonerInvolvementsPage.submit()

      Page.verifyOnPage(ReportPage, reportWithDetails.reportReference, true)
    })

    it('should go to search page if yes is chosen', () => {
      prisonerInvolvementsPage.selectRadioButton('Yes')
      prisonerInvolvementsPage.submit()

      Page.verifyOnPage(PrisonerSearchPage)
    })

    it('should show a table', () => {
      prisonerInvolvementsPage.tableContents.then(rows => {
        expect(rows).to.have.lengthOf(2)
        const [row1, row2] = rows

        expect(row1).to.contain({
          prisoner: 'A1111AA: Andrew Arnold',
          role: 'Impeded staff',
          outcome: null,
          details: 'Some comments',
        })
        expect(row1.actionLinks).to.have.lengthOf(2)
        expect(row1.actionLinks[0]).to.contain('Remove')
        expect(row1.actionLinks[0]).to.have.attr('href', `/reports/${reportWithDetails.id}/prisoners/remove/1`)
        expect(row1.actionLinks[1]).to.contain('Edit')
        expect(row1.actionLinks[1]).to.have.attr('href', `/reports/${reportWithDetails.id}/prisoners/1`)

        expect(row2).to.contain({
          prisoner: 'A2222BB: Barry Benjamin',
          role: 'Escapee',
          outcome: null,
          details: 'Matter being handled by police',
        })
        expect(row2.actionLinks).to.have.lengthOf(2)
        expect(row2.actionLinks[0]).to.contain('Remove')
        expect(row2.actionLinks[0]).to.have.attr('href', `/reports/${reportWithDetails.id}/prisoners/remove/2`)
        expect(row2.actionLinks[1]).to.contain('Edit')
        expect(row2.actionLinks[1]).to.have.attr('href', `/reports/${reportWithDetails.id}/prisoners/2`)
      })
    })
  })
})
