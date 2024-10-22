import type { Express } from 'express'
import request, { type Agent, type Response } from 'supertest'

import format from '../../utils/format'
import { appWithAllRoutes } from '../testutils/appSetup'
import { type ErrorResponse, IncidentReportingApi } from '../../data/incidentReportingApi'
import { convertReportWithDetailsDates } from '../../data/incidentReportingApiUtils'
import { mockReport } from '../../data/testData/incidentReporting'
import { mockThrownError } from '../../data/testData/thrownErrors'

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

function expectOnStep1(res: Response): void {
  expect(res.request.url.endsWith('/create-report')).toBeTruthy()
  expect(res.text).toContain('Select incident type')
}

function expectOnStep2(res: Response): void {
  expect(res.request.url.endsWith('/create-report/details')).toBeTruthy()
  expect(res.text).toContain('Incident details')
}

describe('Creating a report', () => {
  let agent: Agent

  beforeEach(() => {
    agent = request.agent(app)
  })

  describe('Step 1: selecting incident type', () => {
    it('should list incident types that can be selected', () => {
      return agent
        .get('/create-report')
        .expect(200)
        .expect(res => {
          expectOnStep1(res)
          expect(res.text).not.toContain('There is a problem')

          // active type
          expect(res.text).toContain('BOMB_THREAT')
          expect(res.text).toContain('Bomb threat')
          // inactive type
          expect(res.text).not.toContain('OLD_DRUGS')
          expect(res.text).not.toContain('Drugs')

          // miscellaneous is last
          expect(res.text.indexOf('TOOL_LOSS')).toBeLessThan(res.text.indexOf('MISCELLANEOUS'))
          // hints are included
          expect(res.text).toContain('Includes barricade, concerted indiscipline, hostage, and incident at height.')
        })
    })

    it('should show an error message if submitted without choosing a type', () => {
      return agent
        .post('/create-report')
        .send({})
        .redirects(1)
        .expect(200)
        .expect(res => {
          expectOnStep1(res)
          expect(res.text).toContain('There is a problem')
          expect(res.text).toContain('Choose one of the options')
        })
    })

    it('should proceed to step 2 if an incident type was chosen', () => {
      return agent
        .post('/create-report')
        .send({ type: 'DISORDER' })
        .redirects(1)
        .expect(200)
        .expect(res => {
          expectOnStep2(res)
        })
    })
  })

  describe('Step 2: entering date and description', () => {
    beforeEach(() => {
      return agent.post('/create-report').send({ type: 'DISORDER' })
    })

    const incidentDateAndTime = new Date('2024-10-21T16:32:00+01:00')
    const validPayload = {
      incidentDate: '21/10/2024',
      '_incidentTime-hours': '16',
      '_incidentTime-minutes': '32',
      description: 'Disorder took place on A wing',
    }

    // TODO: throws “Missing prereq for this step” instead of redirecting :(
    // it('should redirect to step 1 if it hasn’t been completed', () => {
    //   agent = request.agent(app) // reset agent
    //   return agent
    //     .get('/create-report/details')
    //     .expect(200)
    //     .expect(res => {
    //       expectOnStep1(res)
    //       expect(res.text).not.toContain('There is a problem')
    //     })
    // })

    it('should display form if step 1 was completed', () => {
      return agent
        .get('/create-report/details')
        .expect(200)
        .expect(res => {
          expectOnStep2(res)
          expect(res.text).not.toContain('There is a problem')
        })
    })

    it.each([
      { missingField: 'incidentDate', expectedError: 'Enter a date' },
      { missingField: '_incidentTime-hours', expectedError: 'Enter a time' },
      { missingField: '_incidentTime-minutes', expectedError: 'Enter a time' },
      { missingField: 'description', expectedError: 'Enter a description' },
    ])('should show an error if $missingField is left empty', ({ missingField, expectedError }) => {
      const invalidPayload = {
        ...validPayload,
        [missingField]: '',
      }
      return agent
        .post('/create-report/details')
        .send(invalidPayload)
        .redirects(1)
        .expect(200)
        .expect(res => {
          expectOnStep2(res)
          expect(res.text).toContain('There is a problem')
          expect(res.text).toContain(expectedError)
        })
    })

    it.each([
      { scenario: 'date cannot be parsed', invalidPayload: { ...validPayload, incidentDate: 'yesterday' } },
      {
        scenario: 'time is invalid',
        invalidPayload: { ...validPayload, '_incidentTime-hours': '10', '_incidentTime-minutes': 'am' },
      },
    ])('should show an error if $scenario', ({ invalidPayload }) => {
      return agent
        .post('/create-report/details')
        .send(invalidPayload)
        .redirects(1)
        .expect(200)
        .expect(res => {
          expectOnStep2(res)
          expect(res.text).toContain('There is a problem')
        })
    })

    it.each([
      {
        scenario: 'later today',
        dateCalculator: () => {
          const date = new Date()
          date.setMinutes(date.getMinutes() + 2)
          return date
        },
      },
      {
        scenario: 'tomorrow',
        dateCalculator: () => {
          const date = new Date()
          date.setDate(date.getDate() + 1)
          return date
        },
      },
    ])('should show an error if date and time is in the future, $scenario', ({ dateCalculator }) => {
      const dateAndTime = dateCalculator()
      const incidentDate = format.shortDate(dateAndTime)
      const incidentTime = format.time(dateAndTime)
      const [hours, minutes] = incidentTime.split(':')
      const invalidPayload = {
        ...validPayload,
        incidentDate,
        '_incidentTime-hours': hours,
        '_incidentTime-minutes': minutes,
      }
      return agent
        .post('/create-report/details')
        .send(invalidPayload)
        .redirects(1)
        .expect(200)
        .expect(res => {
          expectOnStep2(res)
          expect(res.text).toContain('There is a problem')
        })
    })

    it('should redisplay form input values when showing an error', () => {
      const invalidPayload = {
        ...validPayload,
        '_incidentTime-hours': '24',
      }
      return agent
        .post('/create-report/details')
        .send(invalidPayload)
        .redirects(1)
        .expect(200)
        .expect(res => {
          expectOnStep2(res)
          expect(res.text).toContain('There is a problem')
          expect(res.text).toContain('value="21/10/2024"')
          expect(res.text).toContain('value="24"')
          expect(res.text).toContain('value="32"')
          expect(res.text).toContain('Disorder took place on A wing')
        })
    })

    it('should send request to API if form is valid', () => {
      const reportWithDetails = convertReportWithDetailsDates(
        mockReport({
          reportReference: '6544',
          reportDateAndTime: incidentDateAndTime,
          withDetails: true,
        }),
      )
      incidentReportingApi.createReport.mockResolvedValueOnce(reportWithDetails)

      return agent
        .post('/create-report/details')
        .send(validPayload)
        .redirects(0)
        .expect(302)
        .expect(res => {
          expect(res.redirect).toBeTruthy()
          expect(res.header.location).toEqual(`/reports/${reportWithDetails.id}`)
          expect(incidentReportingApi.createReport).toHaveBeenCalledWith({
            createNewEvent: true,
            description: 'Disorder took place on A wing',
            incidentDateAndTime,
            prisonId: 'MDI',
            title: 'Report: disorder',
            type: 'DISORDER',
          })
        })
    })

    it('should show an error if API rejects request', () => {
      const error = mockThrownError({
        status: 400,
        userMessage: 'Description is too short',
        developerMessage: 'Description is too short',
      } satisfies ErrorResponse)
      incidentReportingApi.createReport.mockRejectedValueOnce(error)

      return agent
        .post('/create-report/details')
        .send(validPayload)
        .redirects(1)
        .expect(200)
        .expect(res => {
          expectOnStep2(res)
          expect(res.text).toContain('There is a problem')
          expect(res.text).toContain('Sorry, there was a problem with your request')
          expect(res.text).not.toContain('Bad Request')
          expect(res.text).not.toContain('Description is too short')
        })
    })
  })
})
