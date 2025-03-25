import type { Express } from 'express'
import request, { type Agent } from 'supertest'

import { parseDateInput } from '../../../utils/utils'
import { appWithAllRoutes } from '../../testutils/appSetup'
import { now } from '../../../testutils/fakeClock'
import {
  type AddOrUpdateQuestionWithResponsesRequest,
  IncidentReportingApi,
  type Question,
  type ReportWithDetails,
} from '../../../data/incidentReportingApi'
import { convertReportWithDetailsDates } from '../../../data/incidentReportingApiUtils'
import { mockErrorResponse, mockReport } from '../../../data/testData/incidentReporting'
import { makeSimpleQuestion } from '../../../data/testData/incidentReportingJest'
import { mockThrownError } from '../../../data/testData/thrownErrors'
import { approverUser, hqUser, reportingUser, unauthorisedUser } from '../../../data/testData/users'
import ASSAULT from '../../../reportConfiguration/types/ASSAULT'
import ATTEMPTED_ESCAPE_FROM_CUSTODY from '../../../reportConfiguration/types/ATTEMPTED_ESCAPE_FROM_CUSTODY'
import DEATH_OTHER from '../../../reportConfiguration/types/DEATH_OTHER'
import FINDS from '../../../reportConfiguration/types/FINDS'

jest.mock('../../../data/incidentReportingApi')

let app: Express
let incidentReportingApi: jest.Mocked<IncidentReportingApi>

