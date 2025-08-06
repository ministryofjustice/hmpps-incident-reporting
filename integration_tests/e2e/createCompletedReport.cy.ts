import type { Response as SuperAgentResponse } from 'superagent'

import format from '../../server/utils/format'
import { Question, RelatedObjectUrlSlug, type ReportWithDetails } from '../../server/data/incidentReportingApi'
import type { UsersSearchResult } from '../../server/data/manageUsersApiClient'
import { mockReport } from '../../server/data/testData/incidentReporting'
import { andrew } from '../../server/data/testData/offenderSearch'
import { moorland, staffMary } from '../../server/data/testData/prisonApi'
import Page from '../pages/page'
import HomePage from '../pages/home'
import { DashboardPage } from '../pages/dashboard'
import { TypePage } from '../pages/reports/type'
import DetailsPage from '../pages/reports/details'
import {
  AddPrisonerInvolvementsPage,
  PrisonerInvolvementsPage,
  PrisonerSearchPage,
} from '../pages/reports/involvements/prisoners'
import { AddStaffInvolvementsPage, StaffInvolvementsPage, StaffSearchPage } from '../pages/reports/involvements/staff'
import { QuestionPage } from '../pages/reports/question'
import ReportPage from '../pages/reports/report'

const now = new Date()
const incidentDate = new Date() // can't use artificial date to prevent hitting 1-year warning
incidentDate.setDate(incidentDate.getDate() - 1)
incidentDate.setHours(10)
incidentDate.setMinutes(30)
incidentDate.setSeconds(0)
incidentDate.setMilliseconds(0)

