import type { ReportWithDetails } from '../../../server/data/incidentReportingApi'
import { moorland } from '../../../server/data/testData/prisonApi'
import { mockDataWarden, mockReportingOfficer } from '../../../server/data/testData/users'
import type { Status } from '../../../server/reportConfiguration/constants'
import { now } from '../../../server/testutils/fakeClock'
import Page from '../../pages/page'
import { ReportPage } from '../../pages/reports/report'
import { validReport } from './validReport'

context('Reopen or recall a report', () => {
  beforeEach(() => {
    cy.clock(now)
  })

  const scenarios: Scenario[] = [
    {
      userType: 'reporting officers',
      user: mockReportingOfficer,
      transitions: [
        ['AWAITING_REVIEW', 'DRAFT'],
        ['UPDATED', 'NEEDS_UPDATING'],
        ['DUPLICATE', 'NEEDS_UPDATING'],
        ['NOT_REPORTABLE', 'NEEDS_UPDATING'],
        ['CLOSED', 'REOPENED'],
        ['WAS_CLOSED', 'REOPENED'],
      ],
      buttonText: 'Change report',
    },
    {
      userType: 'data wardens',
      user: mockDataWarden,
      transitions: [
        ['NEEDS_UPDATING', 'UPDATED'],
        ['DUPLICATE', 'UPDATED'],
        ['NOT_REPORTABLE', 'UPDATED'],
        ['CLOSED', 'UPDATED'],
        ['REOPENED', 'WAS_CLOSED'],
      ],
      buttonText: 'Change report status',
    },
  ]
  scenarios.forEach(({ userType, user, transitions, buttonText }) => {
    context(`${userType}`, () => {
      beforeEach(() => {
        cy.resetBasicStubs({ user })
        cy.task('stubPrisonApiMockPrison', moorland)
        cy.task('stubManageKnownUsers')
        cy.signIn()
      })

      transitions.forEach(([currentStatus, recalledTo]) => {
        const reportWithDetails: DatesAsStrings<ReportWithDetails> = {
          ...validReport,
          status: currentStatus,
        }

        beforeEach(() => {
          cy.task('stubIncidentReportingApiGetReportWithDetailsById', { report: reportWithDetails })
          cy.visit(`/reports/${reportWithDetails.id}`)
        })

        it(`should be able to reopen or recall a report with status ${currentStatus} to ${recalledTo}`, () => {
          const reportPage = Page.verifyOnPage(ReportPage, reportWithDetails.reportReference)
          reportPage.submitButtons.contains(buttonText).should('exist')
        })
      })
    })
  })
})

interface Scenario {
  userType: string
  user: Express.User
  transitions: [Status, Status][]
  buttonText: string
}