beforeEach(() => {
  app = appWithAllRoutes()
  incidentReportingApi = IncidentReportingApi.prototype as jest.Mocked<IncidentReportingApi>
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Displaying questions and responses', () => {
  let agent: Agent

  // Report type/answers updated in each test
  let reportWithDetails: ReportWithDetails

  beforeEach(() => {
    agent = request.agent(app)

    reportWithDetails = convertReportWithDetailsDates(
      mockReport({
        type: 'FINDS',
        reportReference: '6544',
        reportDateAndTime: now,
        withDetails: true,
      }),
    )
    reportWithDetails.questions = []
    incidentReportingApi.getReportWithDetailsById.mockResolvedValue(reportWithDetails)
  })

  function reportQuestionsUrl(createJourney: boolean): string {
    if (createJourney) {
      return `/create-report/${reportWithDetails.id}/questions`
    }
    return `/reports/${reportWithDetails.id}/questions`
  }

  describe.each([
    { scenario: 'during create journey', createJourney: true },
    { scenario: 'normally', createJourney: false },
  ])('$scenario', ({ createJourney }) => {
    it('should 404 if report is not found', () => {
      const error = mockThrownError(mockErrorResponse({ status: 404, message: 'Report not found' }), 404)
      incidentReportingApi.getReportWithDetailsById.mockReset()
      incidentReportingApi.getReportWithDetailsById.mockRejectedValueOnce(error)

      return agent
        .get(reportQuestionsUrl(createJourney))
        .redirects(1)
        .expect(404)
        .expect(res => {
          expect(res.text).toContain('Page not found')
        })
    })

    it('should 404 if report’s incident type is inactive', () => {
      reportWithDetails.type = 'DAMAGE'
      return agent
        .get(reportQuestionsUrl(createJourney))
        .redirects(1)
        .expect(404)
        .expect(res => {
          expect(res.text).toContain('Page not found')
        })
    })

    it('form is prefilled with report answers, including date', () => {
      reportWithDetails.type = 'DEATH_OTHER'
      reportWithDetails.questions = [
        {
          code: '45054',
          question: 'WERE THE POLICE INFORMED OF THE INCIDENT',
          additionalInformation: null,
          responses: [
            {
              response: 'YES',
              responseDate: now,
              additionalInformation: null,
              recordedBy: 'USER1',
              recordedAt: new Date(),
            },
          ],
        },
      ]

      return agent
        .get(reportQuestionsUrl(createJourney))
        .redirects(1)
        .expect(200)
        .expect(res => {
          expect(fieldNames(res.text)).toEqual(['45054'])
          expect(res.text).not.toContain('There is a problem')
          // 'YES' response to '45054' requires a date, this is displayed
          expect(res.text).toContain('name="45054-182204-date" type="text" value="05/12/2023"')
          expect(res.text).toContain('name="45054" type="radio" value="YES" checked')
        })
    })

    it('form is prefilled with report answers, multiple choices are selected', () => {
      reportWithDetails.type = 'FINDS'
      reportWithDetails.questions = [
        makeSimpleQuestion(
          '67179',
          'DESCRIBE HOW THE ITEM WAS FOUND (SELECT ALL THAT APPLY)',
          'BOSS CHAIR',
          'DOG SEARCH',
        ),
        makeSimpleQuestion('67180', 'IS THE LOCATION OF THE INCIDENT KNOWN?', 'NO'),
      ]

      return agent
        .get(reportQuestionsUrl(createJourney))
        .redirects(1)
        .expect(200)
        .expect(res => {
          expect(fieldNames(res.text)).toEqual(['67179'])
          expect(res.text).not.toContain('There is a problem')
          expect(res.text).toContain('value="BOSS CHAIR" checked')
          expect(res.text).toContain('value="DOG SEARCH" checked')
        })
    })

    it('form is prefilled with report answers, multiple questions answered', () => {
      reportWithDetails.type = 'ASSAULT'
      reportWithDetails.questions = [
        makeSimpleQuestion('61279', 'WHAT WAS THE MAIN MANAGEMENT OUTCOME OF THE INCIDENT', 'POLICE REFERRAL'),
        makeSimpleQuestion('61280', 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES', 'NO'),
        makeSimpleQuestion('61281', 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT', 'NO'),
        makeSimpleQuestion('61282', 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED', 'NO'),
        makeSimpleQuestion('61283', 'IS THE LOCATION OF THE INCDENT KNOWN', 'YES'),
      ]

      return agent
        .get(reportQuestionsUrl(createJourney))
        .redirects(1)
        .expect(200)
        .expect(res => {
          expect(res.text).not.toContain('There is a problem')
          expect(fieldNames(res.text)).toEqual(['61279', '61280', '61281', '61282', '61283'])
          expect(res.text).toContain('name="61279" type="radio" value="POLICE REFERRAL" checked')
          expect(res.text).toContain('name="61280" type="radio" value="NO" checked')
          expect(res.text).toContain('name="61281" type="radio" value="NO" checked')
          expect(res.text).toContain('name="61282" type="radio" value="NO" checked')
          expect(res.text).toContain('name="61283" type="radio" value="YES" checked')
        })
    })

    describe('Page titles and question numbering', () => {
      it('should show question numbers on first page', () => {
        reportWithDetails.type = 'ATTEMPTED_ESCAPE_FROM_CUSTODY'
        return agent
          .get(reportQuestionsUrl(createJourney))
          .redirects(1)
          .expect(res => {
            expect(res.text).toContain('1. Were the police informed of the incident?')
            expect(res.text).toContain('2. The incident is subject to')
            expect(res.text).toContain('3. Is any member of staff facing disciplinary charges?')
            expect(res.text).toContain('4. Is there any media interest in this incident?')
            expect(res.text).toContain('5. Has the prison service press office been informed?')

            if (createJourney) {
              // back link points to staff involvements
              expect(res.text).toContain(`"/create-report/${reportWithDetails.id}/staff"`)
            } else {
              // back link points to report
              expect(res.text).toContain(`"/reports/${reportWithDetails.id}"`)
            }
          })
      })

      it('should show question numbers on second page', async () => {
        const questionsResponse: Question[] = [
          makeSimpleQuestion('44769', 'WERE THE POLICE INFORMED OF THE INCIDENT', 'NO'),
          makeSimpleQuestion('44919', 'THE INCIDENT IS SUBJECT TO', 'INVESTIGATION INTERNALLY'),
          makeSimpleQuestion('45033', 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES', 'NO'),
          makeSimpleQuestion('44636', 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT', 'NO'),
          makeSimpleQuestion('44749', 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED', 'NO'),
        ]
        reportWithDetails.type = 'ATTEMPTED_ESCAPE_FROM_CUSTODY'
        reportWithDetails.questions = questionsResponse
        incidentReportingApi.addOrUpdateQuestionsWithResponses.mockResolvedValueOnce(questionsResponse)

        await agent
          .get(reportQuestionsUrl(createJourney))
          .redirects(1)
          .expect(res => {
            expect(res.redirects.at(-1)).toMatch(/\/44769$/)
          })
        await agent
          .post(`${reportQuestionsUrl(createJourney)}/44769`)
          .send({
            '44769': ['NO'],
            '44919': ['INVESTIGATION INTERNALLY'],
            '45033': ['NO'],
            '44636': ['NO'],
            '44749': ['NO'],
          })
          .redirects(1)
          .expect(res => {
            expect(res.redirects.at(-1)).toMatch(/\/44594$/)
          })

        return agent
          .get(`${reportQuestionsUrl(createJourney)}/44594`)
          .redirects(1)
          .expect(res => {
            expect(res.text).toContain('6. Where was the prisoner prior to the start of the attempted escape?')

            // back link points to previous page
            if (createJourney) {
              expect(res.text).toContain(`"/create-report/${reportWithDetails.id}/questions/44769"`)
            } else {
              expect(res.text).toContain(`"/reports/${reportWithDetails.id}/questions/44769"`)
            }
          })
      })

      it('should show correct title for first page with one question', () => {
        return agent
          .get(reportQuestionsUrl(createJourney))
          .redirects(1)
          .expect(res => {
            expect(res.text).toContain('About the incident – question 1')
          })
      })

      it('should show correct title for a later page with one question', async () => {
        const questionsResponse: Question[] = [
          {
            code: '67179',
            question: 'DESCRIBE HOW THE ITEM WAS FOUND (SELECT ALL THAT APPLY)',
            additionalInformation: null,
            responses: [
              {
                response: 'CELL SEARCH',
                responseDate: null,
                additionalInformation: null,
                recordedBy: 'USER_1',
                recordedAt: new Date(),
              },
            ],
          },
        ]
        reportWithDetails.questions = questionsResponse
        incidentReportingApi.addOrUpdateQuestionsWithResponses.mockResolvedValueOnce(questionsResponse)

        await agent
          .get(reportQuestionsUrl(createJourney))
          .redirects(1)
          .expect(res => {
            expect(res.redirects.at(-1)).toMatch(/\/67179$/)
          })
        await agent
          .post(`${reportQuestionsUrl(createJourney)}/67179`)
          .send({
            '67179': ['CELL SEARCH'],
          })
          .redirects(1)
          .expect(res => {
            expect(res.redirects.at(-1)).toMatch(/\/67180$/)
          })

        return agent
          .get(`${reportQuestionsUrl(createJourney)}/67180`)
          .expect(200)
          .expect(res => {
            expect(res.text).toContain('About the incident – question 2')
          })
      })

      it('should show correct title for a page with several questions', () => {
        reportWithDetails.type = 'ATTEMPTED_ESCAPE_FROM_CUSTODY'
        incidentReportingApi.addOrUpdateQuestionsWithResponses.mockResolvedValueOnce([])
        return agent
          .get(reportQuestionsUrl(createJourney))
          .redirects(1)
          .expect(res => {
            expect(res.text).toContain('About the incident – questions 1 to 5')
          })
      })
    })

    describe('Moving between question pages', () => {
      it.each([
        { scenario: 'no responses so far', someResponses: false },
        { scenario: 'some responses have been entered', someResponses: true },
      ])(
        'should redirect to first page of questions from form wizard entrypoint when $scenario',
        ({ someResponses }) => {
          reportWithDetails.type = 'FINDS'
          reportWithDetails.questions = someResponses
            ? [makeSimpleQuestion('67179', 'DESCRIBE HOW THE ITEM WAS FOUND (SELECT ALL THAT APPLY)', 'CELL SEARCH')]
            : []
          return agent
            .get(reportQuestionsUrl(createJourney))
            .redirects(1)
            .expect(200)
            .expect(res => {
              expect(res.redirects.at(-1)).toMatch(/\/questions\/67179$/)
            })
        },
      )

      it.each(['67179', '67180'])(
        'should allow skipping directly to any page that has been started (sample question %d)',
        answeredQuestionId => {
          reportWithDetails.type = 'FINDS'
          reportWithDetails.questions = [
            makeSimpleQuestion('67179', 'DESCRIBE HOW THE ITEM WAS FOUND (SELECT ALL THAT APPLY)', 'CELL SEARCH'),
            makeSimpleQuestion('67180', 'IS THE LOCATION OF THE INCIDENT KNOWN?', 'NO'),
          ]
          return agent
            .get(`${reportQuestionsUrl(createJourney)}/${answeredQuestionId}`)
            .redirects(10)
            .expect(200)
            .expect(res => {
              expect(res.redirects).toEqual([])
            })
        },
      )

      it('should allow skipping directly to the next page after existing responses', () => {
        reportWithDetails.type = 'FINDS'
        reportWithDetails.questions = [
          makeSimpleQuestion('67179', 'DESCRIBE HOW THE ITEM WAS FOUND (SELECT ALL THAT APPLY)', 'CELL SEARCH'),
          makeSimpleQuestion('67180', 'IS THE LOCATION OF THE INCIDENT KNOWN?', 'NO'),
        ]
        return agent
          .get(`${reportQuestionsUrl(createJourney)}/67182`)
          .redirects(10)
          .expect(200)
          .expect(res => {
            expect(res.redirects).toEqual([])
          })
      })

      it('should redirect to first page of questions if one tries to skip ahead', () => {
        reportWithDetails.type = 'FINDS'
        reportWithDetails.questions = [
          makeSimpleQuestion('67179', 'DESCRIBE HOW THE ITEM WAS FOUND (SELECT ALL THAT APPLY)', 'CELL SEARCH'),
          makeSimpleQuestion('67180', 'IS THE LOCATION OF THE INCIDENT KNOWN?', 'NO'),
        ]
        return agent
          .get(`${reportQuestionsUrl(createJourney)}/67184`)
          .redirects(10)
          .expect(200)
          .expect(res => {
            expect(res.redirects.at(-1)).toMatch(/\/questions\/67179$/)
          })
      })
    })
  })
})

describe('Submitting questions’ responses', () => {
  let agent: Agent

  // Report type/answers updated in each test
  const reportWithDetails: ReportWithDetails = convertReportWithDetailsDates(
    mockReport({
      type: 'FINDS',
      reportReference: '6544',
      reportDateAndTime: now,
      withDetails: true,
    }),
  )
  reportWithDetails.questions = []

  beforeEach(() => {
    agent = request.agent(app)
    incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(reportWithDetails)
  })

  function reportQuestionsUrl(createJourney: boolean): string {
    if (createJourney) {
      return `/create-report/${reportWithDetails.id}/questions`
    }
    return `/reports/${reportWithDetails.id}/questions`
  }

  describe.each([
    { scenario: 'during create journey', createJourney: true },
    { scenario: 'normally', createJourney: false },
  ])('$scenario', ({ createJourney }) => {
    it('submitting when answers not provided shows errors', () => {
      reportWithDetails.type = 'DEATH_OTHER'
      const firstQuestionStep = DEATH_OTHER.startingQuestionId
      const followingStep = '44434'
      const submittedAnswers = {
        // 'WERE THE POLICE INFORMED OF THE INCIDENT',
        '45054': '',
      }
      incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(reportWithDetails)

      const postUrl = `${reportQuestionsUrl(createJourney)}/${firstQuestionStep}`
      return agent
        .post(postUrl)
        .send(submittedAnswers)
        .redirects(1)
        .expect(200)
        .expect(res => {
          expect(incidentReportingApi.addOrUpdateQuestionsWithResponses).toHaveBeenCalledTimes(0)
          expect(incidentReportingApi.deleteQuestionsAndTheirResponses).toHaveBeenCalledTimes(0)
          expect(res.text).toContain('There is a problem')
          expect(fieldNames(res.text)).toEqual(['45054'])
          expect(res.text).toContain('<a href="#45054">This field is required</a>')
          expect(res.redirects[0]).toMatch(postUrl)
          expect(res.redirects[0]).not.toMatch(`/${followingStep}`)
        })
    })

    it('submitting when answers invalid shows errors', () => {
      reportWithDetails.type = 'DEATH_OTHER'
      const firstQuestionStep = DEATH_OTHER.startingQuestionId
      const followingStep = '44434'
      const submittedAnswers = {
        // 'WERE THE POLICE INFORMED OF THE INCIDENT',
        '45054': 'YES',
        // invalid date
        '45054-182204-date': 'Thu 27th Nov, yesterday',
      }
      incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(reportWithDetails)

      const postUrl = `${reportQuestionsUrl(createJourney)}/${firstQuestionStep}`
      return agent
        .post(postUrl)
        .send(submittedAnswers)
        .redirects(1)
        .expect(200)
        .expect(res => {
          expect(incidentReportingApi.addOrUpdateQuestionsWithResponses).toHaveBeenCalledTimes(0)
          expect(incidentReportingApi.addOrUpdateQuestionsWithResponses).toHaveBeenCalledTimes(0)
          expect(res.text).toContain('There is a problem')
          expect(fieldNames(res.text)).toEqual(['45054'])
          expect(res.text).toContain('<a href="#45054-182204-date">Enter a date</a>')
          expect(res.redirects[0]).toMatch(postUrl)
          expect(res.redirects[0]).not.toMatch(`/${followingStep}`)
        })
    })

    it('submitting answers requiring dates', () => {
      reportWithDetails.type = 'DEATH_OTHER'
      const firstQuestionStep = DEATH_OTHER.startingQuestionId
      const followingStep = '44434'
      const responseDate = '06/12/2023'
      const submittedAnswers = {
        // 'WERE THE POLICE INFORMED OF THE INCIDENT',
        '45054': 'YES',
        '45054-182204-comment': 'ignored',
        '45054-182204-date': responseDate,
      }
      const expectedRequest: AddOrUpdateQuestionWithResponsesRequest[] = [
        {
          code: '45054',
          question: 'WERE THE POLICE INFORMED OF THE INCIDENT',
          additionalInformation: null,
          responses: [
            {
              response: 'YES',
              responseDate: parseDateInput(responseDate),
              additionalInformation: null,
            },
          ],
        },
      ]

      const questionsResponse: Question[] = [
        {
          code: '45054',
          question: 'WERE THE POLICE INFORMED OF THE INCIDENT',
          additionalInformation: null,
          responses: [
            {
              response: 'YES',
              responseDate: parseDateInput(responseDate),
              recordedAt: new Date(),
              recordedBy: 'USER_1',
              additionalInformation: null,
            },
          ],
        },
      ]
      incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(reportWithDetails)
      incidentReportingApi.addOrUpdateQuestionsWithResponses.mockResolvedValueOnce(questionsResponse)
      reportWithDetails.questions = questionsResponse

      return agent
        .post(`${reportQuestionsUrl(createJourney)}/${firstQuestionStep}`)
        .send(submittedAnswers)
        .redirects(1)
        .expect(200)
        .expect(res => {
          expect(incidentReportingApi.addOrUpdateQuestionsWithResponses).toHaveBeenCalledWith(
            reportWithDetails.id,
            expectedRequest,
          )
          expect(incidentReportingApi.deleteQuestionsAndTheirResponses).toHaveBeenCalledTimes(0)
          expect(res.text).not.toContain('There is a problem')
          expect(res.redirects[0]).toMatch(`/${followingStep}`)
        })
    })

    it('submitting multiple answers to a question', () => {
      reportWithDetails.type = 'FINDS'
      const firstQuestionStep = FINDS.startingQuestionId
      const followingStep = '67180'
      const submittedAnswers = {
        // 'DESCRIBE HOW THE ITEM WAS FOUND (SELECT ALL THAT APPLY)'
        '67179': ['BOSS CHAIR', 'DOG SEARCH'],
      }
      const expectedRequest: AddOrUpdateQuestionWithResponsesRequest[] = [
        {
          code: '67179',
          question: 'DESCRIBE HOW THE ITEM WAS FOUND (SELECT ALL THAT APPLY)',
          additionalInformation: null,
          responses: [
            {
              response: 'BOSS CHAIR',
              responseDate: null,
              additionalInformation: null,
            },
            {
              response: 'DOG SEARCH',
              responseDate: null,
              additionalInformation: null,
            },
          ],
        },
      ]

      const questionsResponse: Question[] = [
        makeSimpleQuestion(
          '67179',
          'DESCRIBE HOW THE ITEM WAS FOUND (SELECT ALL THAT APPLY)',
          'BOSS CHAIR',
          'DOG SEARCH',
        ),
      ]
      incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(reportWithDetails)
      incidentReportingApi.addOrUpdateQuestionsWithResponses.mockResolvedValueOnce(questionsResponse)
      reportWithDetails.questions = questionsResponse

      return agent
        .post(`${reportQuestionsUrl(createJourney)}/${firstQuestionStep}`)
        .send(submittedAnswers)
        .redirects(1)
        .expect(200)
        .expect(res => {
          expect(incidentReportingApi.addOrUpdateQuestionsWithResponses).toHaveBeenCalledWith(
            reportWithDetails.id,
            expectedRequest,
          )
          expect(incidentReportingApi.deleteQuestionsAndTheirResponses).toHaveBeenCalledTimes(0)
          expect(res.text).not.toContain('There is a problem')
          expect(res.redirects[0]).toMatch(`/${followingStep}`)
        })
    })

    it('submitting responses to multiple questions', () => {
      reportWithDetails.type = 'ASSAULT'
      const firstQuestionStep = ASSAULT.startingQuestionId
      const followingStep = '61285'
      const submittedAnswers = {
        // 'WHAT WAS THE MAIN MANAGEMENT OUTCOME OF THE INCIDENT'
        '61279': 'POLICE REFERRAL',
        // 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES'
        '61280': 'YES',
        // 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT'
        '61281': 'NO',
        // 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED'
        '61282': 'YES',
        // 'IS THE LOCATION OF THE INCDENT KNOWN'
        '61283': 'NO',
      }
      const expectedRequest: AddOrUpdateQuestionWithResponsesRequest[] = [
        {
          code: '61279',
          question: 'WHAT WAS THE MAIN MANAGEMENT OUTCOME OF THE INCIDENT',
          additionalInformation: null,
          responses: [
            {
              response: 'POLICE REFERRAL',
              responseDate: null,
              additionalInformation: null,
            },
          ],
        },
        {
          code: '61280',
          question: 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES',
          additionalInformation: null,
          responses: [
            {
              response: 'YES',
              responseDate: null,
              additionalInformation: null,
            },
          ],
        },
        {
          code: '61281',
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
          code: '61282',
          question: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
          additionalInformation: null,
          responses: [
            {
              response: 'YES',
              responseDate: null,
              additionalInformation: null,
            },
          ],
        },
        {
          code: '61283',
          question: 'IS THE LOCATION OF THE INCDENT KNOWN',
          additionalInformation: null,
          responses: [
            {
              response: 'NO',
              responseDate: null,
              additionalInformation: null,
            },
          ],
        },
      ]

      const questionsResponse: Question[] = [
        makeSimpleQuestion('61279', 'WHAT WAS THE MAIN MANAGEMENT OUTCOME OF THE INCIDENT', 'POLICE REFERRAL'),
        makeSimpleQuestion('61280', 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES', 'YES'),
        makeSimpleQuestion('61281', 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT', 'NO'),
        makeSimpleQuestion('61282', 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED', 'YES'),
        // NOTE: Answer changed from 'YES' to 'NO'
        makeSimpleQuestion('61283', 'IS THE LOCATION OF THE INCDENT KNOWN', 'NO'),
        // NOTE: This question will need to be deleted.
        // Answer to previous question changed so branch where this
        // sits is no longer entered now
        makeSimpleQuestion('61284', 'WHAT WAS THE LOCATION OF THE INCIDENT', 'GYM'),
        // NOTE: This question asked regardless of branching, will be retained
        makeSimpleQuestion('61285', 'WAS THIS A SEXUAL ASSAULT', 'NO'),
      ]
      incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(reportWithDetails)
      incidentReportingApi.addOrUpdateQuestionsWithResponses.mockResolvedValueOnce(questionsResponse)
      reportWithDetails.questions = questionsResponse

      return agent
        .post(`${reportQuestionsUrl(createJourney)}/${firstQuestionStep}`)
        .send(submittedAnswers)
        .redirects(1)
        .expect(200)
        .expect(res => {
          expect(incidentReportingApi.addOrUpdateQuestionsWithResponses).toHaveBeenCalledWith(
            reportWithDetails.id,
            expectedRequest,
          )
          expect(incidentReportingApi.deleteQuestionsAndTheirResponses).toHaveBeenCalledWith(reportWithDetails.id, [
            '61284',
          ])
          expect(res.text).not.toContain('There is a problem')
          expect(res.redirects[0]).toMatch(`/${followingStep}`)
        })
    })

    it('should redirect to report view once all questions are answered', async () => {
      // simulate last 1-question page being unanswered
      reportWithDetails.type = 'ATTEMPTED_ESCAPE_FROM_CUSTODY'
      const questionsResponse: Question[] = [
        makeSimpleQuestion('44769', 'WERE THE POLICE INFORMED OF THE INCIDENT', 'NO'),
        makeSimpleQuestion('44919', 'THE INCIDENT IS SUBJECT TO', 'INVESTIGATION INTERNALLY'),
        makeSimpleQuestion('45033', 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES', 'NO'),
        makeSimpleQuestion('44636', 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT', 'NO'),
        makeSimpleQuestion('44749', 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED', 'NO'),
        makeSimpleQuestion(
          '44594',
          'WHERE WAS THE PRISONER PRIOR TO THE START OF THE ATTEMPTED ESCAPE',
          'ADMINISTRATION',
        ),
        makeSimpleQuestion('44545', 'DID PRISONER GAIN ACCESS TO THE EXTERNAL PERIMETER', 'NO'),
        makeSimpleQuestion('44441', 'DID THE PRISONER ATTEMPT TO GAIN ACCESS TO THE EXTERNAL PERIMETER', 'NO'),
        makeSimpleQuestion('44746', 'ARE THE GROUNDS PATROLLED BY DOGS', 'NO'),
        makeSimpleQuestion('44595', 'WAS AN AIRCRAFT INVOLVED', 'NO'),
        makeSimpleQuestion('44983', 'WAS OUTSIDE ASSISTANCE INVOLVED IN THE ATTEMPTED ESCAPE', 'NO'),
        makeSimpleQuestion('44320', 'WERE ANY WEAPONS USED', 'NO'),
        makeSimpleQuestion('44731', 'WERE ANY INJURIES RECEIVED DURING THIS INCIDENT', 'NO'),
        makeSimpleQuestion('45073', 'HOW WAS THE ESCAPE ATTEMPT DISCOVERED', 'STAFF VIGILANCE'),
        makeSimpleQuestion('44349', 'HOW WAS THE ESCAPE ATTEMPT FOILED', 'STAFF INTERVENTION'),
        makeSimpleQuestion('44447', 'WAS DAMAGE CAUSED TO PRISON PROPERTY', 'NO'),
        makeSimpleQuestion('44863', 'WAS THE TELEPHONE/IT SYSTEM SHUT DOWN DURING THE INCIDENT?', 'NO'),
      ]
      reportWithDetails.questions = questionsResponse.slice(0, -1)
      incidentReportingApi.addOrUpdateQuestionsWithResponses.mockResolvedValueOnce(questionsResponse)

      return agent
        .post(`${reportQuestionsUrl(createJourney)}/44863`)
        .send({ '44863': 'NO' })
        .expect(302)
        .expect(res => {
          expect(res.redirect).toBe(true)
          expect(res.header.location).toEqual(`/reports/${reportWithDetails.id}`)
          expect(incidentReportingApi.addOrUpdateQuestionsWithResponses).toHaveBeenCalledWith(reportWithDetails.id, [
            expect.objectContaining({
              code: '44863',
              question: 'WAS THE TELEPHONE/IT SYSTEM SHUT DOWN DURING THE INCIDENT?',
              responses: [expect.objectContaining({ response: 'NO' })],
            }),
          ])
        })
    })

    it('should remain on last page if incorrectly answered', async () => {
      // simulate last 1-question page being unanswered
      reportWithDetails.type = 'ATTEMPTED_ESCAPE_FROM_CUSTODY'
      reportWithDetails.questions = [
        makeSimpleQuestion('44769', 'WERE THE POLICE INFORMED OF THE INCIDENT', 'NO'),
        makeSimpleQuestion('44919', 'THE INCIDENT IS SUBJECT TO', 'INVESTIGATION INTERNALLY'),
        makeSimpleQuestion('45033', 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES', 'NO'),
        makeSimpleQuestion('44636', 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT', 'NO'),
        makeSimpleQuestion('44749', 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED', 'NO'),
        makeSimpleQuestion(
          '44594',
          'WHERE WAS THE PRISONER PRIOR TO THE START OF THE ATTEMPTED ESCAPE',
          'ADMINISTRATION',
        ),
        makeSimpleQuestion('44545', 'DID PRISONER GAIN ACCESS TO THE EXTERNAL PERIMETER', 'NO'),
        makeSimpleQuestion('44441', 'DID THE PRISONER ATTEMPT TO GAIN ACCESS TO THE EXTERNAL PERIMETER', 'NO'),
        makeSimpleQuestion('44746', 'ARE THE GROUNDS PATROLLED BY DOGS', 'NO'),
        makeSimpleQuestion('44595', 'WAS AN AIRCRAFT INVOLVED', 'NO'),
        makeSimpleQuestion('44983', 'WAS OUTSIDE ASSISTANCE INVOLVED IN THE ATTEMPTED ESCAPE', 'NO'),
        makeSimpleQuestion('44320', 'WERE ANY WEAPONS USED', 'NO'),
        makeSimpleQuestion('44731', 'WERE ANY INJURIES RECEIVED DURING THIS INCIDENT', 'NO'),
        makeSimpleQuestion('45073', 'HOW WAS THE ESCAPE ATTEMPT DISCOVERED', 'STAFF VIGILANCE'),
        makeSimpleQuestion('44349', 'HOW WAS THE ESCAPE ATTEMPT FOILED', 'STAFF INTERVENTION'),
        makeSimpleQuestion('44447', 'WAS DAMAGE CAUSED TO PRISON PROPERTY', 'NO'),
      ]
      incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(reportWithDetails)

      return agent
        .post(`${reportQuestionsUrl(createJourney)}/44863`)
        .send({})
        .redirects(1)
        .expect(200)
        .expect(res => {
          expect(incidentReportingApi.addOrUpdateQuestionsWithResponses).not.toHaveBeenCalled()
          expect(res.redirects[0]).toMatch('/44863')
        })
    })

    it('should use incident type’s field order', () => {
      // NB: this type’s questions are not in numeric order on page 1
      reportWithDetails.type = 'ATTEMPTED_ESCAPE_FROM_CUSTODY'
      const firstQuestionStep = ATTEMPTED_ESCAPE_FROM_CUSTODY.startingQuestionId
      const submittedAnswers = {
        // WERE THE POLICE INFORMED OF THE INCIDENT
        '44769': 'NO',
        // THE INCIDENT IS SUBJECT TO
        '44919': ['INVESTIGATION INTERNALLY'],
        // IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES
        '45033': 'NO',
        // IS THERE ANY MEDIA INTEREST IN THIS INCIDENT
        '44636': 'NO',
        // HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED
        '44749': 'NO',
      }
      const questionsResponse: Question[] = [
        makeSimpleQuestion('44769', 'WERE THE POLICE INFORMED OF THE INCIDENT', 'NO'),
        makeSimpleQuestion('44919', 'THE INCIDENT IS SUBJECT TO', 'INVESTIGATION INTERNALLY'),
        makeSimpleQuestion('45033', 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES', 'NO'),
        makeSimpleQuestion('44636', 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT', 'NO'),
        makeSimpleQuestion('44749', 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED', 'NO'),
      ]
      reportWithDetails.questions = questionsResponse
      incidentReportingApi.addOrUpdateQuestionsWithResponses.mockResolvedValueOnce(questionsResponse)

      return agent
        .post(`${reportQuestionsUrl(createJourney)}/${firstQuestionStep}`)
        .send(submittedAnswers)
        .redirects(1)
        .expect(res => {
          expect(res.redirects[0]).toMatch('/44594')
          expect(incidentReportingApi.addOrUpdateQuestionsWithResponses).toHaveBeenCalledWith(expect.any(String), [
            expect.objectContaining({ code: '44769' }),
            expect.objectContaining({ code: '44919' }),
            expect.objectContaining({ code: '45033' }),
            expect.objectContaining({ code: '44636' }),
            expect.objectContaining({ code: '44749' }),
          ])
        })
    })

    it('should show a message for API errors', () => {
      reportWithDetails.type = 'FINDS'
      const firstQuestionStep = FINDS.startingQuestionId
      const submittedAnswers = {
        // 'DESCRIBE HOW THE ITEM WAS FOUND (SELECT ALL THAT APPLY)'
        '67179': ['BOSS CHAIR', 'DOG SEARCH'],
      }

      const error = mockThrownError(mockErrorResponse({ status: 500, message: 'External problem' }), 500)
      incidentReportingApi.addOrUpdateQuestionsWithResponses.mockRejectedValue(error)

      return agent
        .post(`${reportQuestionsUrl(createJourney)}/${firstQuestionStep}`)
        .send(submittedAnswers)
        .redirects(1)
        .expect(res => {
          expect(res.text).toContain('Sorry, there is a problem with the service')
          // NB: because each page is an entrypoint, cannot use form wizard to display error summary
        })
    })
  })
})

describe('Question editing permissions', () => {
  // NB: these test cases are simplified because the permissions class methods are thoroughly tested elsewhere

  const reportWithDetails = convertReportWithDetailsDates(
    mockReport({
      reportReference: '6544',
      reportDateAndTime: now,
      withDetails: true,
    }),
  )
  reportWithDetails.questions = []

  beforeEach(() => {
    incidentReportingApi.getReportWithDetailsById.mockResolvedValue(reportWithDetails)
  })

  function reportQuestionsUrl(createJourney: boolean): string {
    if (createJourney) {
      return `/create-report/${reportWithDetails.id}/questions`
    }
    return `/reports/${reportWithDetails.id}/questions`
  }

  const granted = 'granted' as const
  const denied = 'denied' as const

  describe.each([
    { scenario: 'during create journey', createJourney: true },
    { scenario: 'normally', createJourney: false },
  ])('$scenario', ({ createJourney }) => {
    it.each([
      { userType: 'reporting officer', user: reportingUser, action: granted },
      { userType: 'data warden', user: approverUser, action: denied },
      { userType: 'HQ view-only user', user: hqUser, action: denied },
      { userType: 'unauthorised user', user: unauthorisedUser, action: denied },
    ])('should be $action to $userType', ({ user, action }) => {
      const testRequest = request
        .agent(appWithAllRoutes({ userSupplier: () => user }))
        .get(reportQuestionsUrl(createJourney))
        .redirects(1)
      if (action === 'granted') {
        return testRequest.expect(200)
      }
      return testRequest.expect(res => {
        expect(res.redirects[0]).toContain('/sign-out')
      })
    })
  })
})

function fieldNames(response: string): string[] {
  const regexp = /<input .* id="([0-9]+)-item"/g

  const matches = [...response.matchAll(regexp)]
  return matches.map(match => match[1])
}
