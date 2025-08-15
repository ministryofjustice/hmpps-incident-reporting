import type { ReportWithDetails } from '../../../server/data/incidentReportingApi'
import { mockReport } from '../../../server/data/testData/incidentReporting'
import { moorland } from '../../../server/data/testData/prisonApi'
import { mockDataWarden, mockReportingOfficer } from '../../../server/data/testData/users'
import type { Status } from '../../../server/reportConfiguration/constants'
import { now } from '../../../server/testutils/fakeClock'
import { apiQuestionResponse } from '../../support/utils'
import Page from '../../pages/page'
import { ReportPage } from '../../pages/reports/report'

context('Reopen or recall a report', () => {
  beforeEach(() => {
    cy.clock(now)
  })

  const validReport: DatesAsStrings<ReportWithDetails> = mockReport({
    type: 'FOOD_REFUSAL_1',
    reportReference: '6544',
    reportDateAndTime: now,
    withDetails: true,
  })
  validReport.questions = [
    // <editor-fold desc="questions">
    apiQuestionResponse(
      '44990',
      'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
      'Is there any media interest in this incident?',
      '181927',
      'NO',
      'No',
    ),
    apiQuestionResponse(
      '44575',
      'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
      'Has the prison service press office been informed?',
      '180502',
      'NO',
      'No',
    ),
    apiQuestionResponse(
      '44887',
      'WHAT IS THE REASON FOR THIS FOOD REFUSAL',
      'What is the reason for this food refusal?',
      '181546',
      'VISITS',
      'Visits',
    ),
    apiQuestionResponse(
      '44768',
      'DESCRIBE THE TYPE OF FOOD REFUSAL',
      'Describe the type of food refusal',
      '181149',
      'ALL FOOD AND LIQUIDS',
      'All food and liquids',
    ),
    apiQuestionResponse(
      '44319',
      'WHERE IS THE PRISONER CURRENTLY LOCATED',
      'Where is the prisoner currently located?',
      '179556',
      'NORMAL LOCATION',
      'Normal location',
    ),
    apiQuestionResponse(
      '44399',
      'IS THE PRISONER THOUGHT TO BE OBTAINING FOOD FROM OTHER SOURCES',
      'Is the prisoner thought to be obtaining food from other sources?',
      '179840',
      'NO',
      'No',
    ),
    apiQuestionResponse(
      '44688',
      'IS THE FOOD REFUSAL CONTINUING',
      'Is the food refusal continuing?',
      '180875',
      'YES',
      'Yes',
    ),
    apiQuestionResponse(
      '44989',
      'DURATION OF FOOD REFUSAL',
      'Duration of food refusal',
      '181926',
      'ENTER HOURS',
      'Enter hours',
      null,
      '26',
    ),
    apiQuestionResponse(
      '44199',
      'IS THE FOOD REFUSAL EFFECTING ANY OTHER MEDICAL CONDITION',
      'Is the food refusal effecting any other medical condition?',
      '179163',
      'NO',
      'No',
    ),
    apiQuestionResponse(
      '44427',
      'IS THE FOOD REFUSAL CURRENTLY CONSIDERED LIFE THREATENING',
      'Is the food refusal currently considered life threatening?',
      '179912',
      'NO',
      'No',
    ),
    // </editor-fold>
  ]

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
