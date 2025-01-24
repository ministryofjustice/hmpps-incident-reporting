import type { Express } from 'express'
import request, { type Agent } from 'supertest'

import { parseDateInput } from '../../utils/utils'
import { appWithAllRoutes } from '../testutils/appSetup'
import { now } from '../../testutils/fakeClock'
import {
  type AddOrUpdateQuestionWithResponsesRequest,
  IncidentReportingApi,
  type Question,
  type ReportWithDetails,
  type Response,
} from '../../data/incidentReportingApi'
import { convertReportWithDetailsDates } from '../../data/incidentReportingApiUtils'
import { mockErrorResponse, mockReport } from '../../data/testData/incidentReporting'
import { mockThrownError } from '../../data/testData/thrownErrors'
import { approverUser, hqUser, reportingUser, unauthorisedUser } from '../../data/testData/users'
import ASSAULT from '../../reportConfiguration/types/ASSAULT'
import DEATH_OTHER from '../../reportConfiguration/types/DEATH_OTHER'
import FINDS from '../../reportConfiguration/types/FINDS'

jest.mock('../../data/incidentReportingApi')

let app: Express
let incidentReportingApi: jest.Mocked<IncidentReportingApi>

beforeEach(() => {
  app = appWithAllRoutes({})
  incidentReportingApi = IncidentReportingApi.prototype as jest.Mocked<IncidentReportingApi>
})

afterEach(() => {
  jest.resetAllMocks()
})

function makeSimpleQuestion(code: string, question: string, ...responseCodes: string[]): Question {
  return {
    code,
    question,
    additionalInformation: null,
    responses: responseCodes.map(responseCode => {
      const response: Response = {
        response: responseCode,
        responseDate: null,
        additionalInformation: null,
        recordedBy: 'USER1',
        recordedAt: now,
      }
      return response
    }),
  }
}

