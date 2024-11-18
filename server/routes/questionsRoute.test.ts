import type { Express } from 'express'
import request, { type Agent } from 'supertest'

import { appWithAllRoutes } from './testutils/appSetup'
import { IncidentReportingApi, ReportWithDetails } from '../data/incidentReportingApi'
import { convertReportWithDetailsDates } from '../data/incidentReportingApiUtils'
import { mockReport } from '../data/testData/incidentReporting'

jest.mock('../data/incidentReportingApi')

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
  const incidentDateAndTime = new Date('2024-10-21T16:32:00+01:00')
  // Report type/answers updated in each test
  const reportWithDetails: ReportWithDetails = convertReportWithDetailsDates(
    mockReport({
      type: 'FINDS',
      reportReference: '6544',
      reportDateAndTime: incidentDateAndTime,
      withDetails: true,
    }),
  )

  const reportQuestionsUrl = `/reports/${reportWithDetails.id}/questions`

  let agent: Agent

  beforeEach(() => {
    agent = request.agent(app)
    incidentReportingApi.getReportWithDetailsById.mockResolvedValue(reportWithDetails)
  })

  it('form is prefilled with report answers, including date', () => {
    reportWithDetails.type = 'DEATH_OTHER'
    reportWithDetails.questions = [
      {
        code: 'QID-000000045054',
        question: 'WERE THE POLICE INFORMED OF THE INCIDENT',
        additionalInformation: null,
        responses: [
          {
            response: 'YES',
            responseDate: incidentDateAndTime,
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
        expect(res.text).not.toContain('There is a problem')
        // 'YES' response to '45054' requires a date, this is displayed
        expect(res.text).toContain('name="45054-182204-date" type="text" value="21/10/2024"')
        expect(res.text).toContain('name="45054" type="radio" value="YES" checked')
      })
  })

  it('form is prefilled with report answers, multiple choices are selected', () => {
    reportWithDetails.type = 'FINDS'

    reportWithDetails.questions = [
      {
        code: 'QID-000000067179',
        question: 'DESCRIBE HOW THE ITEM WAS FOUND (SELECT ALL THAT APPLY)',
        additionalInformation: null,
        responses: [
          {
            response: 'BOSS CHAIR',
            responseDate: null,
            additionalInformation: null,
            recordedBy: 'USER1',
            recordedAt: incidentDateAndTime,
          },
          {
            response: 'DOG SEARCH',
            responseDate: null,
            additionalInformation: null,
            recordedBy: 'USER1',
            recordedAt: incidentDateAndTime,
          },
        ],
      },
      {
        code: 'QID-000000067180',
        question: 'IS THE LOCATION OF THE INCIDENT KNOWN?',
        additionalInformation: null,
        responses: [
          {
            response: 'NO',
            responseDate: null,
            additionalInformation: null,
            recordedBy: 'USER1',
            recordedAt: incidentDateAndTime,
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
        expect(res.text).toContain('value="BOSS CHAIR" checked')
        expect(res.text).toContain('value="DOG SEARCH" checked')
      })
  })

  it('form is prefilled with report answers, multiple questions answered', () => {
    reportWithDetails.type = 'ASSAULT'

    reportWithDetails.questions = [
      {
        code: 'QID-000000061279',
        question: 'WHAT WAS THE MAIN MANAGEMENT OUTCOME OF THE INCIDENT',
        additionalInformation: null,
        responses: [
          {
            response: 'POLICE REFERRAL',
            responseDate: null,
            additionalInformation: null,
            recordedBy: 'USER1',
            recordedAt: incidentDateAndTime,
          },
        ],
      },
      {
        code: 'QID-000000061280',
        question: 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES',
        additionalInformation: null,
        responses: [
          {
            response: 'NO',
            responseDate: null,
            additionalInformation: null,
            recordedBy: 'USER1',
            recordedAt: incidentDateAndTime,
          },
        ],
      },
      {
        code: 'QID-000000061281',
        question: 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
        additionalInformation: null,
        responses: [
          {
            response: 'NO',
            responseDate: null,
            additionalInformation: null,
            recordedBy: 'USER1',
            recordedAt: incidentDateAndTime,
          },
        ],
      },
      {
        code: 'QID-000000061282',
        question: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
        additionalInformation: null,
        responses: [
          {
            response: 'NO',
            responseDate: null,
            additionalInformation: null,
            recordedBy: 'USER1',
            recordedAt: incidentDateAndTime,
          },
        ],
      },
      {
        code: 'QID-000000061283',
        question: 'IS THE LOCATION OF THE INCDENT KNOWN',
        additionalInformation: null,
        responses: [
          {
            response: 'YES',
            responseDate: null,
            additionalInformation: null,
            recordedBy: 'USER1',
            recordedAt: incidentDateAndTime,
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
        expect(res.text).toContain('name="61279" type="radio" value="POLICE REFERRAL" checked')
        expect(res.text).toContain('name="61280" type="radio" value="NO" checked')
        expect(res.text).toContain('name="61281" type="radio" value="NO" checked')
        expect(res.text).toContain('name="61282" type="radio" value="NO" checked')
        expect(res.text).toContain('name="61283" type="radio" value="YES" checked')
      })
  })
})
