import type { ReportWithDetails } from '../../../server/data/incidentReportingApi'
import { moorland, pecsSouth } from '../../../server/data/testData/prisonApi'
import { mockDataWarden, mockReportingOfficer } from '../../../server/data/testData/users'
import type { Status } from '../../../server/reportConfiguration/constants'
import { now } from '../../../server/testutils/fakeClock'
import Page from '../../pages/page'
import { ReopenPage } from '../../pages/reports/reopen'
import { ReportPage } from '../../pages/reports/report'
import { validReport } from './validReport'

context('Reopen or recall a report', () => {
  beforeEach(() => {
    cy.clock(now)
  })

  const recallScenarios: RecallScenario[] = [
    {
      userType: 'reporting officers',
      user: mockReportingOfficer,
      reportType: 'prison',
      transitions: [
        ['AWAITING_REVIEW', 'DRAFT'],
        ['UPDATED', 'NEEDS_UPDATING'],
        ['WAS_CLOSED', 'REOPENED'],
      ],
      buttonText: 'Change report',
    },
    {
      userType: 'data wardens',
      user: mockDataWarden,
      reportType: 'prison',
      transitions: [
        ['NEEDS_UPDATING', 'UPDATED'],
        ['DUPLICATE', 'UPDATED'],
        ['NOT_REPORTABLE', 'UPDATED'],
        ['CLOSED', 'UPDATED'],
        ['REOPENED', 'WAS_CLOSED'],
      ],
      buttonText: 'Change report status',
    },
    {
      userType: 'data wardens',
      user: mockDataWarden,
      reportType: 'PECS',
      transitions: [
        ['DUPLICATE', 'REOPENED'],
        ['NOT_REPORTABLE', 'REOPENED'],
        ['CLOSED', 'REOPENED'],
      ],
      buttonText: 'Reopen and change report',
    },
  ]
  recallScenarios.forEach(({ userType, user, reportType, transitions, buttonText }) => {
    context(`${userType}`, () => {
      transitions.forEach(([currentStatus, recalledTo]) => {
        const reportWithDetails: DatesAsStrings<ReportWithDetails> = {
          ...validReport,
          status: currentStatus,
        }
        if (reportType === 'PECS') {
          reportWithDetails.location = 'SOUTH'
        }

        it(`should be able to recall a ${reportType} report with status ${currentStatus} to ${recalledTo}`, () => {
          cy.resetBasicStubs({ user })
          cy.task('stubPrisonApiMockPrison', reportType === 'PECS' ? pecsSouth : moorland)
          cy.task('stubManageKnownUsers')
          cy.signIn()

          cy.task('stubIncidentReportingApiGetReportWithDetailsById', { report: reportWithDetails })
          cy.visit(`/reports/${reportWithDetails.id}`)

          let reportPage = Page.verifyOnPage(ReportPage, reportWithDetails.reportReference)

          cy.task('stubIncidentReportingApiChangeReportStatus', {
            request: {
              newStatus: recalledTo,
              correctionRequest: {
                userType: 'DATA_WARDEN',
                userAction: 'CLOSE',
                descriptionOfChange: '(Closed)',
              },
            },
            report: {
              ...reportWithDetails,
              status: recalledTo,
            },
          })

          reportPage.submitButtons.contains(buttonText).click()

          reportPage = Page.verifyOnPage(ReportPage, reportWithDetails.reportReference) // technically, won’t display correct status
          reportPage.errorSummary.should('not.exist')
        })
      })
    })
  })

  const reopenScenarios: ReopenScenario[] = [
    { currentStatus: 'DUPLICATE', reopenedTo: 'NEEDS_UPDATING' },
    { currentStatus: 'NOT_REPORTABLE', reopenedTo: 'NEEDS_UPDATING' },
    { currentStatus: 'CLOSED', reopenedTo: 'REOPENED' },
  ]
  reopenScenarios.forEach(({ currentStatus, reopenedTo }) => {
    context('reporting officers', () => {
      const reportWithDetails: DatesAsStrings<ReportWithDetails> = {
        ...validReport,
        status: currentStatus,
      }

      it(`should be able to reopen a report with status ${currentStatus} after being prompted`, () => {
        cy.resetBasicStubs({ user: mockReportingOfficer })
        cy.task('stubPrisonApiMockPrison', moorland)
        cy.task('stubManageKnownUsers')
        cy.signIn()

        cy.task('stubIncidentReportingApiGetReportWithDetailsById', { report: reportWithDetails })
        cy.task('stubIncidentReportingApiGetReportById', { report: reportWithDetails })
        cy.visit(`/reports/${reportWithDetails.id}`)

        let reportPage = Page.verifyOnPage(ReportPage, reportWithDetails.reportReference)
        reportPage.submitButtons.contains('Reopen and change report').click()

        const reopenPage = Page.verifyOnPage(ReopenPage)

        cy.task('stubIncidentReportingApiChangeReportStatus', {
          request: {
            newStatus: reopenedTo,
            correctionRequest: {
              userType: 'DATA_WARDEN',
              userAction: 'CLOSE',
              descriptionOfChange: '(Closed)',
            },
          },
          report: {
            ...reportWithDetails,
            status: reopenedTo,
          },
        })

        reopenPage.submit()

        reportPage = Page.verifyOnPage(ReportPage, reportWithDetails.reportReference) // technically, won’t display correct status
        reportPage.errorSummary.should('not.exist')
      })
    })
  })
})

interface RecallScenario {
  userType: string
  user: Express.User
  reportType: 'prison' | 'PECS'
  transitions: [Status, Status][]
  buttonText: string
}

interface ReopenScenario {
  currentStatus: Status
  reopenedTo: Status
}
