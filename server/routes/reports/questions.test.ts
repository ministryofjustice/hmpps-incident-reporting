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

describe('Displaying responses', () => {
  // Report type/answers updated in each test
  const reportWithDetails: ReportWithDetails = convertReportWithDetailsDates(
    mockReport({
      type: 'FINDS',
      reportReference: '6544',
      reportDateAndTime: now,
      withDetails: true,
    }),
  )

  const reportQuestionsUrl = `/reports/${reportWithDetails.id}/questions`

  let agent: Agent

  beforeEach(() => {
    agent = request.agent(app)
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
      {
        code: '67179',
        question: 'DESCRIBE HOW THE ITEM WAS FOUND (SELECT ALL THAT APPLY)',
        additionalInformation: null,
        responses: [
          {
            response: 'BOSS CHAIR',
            responseDate: null,
            additionalInformation: null,
            recordedBy: 'USER1',
            recordedAt: now,
          },
          {
            response: 'DOG SEARCH',
            responseDate: null,
            additionalInformation: null,
            recordedBy: 'USER1',
            recordedAt: now,
          },
        ],
      },
      {
        code: '67180',
        question: 'IS THE LOCATION OF THE INCIDENT KNOWN?',
        additionalInformation: null,
        responses: [
          {
            response: 'NO',
            responseDate: null,
            additionalInformation: null,
            recordedBy: 'USER1',
            recordedAt: now,
          },
        ],
      },
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
      {
        code: '61279',
        question: 'WHAT WAS THE MAIN MANAGEMENT OUTCOME OF THE INCIDENT',
        additionalInformation: null,
        responses: [
          {
            response: 'POLICE REFERRAL',
            responseDate: null,
            additionalInformation: null,
            recordedBy: 'USER1',
            recordedAt: now,
          },
        ],
      },
      {
        code: '61280',
        question: 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES',
        additionalInformation: null,
        responses: [
          {
            response: 'NO',
            responseDate: null,
            additionalInformation: null,
            recordedBy: 'USER1',
            recordedAt: now,
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
            recordedBy: 'USER1',
            recordedAt: now,
          },
        ],
      },
      {
        code: '61282',
        question: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
        additionalInformation: null,
        responses: [
          {
            response: 'NO',
            responseDate: null,
            additionalInformation: null,
            recordedBy: 'USER1',
            recordedAt: now,
          },
        ],
      },
      {
        code: '61283',
        question: 'IS THE LOCATION OF THE INCDENT KNOWN',
        additionalInformation: null,
        responses: [
          {
            response: 'YES',
            responseDate: null,
            additionalInformation: null,
            recordedBy: 'USER1',
            recordedAt: now,
          },
        ],
      },
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
      {
        code: '67179',
        question: 'DESCRIBE HOW THE ITEM WAS FOUND (SELECT ALL THAT APPLY)',
        additionalInformation: null,
        responses: [
          {
            response: 'BOSS CHAIR',
            responseDate: null,
            recordedAt: new Date(),
            recordedBy: 'USER_1',
            additionalInformation: null,
          },
          {
            response: 'DOG SEARCH',
            responseDate: null,
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
      {
        code: '61279',
        question: 'WHAT WAS THE MAIN MANAGEMENT OUTCOME OF THE INCIDENT',
        additionalInformation: null,
        responses: [
          {
            response: 'POLICE REFERRAL',
            responseDate: null,
            additionalInformation: null,
            recordedBy: 'USER_1',
            recordedAt: new Date(),
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
            recordedBy: 'USER_1',
            recordedAt: new Date(),
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
            recordedBy: 'USER_1',
            recordedAt: new Date(),
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
            recordedBy: 'USER_1',
            recordedAt: new Date(),
          },
        ],
      },
      {
        // NOTE: Answer changed from 'YES' to 'NO'
        code: '61283',
        question: 'IS THE LOCATION OF THE INCDENT KNOWN',
        additionalInformation: null,
        responses: [
          {
            response: 'NO',
            responseDate: null,
            additionalInformation: null,
            recordedBy: 'USER_1',
            recordedAt: new Date(),
          },
        ],
      },
      {
        // NOTE: This question will need to be deleted.
        // Answer to previous question changed so branch where this
        // sits is no longer entered now
        code: '61284',
        question: 'WHAT WAS THE LOCATION OF THE INCIDENT',
        additionalInformation: null,
        responses: [
          {
            response: 'GYM',
            responseDate: null,
            additionalInformation: null,
            recordedBy: 'USER_1',
            recordedAt: new Date(),
          },
        ],
      },
      {
        // NOTE: This question asked regardless of branching, will be retained
        code: '61285',
        question: 'WAS THIS A SEXUAL ASSAULT',
        additionalInformation: null,
        responses: [
          {
            response: 'NO',
            responseDate: null,
            additionalInformation: null,
            recordedBy: 'USER_1',
            recordedAt: new Date(),
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
