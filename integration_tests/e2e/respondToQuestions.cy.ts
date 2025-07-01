import type { Response as SuperAgentResponse } from 'superagent'

import { mockReport } from '../../server/data/testData/incidentReporting'
import Page from '../pages/page'
import ReportPage from '../pages/reports/report'
import { QuestionPage } from '../pages/reports/question'

context('Responding to questions', () => {
  const now = new Date()
  const reportWithDetails = mockReport({
    type: 'ATTEMPTED_ESCAPE_FROM_PRISON_1',
    reportReference: '6544',
    reportDateAndTime: now,
    withDetails: true,
  })
  reportWithDetails.prisonersInvolved = []
  reportWithDetails.prisonerInvolvementDone = false
  reportWithDetails.staffInvolved = []
  reportWithDetails.staffInvolvementDone = false
  reportWithDetails.correctionRequests = []

  function mockNoResponses() {
    reportWithDetails.questions = []
  }

  function mockFirstPageResponses() {
    reportWithDetails.questions = [
      // <editor-fold desc="saved responses">
      {
        code: '44769',
        question: 'WERE THE POLICE INFORMED OF THE INCIDENT',
        label: 'Were the police informed of the incident?',
        responses: [
          {
            code: '181153',
            response: 'NO',
            label: 'No',
            responseDate: null,
            additionalInformation: null,
            recordedBy: 'user1',
            recordedAt: now.toISOString(),
          },
        ],
        additionalInformation: null,
      },
      {
        code: '44919',
        question: 'THE INCIDENT IS SUBJECT TO',
        label: 'The incident is subject to',
        responses: [
          {
            code: '181648',
            response: 'INVESTIGATION BY POLICE',
            label: 'Investigation by police',
            responseDate: null,
            additionalInformation: null,
            recordedBy: 'user1',
            recordedAt: now.toISOString(),
          },
          {
            code: '181649',
            response: 'INVESTIGATION INTERNALLY',
            label: 'Investigation internally',
            responseDate: null,
            additionalInformation: null,
            recordedBy: 'user1',
            recordedAt: now.toISOString(),
          },
        ],
        additionalInformation: null,
      },
      {
        code: '45033',
        question: 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES',
        label: 'Is any member of staff facing disciplinary charges?',
        responses: [
          {
            code: '182083',
            response: 'NO',
            label: 'No',
            responseDate: null,
            additionalInformation: null,
            recordedBy: 'user1',
            recordedAt: now.toISOString(),
          },
        ],
        additionalInformation: null,
      },
      {
        code: '44636',
        question: 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
        label: 'Is there any media interest in this incident?',
        responses: [
          {
            code: '180711',
            response: 'NO',
            label: 'No',
            responseDate: null,
            additionalInformation: null,
            recordedBy: 'user1',
            recordedAt: now.toISOString(),
          },
        ],
        additionalInformation: null,
      },
      {
        code: '44749',
        question: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
        label: 'Has the prison service press office been informed?',
        responses: [
          {
            code: '181104',
            response: 'YES',
            label: 'Yes',
            responseDate: '2025-03-19',
            additionalInformation: null,
            recordedBy: 'user1',
            recordedAt: now.toISOString(),
          },
        ],
        additionalInformation: null,
      },
      // </editor-fold>
    ]
  }

  beforeEach(() => {
    cy.resetBasicStubs()

    cy.signIn()
    cy.task('stubPrisonApiMockPrisons')
    cy.task('stubManageKnownUsers')
  })

  function checkFirstPage(): QuestionPage {
    const questionPage = Page.verifyOnPage(QuestionPage, [1, 5], 'attempted escape from establishment')
    questionPage.questionTitles.should('deep.equal', [
      '1. Were the police informed of the incident?',
      '2. The incident is subject to',
      '3. Is any member of staff facing disciplinary charges?',
      '4. Is there any media interest in this incident?',
      '5. Has the prison service press office been informed?',
    ])
    return questionPage
  }

  function checkSecondPage(): QuestionPage {
    const questionPage = Page.verifyOnPage(QuestionPage, [6, 6], 'attempted escape from establishment')
    questionPage.questionTitles.should('deep.equal', [
      '6. Where was the prisoner prior to the start of the attempted escape?',
    ])
    return questionPage
  }

  context('when no questions have been answered', () => {
    let getReportWithDetailsByIdStubId: string

    beforeEach(() => {
      mockNoResponses()
      cy.task('stubIncidentReportingApiGetReportWithDetailsById', { report: reportWithDetails }).then(
        (res: SuperAgentResponse) => {
          getReportWithDetailsByIdStubId = JSON.parse(res.text).id
        },
      )
    })

    it('should allow clicking through to the first page of questions', () => {
      cy.visit(`/reports/${reportWithDetails.id}`)
      const reportPage = Page.verifyOnPage(ReportPage, '6544', true)
      reportPage.clickThroughToQuestionPage(0, 'Continue', 'attempted escape from establishment')
      checkFirstPage()
    })

    it('should automatically redirect to the first page of questions', () => {
      cy.visit(`/reports/${reportWithDetails.id}/questions`)
      checkFirstPage()
    })

    it('should not allow going to later question pages', () => {
      cy.visit(`/reports/${reportWithDetails.id}/questions/44594`) // page 2 redirects
      checkFirstPage()
    })

    it('should allow submitting whole page of responses', () => {
      cy.visit(`/reports/${reportWithDetails.id}/questions/44769`)
      const questionPage = Page.verifyOnPage(QuestionPage, [1, 5], 'attempted escape from establishment')

      questionPage.selectResponses('44769', 'No')
      questionPage.selectResponses('44919', 'Investigation by police', 'Investigation internally')
      questionPage.selectResponses('45033', 'No')
      questionPage.selectResponses('44636', 'No')
      questionPage.selectResponses('44749', 'Yes')
      questionPage.enterDate('44749', '181104', '19/3/2025')

      cy.task('deleteStub', getReportWithDetailsByIdStubId)
      mockFirstPageResponses()
      cy.task('stubIncidentReportingApiGetReportWithDetailsById', { report: reportWithDetails })
      cy.task('stubIncidentReportingApiPutQuestions', {
        reportId: reportWithDetails.id,
        request: [
          // <editor-fold desc="expected response">
          {
            code: '44769',
            question: 'WERE THE POLICE INFORMED OF THE INCIDENT',
            label: 'Were the police informed of the incident?',
            additionalInformation: null,
            responses: [
              {
                response: 'NO',
                code: '181153',
                responseDate: null,
                additionalInformation: null,
              },
            ],
          },
          {
            code: '44919',
            question: 'THE INCIDENT IS SUBJECT TO',
            label: 'The incident is subject to',
            additionalInformation: null,
            responses: [
              {
                response: 'INVESTIGATION BY POLICE',
                code: '181648',
                responseDate: null,
                additionalInformation: null,
              },
              {
                response: 'INVESTIGATION INTERNALLY',
                code: '181649',
                responseDate: null,
                additionalInformation: null,
              },
            ],
          },
          {
            code: '45033',
            question: 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES',
            label: 'Is any member of staff facing disciplinary charges?',
            additionalInformation: null,
            responses: [
              {
                response: 'NO',
                code: '182083',
                responseDate: null,
                additionalInformation: null,
              },
            ],
          },
          {
            code: '44636',
            question: 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
            label: 'Is there any media interest in this incident?',
            additionalInformation: null,
            responses: [
              {
                response: 'NO',
                code: '180711',
                responseDate: null,
                additionalInformation: null,
              },
            ],
          },
          {
            code: '44749',
            question: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
            label: 'Has the prison service press office been informed?',
            additionalInformation: null,
            responses: [
              {
                response: 'YES',
                code: '181104',
                responseDate: '2025-03-19',
                additionalInformation: null,
              },
            ],
          },
          // </editor-fold>
        ],
        response: [], // technically, missing new questions & responses
      })
      questionPage.submit()

      checkSecondPage()
    })

    it('should show an error if a single-response question is missed', () => {
      cy.visit(`/reports/${reportWithDetails.id}/questions/44769`)
      const questionPage = Page.verifyOnPage(QuestionPage, [1, 5], 'attempted escape from establishment')

      questionPage.selectResponses('44769', 'No')
      questionPage.selectResponses('44919', 'Investigation by police', 'Investigation internally')
      questionPage.selectResponses('45033', 'No')
      questionPage.selectResponses('44636', 'No')
      // 44749 is missing
      questionPage.submit()

      Page.verifyOnPage(QuestionPage, [1, 5], 'attempted escape from establishment')
      questionPage.errorSummary.contains('There is a problem')
      questionPage.errorSummary.contains('Select an answer for ‘Has the prison service press office been informed?’')
    })

    it('should show an error if a multi-response question is missed', () => {
      cy.visit(`/reports/${reportWithDetails.id}/questions/44769`)
      const questionPage = Page.verifyOnPage(QuestionPage, [1, 5], 'attempted escape from establishment')

      questionPage.selectResponses('44769', 'No')
      questionPage.selectResponses('45033', 'No')
      questionPage.selectResponses('44636', 'No')
      questionPage.selectResponses('44749', 'No')
      // 44919 is missing
      questionPage.submit()

      Page.verifyOnPage(QuestionPage, [1, 5], 'attempted escape from establishment')
      questionPage.errorSummary.contains('There is a problem')
      questionPage.errorSummary.contains('Select one or more options for ‘The incident is subject to’')
    })

    it('should show an error if a required date is missing', () => {
      cy.visit(`/reports/${reportWithDetails.id}/questions/44769`)
      const questionPage = Page.verifyOnPage(QuestionPage, [1, 5], 'attempted escape from establishment')

      questionPage.selectResponses('44769', 'No')
      questionPage.selectResponses('44919', 'Investigation by police', 'Investigation internally')
      questionPage.selectResponses('45033', 'No')
      questionPage.selectResponses('44636', 'No')
      questionPage.selectResponses('44749', 'Yes') // response requiring date
      questionPage.submit()

      Page.verifyOnPage(QuestionPage, [1, 5], 'attempted escape from establishment')
      questionPage.errorSummary.contains('There is a problem')
      questionPage.errorSummary.contains('Enter a date for ‘Has the prison service press office been informed?’')
    })
  })

  context('when first page of questions has been answered', () => {
    beforeEach(() => {
      mockFirstPageResponses()
      cy.task('stubIncidentReportingApiGetReportWithDetailsById', { report: reportWithDetails })
    })

    it('should allow clicking through to the first page of questions', () => {
      cy.visit(`/reports/${reportWithDetails.id}`)
      const reportPage = Page.verifyOnPage(ReportPage, '6544', true)
      reportPage.clickThroughToQuestionPage(0, 'Change', 'attempted escape from establishment')
      const questionPage = checkFirstPage()

      // page should be prefilled with existing responses
      questionPage.formValues.should('deep.include', {
        '44769': ['NO'],
        '44919': ['INVESTIGATION BY POLICE', 'INVESTIGATION INTERNALLY'],
        '45033': ['NO'],
        '44636': ['NO'],
        '44749': ['YES'],
        '44749-181104-date': ['19/3/2025'],
      })
    })

    it('should allow clicking through to the first page of questions via a different question', () => {
      cy.visit(`/reports/${reportWithDetails.id}`)
      const reportPage = Page.verifyOnPage(ReportPage, '6544', true)
      reportPage.clickThroughToQuestionPage(1, 'Change', 'attempted escape from establishment')
      checkFirstPage()
    })

    it('should automatically redirect to the first page of questions', () => {
      cy.visit(`/reports/${reportWithDetails.id}/questions`)
      checkFirstPage()
    })

    it('should allow clicking through to the second page of questions', () => {
      cy.visit(`/reports/${reportWithDetails.id}`)
      const reportPage = Page.verifyOnPage(ReportPage, '6544', true)
      reportPage.clickThroughToQuestionPage(5, 'Continue', 'attempted escape from establishment')
      checkSecondPage()
    })

    it('should allow going directly to the second page of questions', () => {
      cy.visit(`/reports/${reportWithDetails.id}/questions/44594`)
      checkSecondPage()
    })

    it('should allow submitting whole first page of responses', () => {
      cy.visit(`/reports/${reportWithDetails.id}/questions/44769`)
      const questionPage = Page.verifyOnPage(QuestionPage, [1, 5], 'attempted escape from establishment')

      questionPage.selectResponses('44769', 'No')
      questionPage.selectResponses('44919', 'Investigation by police', 'No investigation')
      questionPage.selectResponses('45033', 'No')
      questionPage.selectResponses('44636', 'No')
      questionPage.selectResponses('44749', 'Yes')
      questionPage.enterDate('44749', '181104', '19/3/2025')

      cy.task('stubIncidentReportingApiPutQuestions', {
        reportId: reportWithDetails.id,
        request: [
          // <editor-fold desc="expected response">
          {
            code: '44769',
            question: 'WERE THE POLICE INFORMED OF THE INCIDENT',
            label: 'Were the police informed of the incident?',
            additionalInformation: null,
            responses: [
              {
                response: 'NO',
                code: '181153',
                responseDate: null,
                additionalInformation: null,
              },
            ],
          },
          {
            code: '44919',
            question: 'THE INCIDENT IS SUBJECT TO',
            label: 'The incident is subject to',
            additionalInformation: null,
            responses: [
              {
                response: 'INVESTIGATION INTERNALLY',
                code: '181649',
                responseDate: null,
                additionalInformation: null,
              },
              {
                response: 'NO INVESTIGATION',
                code: '181650',
                responseDate: null,
                additionalInformation: null,
              },
            ],
          },
          {
            code: '45033',
            question: 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES',
            label: 'Is any member of staff facing disciplinary charges?',
            additionalInformation: null,
            responses: [
              {
                response: 'NO',
                code: '182083',
                responseDate: null,
                additionalInformation: null,
              },
            ],
          },
          {
            code: '44636',
            question: 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
            label: 'Is there any media interest in this incident?',
            additionalInformation: null,
            responses: [
              {
                response: 'NO',
                code: '180711',
                responseDate: null,
                additionalInformation: null,
              },
            ],
          },
          {
            code: '44749',
            question: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
            label: 'Has the prison service press office been informed?',
            additionalInformation: null,
            responses: [
              {
                response: 'YES',
                code: '181104',
                responseDate: '2025-03-19',
                additionalInformation: null,
              },
            ],
          },
          // </editor-fold>
        ],
        response: reportWithDetails.questions, // technically, missing changed 44919
      })
      questionPage.submit()

      checkSecondPage()
    })

    it('should show an error if a required comment is missing', () => {
      cy.visit(`/reports/${reportWithDetails.id}/questions/44594`)
      const questionPage = Page.verifyOnPage(QuestionPage, [6, 6], 'attempted escape from establishment')

      questionPage.selectResponses('44594', 'Other secure area') // response requiring comment
      questionPage.submit()

      Page.verifyOnPage(QuestionPage, [6, 6], 'attempted escape from establishment')
      questionPage.errorSummary.contains('There is a problem')
      questionPage.errorSummary.contains(
        'Enter a comment for ‘Where was the prisoner prior to the start of the attempted escape?’',
      )
    })
  })
})
