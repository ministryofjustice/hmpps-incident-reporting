import type { Express } from 'express'
import request, { type Agent } from 'supertest'

import { appWithAllRoutes } from '../testutils/appSetup'
import { IncidentReportingApi } from '../../data/incidentReportingApi'

let app: Express
let incidentReportingApi: jest.Mocked<IncidentReportingApi>

beforeEach(() => {
  app = appWithAllRoutes({})
  incidentReportingApi = IncidentReportingApi.prototype as jest.Mocked<IncidentReportingApi>
})

afterEach(() => {
  jest.resetAllMocks()
})

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
          expect(res.text).toContain('Select incident type')
          expect(res.text).not.toContain('There is a problem')

          // active type
          expect(res.text).toContain('BOMB_THREAT')
          expect(res.text).toContain('Bomb threat')
          // inactive type
          expect(res.text).not.toContain('OLD_DRUGS')
          expect(res.text).not.toContain('Drugs')
        })
    })

    it('should show an error message if submitted without choosing a type', () => {
      return agent
        .post('/create-report')
        .send({})
        .redirects(1)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Select incident type')
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
          expect(res.request.url.endsWith('/create-report/details')).toBeTruthy()
          expect(res.text).toContain('Incident details')
        })
    })
  })

  describe('Step 2: entering date and description', () => {
    beforeEach(() => {
      return agent.post('/create-report').send({ type: 'DISORDER' })
    })

    const validPayload = {
      incidentDate: '21/10/2024',
      '_incidentTime-hours': '16',
      '_incidentTime-minutes': '32',
      description: 'Disorder took place on A wing',
    }

    it('should redirect to step 1 if it hasn’t been completed', () => {
      agent = request.agent(app) // reset agent
      return agent
        .get('/create-report/details')
        .expect(200)
        .expect(res => {
          expect(res.request.url.endsWith('/create-report')).toBeTruthy()
          expect(res.text).toContain('Select incident type')
          expect(res.text).not.toContain('There is a problem')
        })
    })

    it('should display form if step 1 was completed', () => {
      return agent
        .get('/create-report/details')
        .expect(200)
        .expect(res => {
          expect(res.request.url.endsWith('/create-report/details')).toBeTruthy()
          expect(res.text).toContain('Incident details')
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
          expect(res.request.url.endsWith('/create-report/details')).toBeTruthy()
          expect(res.text).toContain('Incident details')
          expect(res.text).toContain('There is a problem')
          expect(res.text).toContain(expectedError)
        })
    })
  })
})