describe('Displaying responses', () => {
  // Report type/answers updated in each test
  let reportWithDetails: ReportWithDetails
  let reportQuestionsUrl: string

  let agent: Agent

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
    reportQuestionsUrl = `/reports/${reportWithDetails.id}/questions`
    incidentReportingApi.getReportWithDetailsById.mockResolvedValue(reportWithDetails)
  })

  it('should 404 if report is not found', () => {
    const error = mockThrownError(mockErrorResponse({ status: 404, message: 'Report not found' }), 404)
    incidentReportingApi.getReportWithDetailsById.mockReset()
    incidentReportingApi.getReportWithDetailsById.mockRejectedValueOnce(error)

    return agent
      .get(reportQuestionsUrl)
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
      .get(reportQuestionsUrl)
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
      .get(reportQuestionsUrl)
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
      .get(reportQuestionsUrl)
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

  describe('Page & question numbering', () => {
    it('should show question numbers on first page', () => {
      reportWithDetails.type = 'ATTEMPTED_ESCAPE_FROM_CUSTODY'
      return agent
        .get(reportQuestionsUrl)
        .redirects(1)
        .expect(res => {
          expect(res.text).toContain('1. Were the police informed of the incident?')
          expect(res.text).toContain('2. The incident is subject to')
          expect(res.text).toContain('3. Is any member of staff facing disciplinary charges?')
          expect(res.text).toContain('4. Is there any media interest in this incident?')
          expect(res.text).toContain('5. Has the prison service press office been informed?')
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
      incidentReportingApi.addOrUpdateQuestionsWithResponses.mockResolvedValue(questionsResponse)

      await agent
        .get(reportQuestionsUrl)
        .redirects(1)
        .expect(res => {
          expect(res.redirects.at(-1)).toMatch(/\/44769$/)
        })
      await agent
        .post(`${reportQuestionsUrl}/44769`)
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
        .get(`${reportQuestionsUrl}/44594`)
        .redirects(1)
        .expect(res => {
          expect(res.text).toContain('6. Where was the prisoner prior to the start of the attempted escape?')
        })
    })

    it('should show page 1 on first page', () => {
      return agent
        .get(reportQuestionsUrl)
        .redirects(1)
        .expect(res => {
          expect(res.text).toContain('Incident questions 1')
        })
    })

    it('should show page 2 on second page', async () => {
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
      incidentReportingApi.addOrUpdateQuestionsWithResponses.mockResolvedValue(questionsResponse)

      await agent
        .get(reportQuestionsUrl)
        .redirects(1)
        .expect(res => {
          expect(res.redirects.at(-1)).toMatch(/\/67179$/)
        })
      await agent
        .post(`${reportQuestionsUrl}/67179`)
        .send({
          '67179': ['CELL SEARCH'],
        })
        .redirects(1)
        .expect(res => {
          expect(res.redirects.at(-1)).toMatch(/\/67180$/)
        })

      return agent.get(`${reportQuestionsUrl}/67180`).expect(res => {
        expect(res.text).toContain('Incident questions 2')
      })
    })
  })
})

describe('Submitting questions’ responses', () => {
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

  const reportQuestionsUrl = `/reports/${reportWithDetails.id}/questions`

  let agent: Agent

  beforeEach(() => {
    agent = request.agent(app)
    incidentReportingApi.getReportWithDetailsById.mockResolvedValue(reportWithDetails)
  })

  it('submitting when answers not provided shows errors', async () => {
    reportWithDetails.type = 'DEATH_OTHER'
    const firstQuestionStep = DEATH_OTHER.startingQuestionId
    const followingStep = '44434'
    const submittedAnswers = {
      // 'WERE THE POLICE INFORMED OF THE INCIDENT',
      '45054': '',
    }

    await agent.get(reportQuestionsUrl).redirects(1).expect(200)
    const postUrl = `${reportQuestionsUrl}/${firstQuestionStep}/`
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

  it('submitting when answers invalid shows errors', async () => {
    reportWithDetails.type = 'DEATH_OTHER'
    const firstQuestionStep = DEATH_OTHER.startingQuestionId
    const followingStep = '44434'
    const submittedAnswers = {
      // 'WERE THE POLICE INFORMED OF THE INCIDENT',
      '45054': 'YES',
      // invalid date
      '45054-182204-date': 'Thu 27th Nov, yesterday',
    }

    await agent.get(reportQuestionsUrl).redirects(1).expect(200)
    const postUrl = `${reportQuestionsUrl}/${firstQuestionStep}/`
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

  it('submitting answers requiring dates', async () => {
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
    incidentReportingApi.addOrUpdateQuestionsWithResponses.mockResolvedValue(questionsResponse)

    await agent.get(reportQuestionsUrl).redirects(1).expect(200)
    return agent
      .post(`${reportQuestionsUrl}/${firstQuestionStep}/`)
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

  it('submitting multiple answers to a question', async () => {
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
    incidentReportingApi.addOrUpdateQuestionsWithResponses.mockResolvedValue(questionsResponse)

    await agent.get(reportQuestionsUrl).redirects(1).expect(200)
    return agent
      .post(`${reportQuestionsUrl}/${firstQuestionStep}/`)
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

  it('submitting responses to multiple questions', async () => {
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
    incidentReportingApi.addOrUpdateQuestionsWithResponses.mockResolvedValue(questionsResponse)

    await agent.get(reportQuestionsUrl).redirects(1).expect(200)
    return agent
      .post(`${reportQuestionsUrl}/${firstQuestionStep}/`)
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

  it('should show a message for API errors', async () => {
    reportWithDetails.type = 'FINDS'
    const firstQuestionStep = FINDS.startingQuestionId
    const submittedAnswers = {
      // 'DESCRIBE HOW THE ITEM WAS FOUND (SELECT ALL THAT APPLY)'
      '67179': ['BOSS CHAIR', 'DOG SEARCH'],
    }

    const error = mockThrownError(mockErrorResponse({ status: 500, message: 'External problem' }), 500)
    incidentReportingApi.addOrUpdateQuestionsWithResponses.mockRejectedValue(error)

    await agent.get(reportQuestionsUrl).redirects(1).expect(200)
    return agent
      .post(`${reportQuestionsUrl}/${firstQuestionStep}/`)
      .send(submittedAnswers)
      .redirects(1)
      .expect(res => {
        expect(res.text).toContain('Sorry, there is a problem with the service')
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
  const reportQuestionsUrl = `/reports/${reportWithDetails.id}/questions`

  beforeEach(() => {
    incidentReportingApi.getReportWithDetailsById.mockResolvedValue(reportWithDetails)
  })

  const granted = 'granted' as const
  const denied = 'denied' as const
  it.each([
    { userType: 'reporting officer', user: reportingUser, action: granted },
    { userType: 'data warden', user: approverUser, action: granted },
    { userType: 'HQ view-only user', user: hqUser, action: denied },
    { userType: 'unauthorised user', user: unauthorisedUser, action: denied },
  ])('should be $action to $userType', ({ user, action }) => {
    const testRequest = request
      .agent(appWithAllRoutes({ userSupplier: () => user }))
      .get(reportQuestionsUrl)
      .redirects(1)
    if (action === 'granted') {
      return testRequest.expect(200)
    }
    return testRequest.expect(res => {
      expect(res.redirects[0]).toContain('/sign-out')
    })
  })
})

function fieldNames(response: string): string[] {
  const regexp = /<input .* id="([0-9]+)-item"/g

  const matches = [...response.matchAll(regexp)]
  return matches.map(match => match[1])
}
