import type { Express } from 'express'
import request, { type Agent, type Response } from 'supertest'

import config from '../../../config'
import format from '../../../utils/format'
import { appWithAllRoutes } from '../../testutils/appSetup'
import { IncidentReportingApi } from '../../../data/incidentReportingApi'
import { convertReportWithDetailsDates } from '../../../data/incidentReportingApiUtils'
import { mockErrorResponse, mockReport } from '../../../data/testData/incidentReporting'
import { mockThrownError } from '../../../data/testData/thrownErrors'
import { mockDataWarden, mockReportingOfficer, mockHqViewer, mockUnauthorisedUser } from '../../../data/testData/users'

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

function expectOnTypePage(res: Response): void {
  expect(res.request.url.endsWith('/create-report')).toBe(true)
  expect(res.text).toContain('app-type')
  expect(res.text).toContain('Select the incident type')
}

function expectOnDetailsPage(res: Response): void {
  expect(res.request.url.endsWith('/create-report/details')).toBe(true)
  expect(res.text).toContain('app-details')
  expect(res.text).toContain('Incident summary')
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
          expectOnTypePage(res)
          expect(res.text).not.toContain('There is a problem')

          // active type
          expect(res.text).toContain('BOMB_1')
          expect(res.text).toContain('Bomb explosion or threat')
          // inactive type
          expect(res.text).not.toContain('DRUGS_1')
          expect(res.text).not.toContain('Drugs')

          // miscellaneous is last
          expect(res.text.indexOf('TOOL_LOSS_1')).toBeLessThan(res.text.indexOf('MISCELLANEOUS_1'))
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
          expectOnTypePage(res)
          expect(res.text).toContain('There is a problem')
          expect(res.text).toContain('Select the incident type')
        })
    })

    it('should proceed to step 2 if an incident type was chosen', () => {
      return agent
        .post('/create-report')
        .send({ type: 'DISORDER_2' })
        .redirects(1)
        .expect(200)
        .expect(res => {
          expectOnDetailsPage(res)
        })
    })
  })

  describe('Step 2: entering date and description', () => {
    beforeEach(() => {
      return agent.post('/create-report').send({ type: 'DISORDER_2' })
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
    //       expectOnTypePage(res)
    //       expect(res.text).not.toContain('There is a problem')
    //     })
    // })

    it('should display form if step 1 was completed', () => {
      return agent
        .get('/create-report/details')
        .expect(200)
        .expect(res => {
          expectOnDetailsPage(res)
          expect(res.text).not.toContain('There is a problem')
        })
    })

    it('should include date-checking component', () => {
      return agent
        .get('/create-report/details')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('<dialog')
          expect(res.text).toContain('app-dialogue')
        })
    })

    it.each([
      { missingField: 'incidentDate', expectedError: 'Enter the date of the incident' },
      { missingField: '_incidentTime-hours', expectedError: 'Enter the time of the incident using the 24 hour clock' },
      {
        missingField: '_incidentTime-minutes',
        expectedError: 'Enter the time of the incident using the 24 hour clock',
      },
      { missingField: 'description', expectedError: 'Enter a description of the incident' },
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
          expectOnDetailsPage(res)
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
          expectOnDetailsPage(res)
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
          expectOnDetailsPage(res)
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
          expectOnDetailsPage(res)
          expect(res.text).toContain('There is a problem')
          expect(res.text).toContain('value="21/10/2024"')
          expect(res.text).toContain('value="24"')
          expect(res.text).toContain('value="32"')
          expect(res.text).toContain('Disorder took place on A wing')
        })
    })

    it('should send request to API if form is valid and proceed to next step', async () => {
      const reportWithDetails = convertReportWithDetailsDates(
        mockReport({
          reportReference: '6544',
          reportDateAndTime: incidentDateAndTime,
          withDetails: true,
        }),
      )
      incidentReportingApi.createReport.mockResolvedValueOnce(reportWithDetails)

      await agent
        .post('/create-report/details')
        .send(validPayload)
        .redirects(0)
        .expect(302)
        .expect(res => {
          expect(res.redirect).toBe(true)
          expect(res.header.location).toEqual(`/create-report/${reportWithDetails.id}/prisoners`)
          expect(incidentReportingApi.createReport).toHaveBeenCalledWith({
            description: 'Disorder took place on A wing',
            incidentDateAndTime,
            location: 'MDI',
            title: 'Disorder (Moorland (HMP & YOI))',
            type: 'DISORDER_2',
          })
        })
      await agent.get('/create-report').expect(res => {
        // no type is preselected
        expect(res.text).not.toContain('checked')
        // TODO: ideally, test would go to /create-report/details and be redirected,
        //       but throws “Missing prereq for this step” instead
      })
    })

    it('should send request to API if form is valid and return to report view if user chose to exit', () => {
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
        .send({ ...validPayload, userAction: 'exit' })
        .redirects(0)
        .expect(302)
        .expect(res => {
          expect(res.redirect).toBe(true)
          expect(res.header.location).toEqual(`/reports/${reportWithDetails.id}`)
          expect(incidentReportingApi.createReport).toHaveBeenCalled()
        })
    })

    it('should show an error if API rejects request', () => {
      const error = mockThrownError(mockErrorResponse({ message: 'Description is too short' }))
      incidentReportingApi.createReport.mockRejectedValueOnce(error)

      return agent
        .post('/create-report/details')
        .send(validPayload)
        .redirects(1)
        .expect(200)
        .expect(res => {
          expectOnDetailsPage(res)
          expect(res.text).toContain('There is a problem')
          expect(res.text).toContain('Sorry, there was a problem with your request')
          expect(res.text).not.toContain('Bad Request')
          expect(res.text).not.toContain('Description is too short')
        })
    })

    it('should redirect from URL base of nested routers to report view page', () => {
      const reportWithDetails = convertReportWithDetailsDates(
        mockReport({
          reportReference: '6544',
          reportDateAndTime: incidentDateAndTime,
          withDetails: true,
        }),
      )
      incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(reportWithDetails)

      return agent.get(`/create-report/${reportWithDetails.id}`).expect(res => {
        expect(res.redirect).toBe(true)
        expect(res.header.location).toEqual(`/reports/${reportWithDetails.id}`)
      })
    })
  })

  describe('Permissions', () => {
    // NB: these test cases are simplified because the permissions class methods are thoroughly tested elsewhere

    let previousActivePrisons: string[]

    beforeAll(() => {
      previousActivePrisons = config.activePrisons
    })

    beforeEach(() => {
      config.activePrisons = previousActivePrisons
    })

    const granted = 'granted' as const
    const denied = 'denied' as const
    it.each([
      { userType: 'reporting officer', user: mockReportingOfficer, action: granted },
      { userType: 'data warden', user: mockDataWarden, action: denied },
      { userType: 'HQ view-only user', user: mockHqViewer, action: denied },
      { userType: 'unauthorised user', user: mockUnauthorisedUser, action: denied },
    ])('should be $action to $userType', ({ user, action }) => {
      const testRequest = request(appWithAllRoutes({ userSupplier: () => user }))
        .get('/create-report')
        .redirects(1)
      if (action === 'granted') {
        return testRequest.expect(200)
      }
      return testRequest.expect(res => {
        expect(res.redirects[0]).toContain('/sign-out')
      })
    })

    it.each([
      { userType: 'reporting officer', user: mockReportingOfficer },
      { userType: 'data warden', user: mockDataWarden },
    ])('should be denied to $userType if active caseload is not an active prison', ({ user }) => {
      config.activePrisons = ['LEI']

      return request(appWithAllRoutes({ userSupplier: () => user }))
        .get('/create-report')
        .redirects(1)
        .expect(res => {
          expect(res.redirects[0]).toContain('/sign-out')
        })
    })
  })
})
