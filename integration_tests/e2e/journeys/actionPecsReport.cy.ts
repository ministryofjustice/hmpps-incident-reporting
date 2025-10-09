import type { ReportWithDetails } from '../../../server/data/incidentReportingApi'
import { pecsNorth } from '../../../server/data/testData/prisonApi'
import { mockDataWarden } from '../../../server/data/testData/users'
import { now } from '../../../server/testutils/fakeClock'
import Page from '../../pages/page'
import { ReportPage } from '../../pages/reports/report'
import { validReport } from './validReport'
import { actionTestCase } from './actionReport'

describe('Actioning reopened PECS reports', () => {
  beforeEach(() => {
    cy.clock(now)
  })

  context('a data warden viewing a report with status REOPENED', () => {
    beforeEach(() => {
      cy.resetBasicStubs({ user: mockDataWarden })
      cy.task('stubPrisonApiMockPrison', pecsNorth)
      cy.task('stubManageKnownUsers')
      cy.signIn()
    })

    context('if it is valid (all requirements fulfilled)', () => {
      const reportWithDetails: DatesAsStrings<ReportWithDetails> = {
        ...validReport,
        status: 'REOPENED',
        title: 'Food or liquid refusal: Arnold A1111AA, Benjamin A2222BB (PECS North)',
        location: 'NORTH',
        correctionRequests: [],
      }

      beforeEach(() => {
        cy.task('stubIncidentReportingApiGetReportWithDetailsById', { report: reportWithDetails })
        cy.visit(`/reports/${reportWithDetails.id}`)
      })

      it('should see a list of actions', () => {
        const reportPage = Page.verifyOnPage(ReportPage, reportWithDetails.reportReference, true)
        reportPage.userActionsChoices.then(choices => {
          const expectedChoices: typeof choices = [
            { label: 'Close', value: 'CLOSE', checked: false },
            { label: 'Mark as a duplicate', value: 'MARK_DUPLICATE', checked: false },
            { label: 'Mark as not reportable', value: 'MARK_NOT_REPORTABLE', checked: false },
          ]
          expect(choices).to.deep.equal(expectedChoices)
        })
      })

      it(`should be able to close it`, () => {
        actionTestCase({
          reportWithDetails,
          reportInToDoWorkList: true,
          actionLabel: 'Close',
          userAction: 'CLOSE',
          newStatus: 'CLOSED',
          banner: 'Incident report 6544 is now closed',
          commentSentToApi: '(Closed)',
        })
      })

      it('should be able to mark it as a duplicate', () => {
        const duplicatedReportId = '0198a59c-1111-2222-3333-444444444444'
        cy.task('stubIncidentReportingApiGetReportByReference', {
          report: {
            ...reportWithDetails,
            id: duplicatedReportId,
            reportReference: '6543',
          },
        })
        cy.task('stubIncidentReportingApiUpdateReport', {
          request: { duplicatedReportId },
          report: {
            ...reportWithDetails,
            duplicatedReportId,
          },
        })

        actionTestCase({
          reportWithDetails,
          reportInToDoWorkList: true,
          actionLabel: 'Mark as a duplicate',
          userAction: 'MARK_DUPLICATE',
          newStatus: 'DUPLICATE',
          originalReportReference: '6543',
          comment: 'Definitely same incident as 6543',
          banner: 'Incident report 6544 is now set as a duplicate',
        })
      })

      it('should be able to mark it as not reportable', () => {
        actionTestCase({
          reportWithDetails,
          reportInToDoWorkList: true,
          actionLabel: 'Mark as not reportable',
          userAction: 'MARK_NOT_REPORTABLE',
          newStatus: 'NOT_REPORTABLE',
          comment: 'Severity of incident does not necessitate a report',
          banner: 'Incident report 6544 is now set as non reportable',
        })
      })
    })
  })
})
