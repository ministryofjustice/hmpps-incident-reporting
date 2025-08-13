import {
  RelatedObjectUrlSlug,
  type AddCorrectionRequestRequest,
  type ReportWithDetails,
} from '../../../server/data/incidentReportingApi'
import { mockReport } from '../../../server/data/testData/incidentReporting'
import { moorland } from '../../../server/data/testData/prisonApi'
import { mockDataWarden } from '../../../server/data/testData/users'
import type { ApiUserAction, UserAction } from '../../../server/middleware/permissions'
import type { Status } from '../../../server/reportConfiguration/constants'
import { now } from '../../../server/testutils/fakeClock'
import { apiQuestionResponse } from '../../support/utils'
import Page from '../../pages/page'
import { DashboardPage } from '../../pages/dashboard'
import { ReportPage } from '../../pages/reports/report'

describe('Actioning submitted reports', () => {
  beforeEach(() => {
    cy.clock(now)
  })

  const validReport = mockReport({
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

  const scenarios = [
    { currentStatus: 'AWAITING_REVIEW', sentBackTo: 'NEEDS_UPDATING' },
    { currentStatus: 'UPDATED', sentBackTo: 'NEEDS_UPDATING' },
    { currentStatus: 'ON_HOLD', sentBackTo: 'NEEDS_UPDATING' },
    { currentStatus: 'WAS_CLOSED', sentBackTo: 'REOPENED' },
  ] as const
  scenarios.forEach(({ currentStatus, sentBackTo }) => {
    context(`a data warden viewing a report with status ${currentStatus}`, () => {
      const reportWithDetails = { ...validReport, status: currentStatus }

      beforeEach(() => {
        cy.resetBasicStubs({ user: mockDataWarden })
        cy.task('stubPrisonApiMockPrison', moorland)
        cy.task('stubManageKnownUsers')
        cy.signIn()

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
          banner: 'Incident report 6544 has been sent back',
        })
      })

      it(`should be able to close it`, () => {
        actionTestCase({
          reportWithDetails,
          actionLabel: 'Close',
          userAction: 'CLOSE',
          newStatus: 'CLOSED',
          banner: 'Incident report 6544 has been marked as closed',
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
            banner: 'Incident report 6544 has been put on hold',
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
          commentPlaceholder: '(Report is a duplicate of 6543)',
          banner: 'Report 6544 has been marked as duplicate',
        })
      })

      it('should be able to mark it as not reportable (without being requested to do so)', () => {
        actionTestCase({
          reportWithDetails,
          actionLabel: 'Mark as not reportable',
          userAction: 'MARK_NOT_REPORTABLE',
          newStatus: 'NOT_REPORTABLE',
          commentPlaceholder: '(Not reportable)',
          banner: 'Report 6544 has been marked as not reportable',
        })
      })
    })
  })
})

function actionTestCase({
  reportWithDetails,
  actionLabel,
  userAction,
  newStatus,
  comment,
  commentPlaceholder,
  originalReportReference,
  banner,
}: {
  reportWithDetails: DatesAsStrings<ReportWithDetails>
  actionLabel: string
  userAction: ApiUserAction & UserAction
  newStatus: Status
  comment?: string
  commentPlaceholder?: string
  originalReportReference?: string
  banner: string
}) {
  const reportPage = Page.verifyOnPage(ReportPage, reportWithDetails.reportReference)
  reportPage.selectAction(actionLabel)
  if (originalReportReference) {
    reportPage.enterOriginalReportReference(originalReportReference)
  }
  if (comment) {
    reportPage.enterComment(userAction, comment)
  }

  const correctionRequestPayload: AddCorrectionRequestRequest = {
    userType: 'DATA_WARDEN',
    userAction,
    descriptionOfChange: comment ?? commentPlaceholder,
  }
  if (originalReportReference) {
    correctionRequestPayload.originalReportReference = originalReportReference
  }
  cy.task('stubIncidentReportingApiCreateRelatedObject', {
    urlSlug: RelatedObjectUrlSlug.correctionRequests,
    reportId: reportWithDetails.id,
    request: correctionRequestPayload,
    response: reportWithDetails.correctionRequests, // technically, missing new comment
  })
  cy.task('stubIncidentReportingApiChangeReportStatus', {
    request: { newStatus },
    report: {
      ...reportWithDetails,
      status: newStatus,
    },
  })

  cy.task('stubIncidentReportingApiGetReports') // for empty dashboard page

  reportPage.continueButton.click()

  const dashboardPage = Page.verifyOnPage(DashboardPage)
  dashboardPage.checkNotificationBannerContent(banner)
}
