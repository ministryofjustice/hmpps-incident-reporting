import { mockReport } from '../../../../server/data/testData/incidentReporting'
import { andrew, barry } from '../../../../server/data/testData/offenderSearch'
import { moorland } from '../../../../server/data/testData/prisonApi'
import { now } from '../../../../server/testutils/fakeClock'
import Page from '../../../pages/page'
import { PrisonerInvolvementsPage, PrisonerSearchPage } from '../../../pages/reports/involvements/prisoners'
import { ReportPage } from '../../../pages/reports/report'
import type { PrisonerInvolvement } from '../../../../server/data/incidentReportingApi'

context('Prisoner involvements page', () => {
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

  // A prisoner involvement with the sole role for ABSCOND_1
  const absconderInvolvement: PrisonerInvolvement = {
    prisonerNumber: andrew.prisonerNumber,
    firstName: andrew.firstName,
    lastName: andrew.lastName,
    prisonerRole: 'ABSCONDER',
    outcome: null,
    comment: '',
  }

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
      cy.task('stubPrisonApiMockPrison', moorland)
      cy.task('stubManageKnownUsers')

      prisonerInvolvementsPage.selectRadioButton('No')
      prisonerInvolvementsPage.submit()

      Page.verifyOnPage(ReportPage, reportWithDetails.reportReference, true)
    })

    it('should return to report if skip is chosen', () => {
      cy.task('stubIncidentReportingApiGetReportById', { report: reportWithDetails })
      cy.task('stubPrisonApiMockPrison', moorland)
      cy.task('stubManageKnownUsers')

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
      cy.task('stubPrisonApiMockPrison', moorland)
      cy.task('stubManageKnownUsers')

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

  context('when all prisoner role slots are exhausted (onlyOneAllowed)', () => {
    // ABSCOND_1 has a single active role (ABSCONDER, onlyOneAllowed: true).
    // Once that role is filled no further prisoners can be added, so the radio
    // question should be hidden and Continue/Save and exit act as implicit "No".
    const reportAbscond = mockReport({
      type: 'ABSCOND_1',
      reportReference: '6545',
      reportDateAndTime: now,
      withDetails: true,
    })
    reportAbscond.staffInvolved = []
    reportAbscond.staffInvolvementDone = false
    reportAbscond.questions = []
    reportAbscond.correctionRequests = []

    beforeEach(() => {
      reportAbscond.prisonersInvolved = [absconderInvolvement]
      reportAbscond.prisonerInvolvementDone = true

      cy.task('stubIncidentReportingApiGetReportWithDetailsById', { report: reportAbscond })
      cy.visit(`/reports/${reportAbscond.id}/prisoners`)
      Page.verifyOnPage(PrisonerInvolvementsPage)
    })

    it('should not show the "add another prisoner?" radio', () => {
      const page = new PrisonerInvolvementsPage()
      page.showsNoRadio()
    })

    it('should still show Continue and Save and exit buttons', () => {
      cy.contains('button', 'Continue').should('exist')
      cy.contains('button', 'Save and exit').should('exist')
    })

    it('should navigate to the report page when Continue is clicked (implicit No)', () => {
      cy.task('stubIncidentReportingApiGetReportById', { report: reportAbscond })
      cy.task('stubPrisonApiMockPrison', moorland)
      cy.task('stubManageKnownUsers')

      cy.contains('button', 'Continue').click()

      Page.verifyOnPage(ReportPage, reportAbscond.reportReference, true)
    })

    it('should show the table of existing prisoners', () => {
      const page = new PrisonerInvolvementsPage()
      page.tableRows.should('have.length', 1)
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
      cy.task('stubPrisonApiMockPrison', moorland)
      cy.task('stubManageKnownUsers')

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
