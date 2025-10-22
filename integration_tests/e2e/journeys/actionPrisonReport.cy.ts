import type { ReportWithDetails } from '../../../server/data/incidentReportingApi'
import { moorland } from '../../../server/data/testData/prisonApi'
import { mockDataWarden } from '../../../server/data/testData/users'
import { now } from '../../../server/testutils/fakeClock'
import Page from '../../pages/page'
import { ReportPage } from '../../pages/reports/report'
import { validReport } from './validReport'
import { actionTestCase } from './actionReport'

describe('Actioning submitted prison reports', () => {
  beforeEach(() => {
    cy.clock(now)
  })

  const scenarios = [
    { currentStatus: 'AWAITING_REVIEW', sentBackTo: 'NEEDS_UPDATING' },
    { currentStatus: 'UPDATED', sentBackTo: 'NEEDS_UPDATING' },
    { currentStatus: 'ON_HOLD', sentBackTo: 'NEEDS_UPDATING' },
    { currentStatus: 'WAS_CLOSED', sentBackTo: 'REOPENED' },
  ] as const
  scenarios.forEach(({ currentStatus, sentBackTo }) => {
    context(`a data warden viewing a report with status ${currentStatus}`, () => {
      beforeEach(() => {
        cy.resetBasicStubs({ user: mockDataWarden })
        cy.task('stubPrisonApiMockPrison', moorland)
        cy.task('stubManageKnownUsers')
        cy.signIn()
      })

      context('if it is valid (all requirements fulfilled)', () => {
        const reportWithDetails: DatesAsStrings<ReportWithDetails> = {
          ...validReport,
          status: currentStatus,
        }

        beforeEach(() => {
          cy.task('stubIncidentReportingApiGetReportWithDetailsById', { report: reportWithDetails })
          cy.visit(`/reports/${reportWithDetails.id}`)
        })

        it('should see a list of actions', () => {
          const reportPage = Page.verifyOnPage(ReportPage, reportWithDetails.reportReference)
          reportPage.userActionsChoices.then(choices => {
            const expectedChoices: typeof choices = [
              { label: 'Close', value: 'CLOSE', checked: false },
              { label: 'Send back', value: 'REQUEST_CORRECTION', checked: false },
            ]
            if (!['ON_HOLD', 'WAS_CLOSED'].includes(currentStatus)) {
              expectedChoices.push({ label: 'Put on hold', value: 'HOLD', checked: false })
            }
            expectedChoices.push(
              { label: 'Mark as a duplicate', value: 'MARK_DUPLICATE', checked: false },
              { label: 'Mark as not reportable', value: 'MARK_NOT_REPORTABLE', checked: false },
            )
            expect(choices).to.deep.equal(expectedChoices)
          })
        })

        it(`should be able to send it back to ${sentBackTo}`, () => {
          actionTestCase({
            reportWithDetails,
            actionLabel: 'Send back',
            userAction: 'REQUEST_CORRECTION',
            newStatus: sentBackTo,
            comment: 'Add prisoner number to description',
            banner: 'Incident report 6544 sent back',
          })
        })

        it(`should be able to close it`, () => {
          actionTestCase({
            reportWithDetails,
            actionLabel: 'Close',
            userAction: 'CLOSE',
            newStatus: 'CLOSED',
            banner: 'Incident report 6544 is now closed',
            commentSentToApi: '(Closed)',
          })
        })

        if (['AWAITING_REVIEW', 'UPDATED'].includes(currentStatus)) {
          it('should be able to put it on hold', () => {
            actionTestCase({
              reportWithDetails,
              actionLabel: 'Put on hold',
              userAction: 'HOLD',
              newStatus: 'ON_HOLD',
              comment: 'Checking policy…',
              banner: [
                'Incident report 6544 has been put on hold',
                'If you need to add further information to the report, you must contact the Operations Hub by email at hubnationaloperation@justice.gov.uk',
              ],
            })
          })
        }

        it('should be able to mark it as a duplicate (without being requested to do so)', () => {
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
            actionLabel: 'Mark as a duplicate',
            userAction: 'MARK_DUPLICATE',
            newStatus: 'DUPLICATE',
            originalReportReference: '6543',
            comment: 'Definitely same incident as 6543',
            banner: 'Incident report 6544 is now set as a duplicate',
          })
        })

        it('should be able to mark it as not reportable (without being requested to do so)', () => {
          actionTestCase({
            reportWithDetails,
            actionLabel: 'Mark as not reportable',
            userAction: 'MARK_NOT_REPORTABLE',
            newStatus: 'NOT_REPORTABLE',
            comment: 'Severity of incident does not necessitate a report',
            banner: 'Incident report 6544 is now set as non reportable',
          })
        })
      })

      context('after a reporting officer’s request to remove', () => {
        it('should be able to mark it as a duplicate', () => {
          const reportWithDetails: DatesAsStrings<ReportWithDetails> = {
            ...validReport,
            status: currentStatus,
            correctionRequests: [
              {
                descriptionOfChange: '(Report is a duplicate of 6543)',
                userAction: 'REQUEST_DUPLICATE',
                userType: 'REPORTING_OFFICER',
                originalReportReference: '6543',
                correctionRequestedBy: 'user1',
                correctionRequestedAt: '2023-12-05T09:20:03',
              },
            ],
          }

          cy.task('stubIncidentReportingApiGetReportWithDetailsById', { report: reportWithDetails })
          cy.visit(`/reports/${reportWithDetails.id}`)

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
            actionLabel: 'Mark as a duplicate',
            userAction: 'MARK_DUPLICATE',
            newStatus: 'DUPLICATE',
            originalReportReferenceSentToApi: '6543',
            commentSentToApi: '(Report is a duplicate of 6543)',
            banner: 'Incident report 6544 is now set as a duplicate',
          })
        })

        it('should be able to mark it as not reportable', () => {
          const reportWithDetails: DatesAsStrings<ReportWithDetails> = {
            ...validReport,
            status: currentStatus,
            correctionRequests: [
              {
                descriptionOfChange: 'Nobody was hurt',
                userType: 'REPORTING_OFFICER',
                userAction: 'REQUEST_NOT_REPORTABLE',
                originalReportReference: null,
                correctionRequestedBy: 'user1',
                correctionRequestedAt: '2023-12-05T09:20:03',
              },
            ],
          }

          cy.task('stubIncidentReportingApiGetReportWithDetailsById', { report: reportWithDetails })
          cy.visit(`/reports/${reportWithDetails.id}`)

          actionTestCase({
            reportWithDetails,
            actionLabel: 'Mark as not reportable',
            userAction: 'MARK_NOT_REPORTABLE',
            newStatus: 'NOT_REPORTABLE',
            commentSentToApi: '(Not reportable)',
            banner: 'Incident report 6544 is now set as non reportable',
          })
        })
      })

      context('if it is invalid (questions not answered)', () => {
        const reportWithDetails: DatesAsStrings<ReportWithDetails> = {
          ...validReport,
          status: currentStatus,
          questions: [],
        }

        beforeEach(() => {
          cy.task('stubIncidentReportingApiGetReportWithDetailsById', { report: reportWithDetails })
          cy.visit(`/reports/${reportWithDetails.id}`)
        })

        it('should see a list of actions', () => {
          const reportPage = Page.verifyOnPage(ReportPage, reportWithDetails.reportReference)
          reportPage.userActionsChoices.then(choices => {
            const expectedChoices: typeof choices = [
              { label: 'Send back', value: 'REQUEST_CORRECTION', checked: false },
            ]
            if (!['ON_HOLD', 'WAS_CLOSED'].includes(currentStatus)) {
              expectedChoices.push({ label: 'Put on hold', value: 'HOLD', checked: false })
            }
            expectedChoices.push(
              { label: 'Mark as a duplicate', value: 'MARK_DUPLICATE', checked: false },
              { label: 'Mark as not reportable', value: 'MARK_NOT_REPORTABLE', checked: false },
            )
            expect(choices).to.deep.equal(expectedChoices)
          })
        })
      })
    })
  })
})