context('Creating a completed draft report', () => {
  let reportWithDetails: DatesAsStrings<ReportWithDetails>
  // report gets updated throughout so keep track of stub mapping id
  let getReportWithDetailsByIdStubId: string = null

  function stubReport() {
    if (getReportWithDetailsByIdStubId) {
      cy.task('deleteStub', getReportWithDetailsByIdStubId)
    }
    cy.task('stubIncidentReportingApiGetReportWithDetailsById', { report: reportWithDetails }).then(
      (res: SuperAgentResponse) => {
        getReportWithDetailsByIdStubId = JSON.parse(res.text).id
      },
    )
  }

  it('should happen in one journey', () => {
    cy.resetBasicStubs()

    // log in
    cy.signIn()

    // start on home page
    const indexPage = Page.verifyOnPage(HomePage)
    indexPage.clickCreateReportCard()

    // select type
    const typePage = Page.verifyOnPage(TypePage)
    typePage.checkBackLink('/')
    typePage.selectType('ATTEMPTED_ESCAPE_FROM_PRISON_1')
    typePage.submit()

    // enter details
    const detailsPage = Page.verifyOnPage(DetailsPage)
    detailsPage.enterDate(incidentDate)
    detailsPage.enterTime('10', '30')
    detailsPage.enterDescription('Arnold (A1111AA) attempted to escape')

    // on submission, this report would be created
    reportWithDetails = mockReport({
      type: 'ATTEMPTED_ESCAPE_FROM_PRISON_1',
      reportReference: '6544',
      reportDateAndTime: now,
      withDetails: true,
    })
    reportWithDetails.incidentDateAndTime = format.isoDateTime(incidentDate)
    reportWithDetails.title = 'Report: attempted escape from establishment'
    reportWithDetails.description = 'Arnold (A1111AA) attempted to escape'
    reportWithDetails.prisonersInvolved = []
    reportWithDetails.prisonerInvolvementDone = false
    reportWithDetails.staffInvolved = []
    reportWithDetails.staffInvolvementDone = false
    reportWithDetails.questions = []
    reportWithDetails.correctionRequests = []
    cy.task('stubIncidentReportingApiCreateReport', {
      request: {
        type: reportWithDetails.type,
        incidentDateAndTime: reportWithDetails.incidentDateAndTime,
        location: 'MDI',
        title: 'Attempted escape from establishment (Moorland (HMP & YOI))',
        description: reportWithDetails.description,
      },
      report: reportWithDetails,
    })
    stubReport()
    // minimal draft report is saved
    detailsPage.submit()

    // choose to add a prisoner
    let prisonerInvolvementsPage = Page.verifyOnPage(PrisonerInvolvementsPage, false)
    prisonerInvolvementsPage.selectRadioButton('Yes')
    prisonerInvolvementsPage.submit()

    // search for Andrew Arnold
    let prisonerSearchPage = Page.verifyOnPage(PrisonerSearchPage)
    prisonerSearchPage.enterQuery('Andrew Arnold')
    cy.task('stubOffenderSearchInPrison', { prisonId: 'MDI', term: 'Andrew Arnold', results: [andrew] })
    cy.task('stubPrisonApiMockPrisonerPhoto', andrew.prisonerNumber)
    prisonerSearchPage.submit()
    prisonerSearchPage = Page.verifyOnPage(PrisonerSearchPage)
    cy.task('stubOffenderSearchMockPrisoners')
    prisonerSearchPage.selectLink(0).click()

    // enter involvement details
    const addPrisonerInvolvementsPage = Page.verifyOnPage(AddPrisonerInvolvementsPage, 'Andrew Arnold’s')
    // NB: perpetrator would make more sense, but can’t be used more than once breaking stubbing
    addPrisonerInvolvementsPage.selectRole('ACTIVE_INVOLVEMENT')
    addPrisonerInvolvementsPage.enterComment('Attempted to escape')
    // report is about to be updated…
    reportWithDetails = {
      ...reportWithDetails,
      prisonerInvolvementDone: true,
      prisonersInvolved: [
        {
          prisonerNumber: andrew.prisonerNumber,
          firstName: andrew.firstName,
          lastName: andrew.lastName,
          prisonerRole: 'ACTIVE_INVOLVEMENT',
          outcome: null,
          comment: 'Attempted to escape',
        },
      ],
    }
    stubReport()
    cy.task('stubIncidentReportingApiCreateRelatedObject', {
      urlSlug: RelatedObjectUrlSlug.prisonersInvolved,
      reportId: reportWithDetails.id,
      request: {
        prisonerNumber: andrew.prisonerNumber,
        firstName: andrew.firstName,
        lastName: andrew.lastName,
        prisonerRole: 'ACTIVE_INVOLVEMENT',
        outcome: null,
        comment: 'Attempted to escape',
      },
      response: reportWithDetails.prisonersInvolved,
    })
    cy.task('stubPrisonApiMockPrison', moorland)
    cy.task('stubIncidentReportingApiUpdateReport', {
      request: { title: 'Attempted escape from establishment: Arnold A1111AA (Moorland (HMP & YOI))' },
      report: reportWithDetails, // technically, missing title update
    })
    addPrisonerInvolvementsPage.submit()

    // choose to add no further prisoners
    prisonerInvolvementsPage = Page.verifyOnPage(PrisonerInvolvementsPage, true)
    prisonerInvolvementsPage.selectRadioButton('No')
    prisonerInvolvementsPage.submit()

    // choose to add a member of staff
    let staffInvolvementsPage = Page.verifyOnPage(StaffInvolvementsPage, false)
    staffInvolvementsPage.selectRadioButton('Yes')
    staffInvolvementsPage.submit()

    // search for Mary Johnson
    let staffSearchPage = Page.verifyOnPage(StaffSearchPage)
    staffSearchPage.enterQuery('Mary Johnson')
    const prisonUserMary: UsersSearchResult = {
      username: staffMary.username,
      firstName: staffMary.firstName,
      lastName: staffMary.lastName,
      email: 'mary@dps.local',
      activeCaseload: { id: 'MDI', name: moorland.description },
    }
    cy.task('stubSearchUsers', {
      query: 'Mary Johnson',
      results: [prisonUserMary],
    })
    staffSearchPage.submit()
    staffSearchPage = Page.verifyOnPage(StaffSearchPage, { found: true })
    cy.task('stubManageKnownPrisonUser', prisonUserMary)
    staffSearchPage.selectLink(0).click()

    // enter involvement details
    const addStaffInvolvementsPage = Page.verifyOnPage(AddStaffInvolvementsPage, 'Mary Johnson', 'Mary Johnson’s')
    addStaffInvolvementsPage.selectRole('FIRST_ON_SCENE')
    addStaffInvolvementsPage.enterComment('Mary spotted Arnold')
    // report is about to be updated…
    reportWithDetails = {
      ...reportWithDetails,
      staffInvolvementDone: true,
      staffInvolved: [
        {
          staffUsername: staffMary.username,
          firstName: staffMary.firstName,
          lastName: staffMary.lastName,
          staffRole: 'FIRST_ON_SCENE',
          comment: 'Mary spotted Arnold',
        },
      ],
    }
    cy.task('stubIncidentReportingApiCreateRelatedObject', {
      urlSlug: RelatedObjectUrlSlug.staffInvolved,
      reportId: reportWithDetails.id,
      request: {
        staffUsername: staffMary.username,
        firstName: staffMary.firstName,
        lastName: staffMary.lastName,
        staffRole: 'FIRST_ON_SCENE',
        comment: 'Mary spotted Arnold',
      },
      response: reportWithDetails.staffInvolved,
    })
    stubReport()
    addStaffInvolvementsPage.submit()

    // choose to add no further staff
    staffInvolvementsPage = Page.verifyOnPage(StaffInvolvementsPage, true)
    staffInvolvementsPage.selectRadioButton('No')
    staffInvolvementsPage.submit()

    // respond to questions
    let questionPage = Page.verifyOnPage(QuestionPage, [1, 5], 'attempted escape from establishment')

    // page 1
    questionPage.selectResponses('44769', 'No')
    questionPage.selectResponses('44919', 'Investigation internally')
    questionPage.selectResponses('45033', 'No')
    questionPage.selectResponses('44636', 'No')
    questionPage.selectResponses('44749', 'No')
    // report is about to be updated…
    reportWithDetails = {
      ...reportWithDetails,
      questions: questionsPage1,
    }
    cy.task('stubIncidentReportingApiPutQuestions', {
      reportId: reportWithDetails.id,
      request: questionsPage1.map(putQuestionRequest),
      response: reportWithDetails.questions,
    })
    stubReport()
    questionPage.submit()

    // page 2
    questionPage = Page.verifyOnPage(QuestionPage, [6, 6], 'attempted escape from establishment')
    questionPage.selectResponses('44594', 'Reception')
    // report is about to be updated…
    reportWithDetails = {
      ...reportWithDetails,
      questions: [...reportWithDetails.questions, ...questionsPage2],
    }
    cy.task('stubIncidentReportingApiPutQuestions', {
      reportId: reportWithDetails.id,
      request: questionsPage2.map(putQuestionRequest),
      response: reportWithDetails.questions,
    })
    stubReport()
    questionPage.submit()

    // page 3
    questionPage = Page.verifyOnPage(QuestionPage, [7, 7], 'attempted escape from establishment')
    questionPage.selectResponses('44545', 'No')
    // report is about to be updated…
    reportWithDetails = {
      ...reportWithDetails,
      questions: [...reportWithDetails.questions, ...questionsPage3],
    }
    cy.task('stubIncidentReportingApiPutQuestions', {
      reportId: reportWithDetails.id,
      request: questionsPage3.map(putQuestionRequest),
      response: reportWithDetails.questions,
    })
    stubReport()
    questionPage.submit()

    // page 4
    questionPage = Page.verifyOnPage(QuestionPage, [8, 8], 'attempted escape from establishment')
    questionPage.selectResponses('44441', 'No')
    // report is about to be updated…
    reportWithDetails = {
      ...reportWithDetails,
      questions: [...reportWithDetails.questions, ...questionsPage4],
    }
    cy.task('stubIncidentReportingApiPutQuestions', {
      reportId: reportWithDetails.id,
      request: questionsPage4.map(putQuestionRequest),
      response: reportWithDetails.questions,
    })
    stubReport()
    questionPage.submit()

    // page 5
    questionPage = Page.verifyOnPage(QuestionPage, [9, 10], 'attempted escape from establishment')
    questionPage.selectResponses('44746', 'No')
    questionPage.selectResponses('44595', 'No')
    // report is about to be updated…
    reportWithDetails = {
      ...reportWithDetails,
      questions: [...reportWithDetails.questions, ...questionsPage5],
    }
    cy.task('stubIncidentReportingApiPutQuestions', {
      reportId: reportWithDetails.id,
      request: questionsPage5.map(putQuestionRequest),
      response: reportWithDetails.questions,
    })
    stubReport()
    questionPage.submit()

    // page 6
    questionPage = Page.verifyOnPage(QuestionPage, [11, 11], 'attempted escape from establishment')
    questionPage.selectResponses('44983', 'No')
    // report is about to be updated…
    reportWithDetails = {
      ...reportWithDetails,
      questions: [...reportWithDetails.questions, ...questionsPage6],
    }
    cy.task('stubIncidentReportingApiPutQuestions', {
      reportId: reportWithDetails.id,
      request: questionsPage6.map(putQuestionRequest),
      response: reportWithDetails.questions,
    })
    stubReport()
    questionPage.submit()

    // page 7
    questionPage = Page.verifyOnPage(QuestionPage, [12, 12], 'attempted escape from establishment')
    questionPage.selectResponses('44320', 'No')
    // report is about to be updated…
    reportWithDetails = {
      ...reportWithDetails,
      questions: [...reportWithDetails.questions, ...questionsPage7],
    }
    cy.task('stubIncidentReportingApiPutQuestions', {
      reportId: reportWithDetails.id,
      request: questionsPage7.map(putQuestionRequest),
      response: reportWithDetails.questions,
    })
    stubReport()
    questionPage.submit()

    // page 8
    questionPage = Page.verifyOnPage(QuestionPage, [13, 13], 'attempted escape from establishment')
    questionPage.selectResponses('44731', 'No')
    // report is about to be updated…
    reportWithDetails = {
      ...reportWithDetails,
      questions: [...reportWithDetails.questions, ...questionsPage8],
    }
    cy.task('stubIncidentReportingApiPutQuestions', {
      reportId: reportWithDetails.id,
      request: questionsPage8.map(putQuestionRequest),
      response: reportWithDetails.questions,
    })
    stubReport()
    questionPage.submit()

    // page 9
    questionPage = Page.verifyOnPage(QuestionPage, [14, 16], 'attempted escape from establishment')
    questionPage.selectResponses('45073', 'Staff vigilance')
    questionPage.selectResponses('44349', 'Staff intervention')
    questionPage.selectResponses('44447', 'No')
    // report is about to be updated…
    reportWithDetails = {
      ...reportWithDetails,
      questions: [...reportWithDetails.questions, ...questionsPage9],
    }
    cy.task('stubIncidentReportingApiPutQuestions', {
      reportId: reportWithDetails.id,
      request: questionsPage9.map(putQuestionRequest),
      response: reportWithDetails.questions,
    })
    stubReport()
    questionPage.submit()

    // page 10
    questionPage = Page.verifyOnPage(QuestionPage, [17, 17], 'attempted escape from establishment')
    questionPage.selectResponses('44863', 'No')
    // report is about to be updated…
    reportWithDetails = {
      ...reportWithDetails,
      questions: [...reportWithDetails.questions, ...questionsPage10],
    }
    cy.task('stubIncidentReportingApiPutQuestions', {
      reportId: reportWithDetails.id,
      request: questionsPage10.map(putQuestionRequest),
      response: reportWithDetails.questions,
    })
    stubReport()

    // end of questions so prepare for report view
    cy.task('stubPrisonApiMockPrison', moorland)
    cy.task('stubManageKnownUsers')
    questionPage.submit()

    const reportPage = Page.verifyOnPage(ReportPage, '6544', true)

    // report is about to be updated…
    reportWithDetails = {
      ...reportWithDetails,
      status: 'AWAITING_REVIEW',
    }
    cy.task('stubIncidentReportingApiUpdateReport', {
      request: { title: 'Attempted escape from establishment: Arnold A1111AA (Moorland (HMP & YOI))' },
      report: reportWithDetails,
    })
    cy.task('stubIncidentReportingApiChangeReportStatus', {
      request: { newStatus: 'AWAITING_REVIEW' },
      report: reportWithDetails,
    })
    cy.task('stubIncidentReportingApiGetReports')
    reportPage.selectAction('Submit')
    reportPage.continueButton.click()

    const dashboardPage = Page.verifyOnPage(DashboardPage)
    dashboardPage.checkNotificationBannerContent(
      `You have submitted incident report ${reportWithDetails.reportReference}`,
    )
  })
})

