import type { Response as SuperAgentResponse } from 'superagent'

import { mockReport } from '../../server/data/testData/incidentReporting'
import Page from '../pages/page'
import ReportPage from '../pages/reports/report'
import { QuestionPage } from '../pages/reports/question'

context('Responding to questions', () => {
  const now = new Date()
  const reportWithDetails = mockReport({
    type: 'ATTEMPTED_ESCAPE_FROM_CUSTODY',
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
        responses: [
          {
            response: 'NO',
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
        responses: [
          {
            response: 'INVESTIGATION BY POLICE',
            responseDate: null,
            additionalInformation: null,
            recordedBy: 'user1',
            recordedAt: now.toISOString(),
          },
          {
            response: 'INVESTIGATION INTERNALLY',
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
        responses: [
          {
            response: 'NO',
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
        responses: [
          {
            response: 'NO',
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
        responses: [
          {
            response: 'YES',
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
    const questionPage = Page.verifyOnPage(QuestionPage, [1, 5])
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
    const questionPage = Page.verifyOnPage(QuestionPage, [6, 6])
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
      reportPage.clickThroughToQuestionPage(0, 'Continue')
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
      const questionPage = Page.verifyOnPage(QuestionPage, [1, 5])

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
            additionalInformation: null,
            responses: [
              {
                response: 'NO',
                responseDate: null,
                additionalInformation: null,
              },
            ],
          },
          {
            code: '44919',
            question: 'THE INCIDENT IS SUBJECT TO',
            additionalInformation: null,
            responses: [
              {
                response: 'INVESTIGATION BY POLICE',
                responseDate: null,
                additionalInformation: null,
              },
              {
                response: 'INVESTIGATION INTERNALLY',
                responseDate: null,
                additionalInformation: null,
              },
            ],
          },
          {
            code: '45033',
            question: 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES',
            additionalInformation: null,
            responses: [
              {
                response: 'NO',
                responseDate: null,
                additionalInformation: null,
              },
            ],
          },
          {
            code: '44636',
            question: 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
            additionalInformation: null,
            responses: [
              {
                response: 'NO',
                responseDate: null,
                additionalInformation: null,
              },
            ],
          },
          {
            code: '44749',
            question: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
            additionalInformation: null,
            responses: [
              {
                response: 'YES',
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
      const questionPage = Page.verifyOnPage(QuestionPage, [1, 5])

      questionPage.selectResponses('44769', 'No')
      questionPage.selectResponses('44919', 'Investigation by police', 'Investigation internally')
      questionPage.selectResponses('45033', 'No')
      questionPage.selectResponses('44636', 'No')
      // 44749 is missing
      questionPage.submit()

      Page.verifyOnPage(QuestionPage, [1, 5])
      questionPage.errorSummary.contains('There is a problem')
    })

    it('should show an error if a multi-response question is missed', () => {
      cy.visit(`/reports/${reportWithDetails.id}/questions/44769`)
      const questionPage = Page.verifyOnPage(QuestionPage, [1, 5])

      questionPage.selectResponses('44769', 'No')
      questionPage.selectResponses('45033', 'No')
      questionPage.selectResponses('44636', 'No')
      questionPage.selectResponses('44749', 'No')
      // 44919 is missing
      questionPage.submit()

      Page.verifyOnPage(QuestionPage, [1, 5])
      questionPage.errorSummary.contains('There is a problem')
    })

    it('should show an error if a required date is missing', () => {
      cy.visit(`/reports/${reportWithDetails.id}/questions/44769`)
      const questionPage = Page.verifyOnPage(QuestionPage, [1, 5])

      questionPage.selectResponses('44769', 'No')
      questionPage.selectResponses('44919', 'Investigation by police', 'Investigation internally')
      questionPage.selectResponses('45033', 'No')
      questionPage.selectResponses('44636', 'No')
      questionPage.selectResponses('44749', 'Yes') // response requiring date
      questionPage.submit()

      Page.verifyOnPage(QuestionPage, [1, 5])
      questionPage.errorSummary.contains('There is a problem')
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
      reportPage.clickThroughToQuestionPage(0, 'Change')
      const questionPage = checkFirstPage()

      // page should be prefilled with existing responses
      questionPage.formValues.should('deep.include', {
        '44769': ['NO'],
        '44919': ['INVESTIGATION BY POLICE', 'INVESTIGATION INTERNALLY'],
        '45033': ['NO'],
        '44636': ['NO'],
        '44749': ['YES'],
        '44749-181104-date': ['19/03/2025'],
      })
    })

    it('should allow clicking through to the first page of questions via a different question', () => {
      cy.visit(`/reports/${reportWithDetails.id}`)
      const reportPage = Page.verifyOnPage(ReportPage, '6544', true)
      reportPage.clickThroughToQuestionPage(1, 'Change')
      checkFirstPage()
    })

    it('should automatically redirect to the first page of questions', () => {
      cy.visit(`/reports/${reportWithDetails.id}/questions`)
      checkFirstPage()
    })

    it('should allow clicking through to the second page of questions', () => {
      cy.visit(`/reports/${reportWithDetails.id}`)
      const reportPage = Page.verifyOnPage(ReportPage, '6544', true)
      reportPage.clickThroughToQuestionPage(5, 'Continue')
      checkSecondPage()
    })

    it('should allow going directly to the second page of questions', () => {
      cy.visit(`/reports/${reportWithDetails.id}/questions/44594`)
      checkSecondPage()
    })

    it('should allow submitting whole first page of responses', () => {
      cy.visit(`/reports/${reportWithDetails.id}/questions/44769`)
      const questionPage = Page.verifyOnPage(QuestionPage, [1, 5])

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
            additionalInformation: null,
            responses: [
              {
                response: 'NO',
                responseDate: null,
                additionalInformation: null,
              },
            ],
          },
          {
            code: '44919',
            question: 'THE INCIDENT IS SUBJECT TO',
            additionalInformation: null,
            responses: [
              {
                response: 'INVESTIGATION INTERNALLY',
                responseDate: null,
                additionalInformation: null,
              },
              {
                response: 'NO INVESTIGATION',
                responseDate: null,
                additionalInformation: null,
              },
            ],
          },
          {
            code: '45033',
            question: 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES',
            additionalInformation: null,
            responses: [
              {
                response: 'NO',
                responseDate: null,
                additionalInformation: null,
              },
            ],
          },
          {
            code: '44636',
            question: 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
            additionalInformation: null,
            responses: [
              {
                response: 'NO',
                responseDate: null,
                additionalInformation: null,
              },
            ],
          },
          {
            code: '44749',
            question: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
            additionalInformation: null,
            responses: [
              {
                response: 'YES',
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
      const questionPage = Page.verifyOnPage(QuestionPage, [6, 6])

      questionPage.selectResponses('44594', 'Other secure area') // response requiring comment
      questionPage.submit()

      Page.verifyOnPage(QuestionPage, [6, 6])
      questionPage.errorSummary.contains('There is a problem')
    })
  })
})