/** Question as returned by API */
const apiQuestionResponse = (
  code: string,
  question: string,
  label: string,
  responseCode: string,
  response: string,
  responseLabel: string,
): DatesAsStrings<Question> => ({
  code,
  question,
  label,
  additionalInformation: null,
  responses: [
    {
      code: responseCode,
      response,
      label: responseLabel,
      responseDate: null,
      additionalInformation: null,
      recordedBy: 'user1',
      recordedAt: format.isoDateTime(now),
    },
  ],
})

/** Question as submitted to API */
const putQuestionRequest = (question: DatesAsStrings<Question>): unknown => ({
  ...question,
  responses: question.responses.map(response => {
    const payload = {
      ...response,
    }
    delete payload.recordedAt
    delete payload.recordedBy
    return payload
  }),
})

const questionsPage1 = [
  apiQuestionResponse(
    '44769',
    'WERE THE POLICE INFORMED OF THE INCIDENT',
    'Were the police informed of the incident?',
    '181153',
    'NO',
    'No',
  ),
  apiQuestionResponse(
    '44919',
    'THE INCIDENT IS SUBJECT TO',
    'The incident is subject to',
    '181649',
    'INVESTIGATION INTERNALLY',
    'Investigation internally',
  ),
  apiQuestionResponse(
    '45033',
    'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES',
    'Is any member of staff facing disciplinary charges?',
    '182083',
    'NO',
    'No',
  ),
  apiQuestionResponse(
    '44636',
    'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
    'Is there any media interest in this incident?',
    '180711',
    'NO',
    'No',
  ),
  apiQuestionResponse(
    '44749',
    'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
    'Has the prison service press office been informed?',
    '181103',
    'NO',
    'No',
  ),
]
const questionsPage2 = [
  apiQuestionResponse(
    '44594',
    'WHERE WAS THE PRISONER PRIOR TO THE START OF THE ATTEMPTED ESCAPE',
    'Where was the prisoner prior to the start of the attempted escape?',
    '180586',
    'RECEPTION',
    'Reception',
  ),
]
const questionsPage3 = [
  apiQuestionResponse(
    '44545',
    'DID PRISONER GAIN ACCESS TO THE EXTERNAL PERIMETER',
    'Did prisoner gain access to the external perimeter?',
    '180421',
    'NO',
    'No',
  ),
]
const questionsPage4 = [
  apiQuestionResponse(
    '44441',
    'DID THE PRISONER ATTEMPT TO GAIN ACCESS TO THE EXTERNAL PERIMETER',
    'Did the prisoner attempt to gain access to the external perimeter?',
    '179954',
    'NO',
    'No',
  ),
]
const questionsPage5 = [
  apiQuestionResponse(
    '44746',
    'ARE THE GROUNDS PATROLLED BY DOGS',
    'Are the grounds patrolled by dogs?',
    '181096',
    'NO',
    'No',
  ),
  apiQuestionResponse('44595', 'WAS AN AIRCRAFT INVOLVED', 'Was an aircraft involved?', '180592', 'NO', 'No'),
]
const questionsPage6 = [
  apiQuestionResponse(
    '44983',
    'WAS OUTSIDE ASSISTANCE INVOLVED IN THE ATTEMPTED ESCAPE',
    'Was outside assistance involved in the attempted escape?',
    '181911',
    'NO',
    'No',
  ),
]
const questionsPage7 = [
  apiQuestionResponse('44320', 'WERE ANY WEAPONS USED', 'Were any weapons used?', '179561', 'NO', 'No'),
]
const questionsPage8 = [
  apiQuestionResponse(
    '44731',
    'WERE ANY INJURIES RECEIVED DURING THIS INCIDENT',
    'Were any injuries received during this incident?',
    '181059',
    'NO',
    'No',
  ),
]
const questionsPage9 = [
  apiQuestionResponse(
    '45073',
    'HOW WAS THE ESCAPE ATTEMPT DISCOVERED',
    'How was the escape attempt discovered?',
    '182267',
    'STAFF VIGILANCE',
    'Staff vigilance',
  ),
  apiQuestionResponse(
    '44349',
    'HOW WAS THE ESCAPE ATTEMPT FOILED',
    'How was the escape attempt foiled?',
    '179676',
    'STAFF INTERVENTION',
    'Staff intervention',
  ),
  apiQuestionResponse(
    '44447',
    'WAS DAMAGE CAUSED TO PRISON PROPERTY',
    'Was damage caused to prison property?',
    '179978',
    'NO',
    'No',
  ),
]
const questionsPage10 = [
  apiQuestionResponse(
    '44863',
    'WAS THE TELEPHONE/IT SYSTEM SHUT DOWN DURING THE INCIDENT?',
    'Was the telephone/it system shut down during the incident?',
    '181444',
    'NO',
    'No',
  ),
]
