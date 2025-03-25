import type { Express } from 'express'
import request, { type Agent, type Response } from 'supertest'

import format from '../../../utils/format'
import { appWithAllRoutes } from '../../testutils/appSetup'
import { IncidentReportingApi } from '../../../data/incidentReportingApi'
import { convertBasicReportDates } from '../../../data/incidentReportingApiUtils'
import { mockErrorResponse, mockReport } from '../../../data/testData/incidentReporting'
import { mockThrownError } from '../../../data/testData/thrownErrors'
import { approverUser, hqUser, reportingUser, unauthorisedUser } from '../../../data/testData/users'

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

describe('Updating report details', () => {
  const incidentDateAndTime = new Date('2024-10-21T16:32:00+01:00')
  const reportBasic = convertBasicReportDates(
    mockReport({
      type: 'DISORDER',
      reportReference: '6544',
      reportDateAndTime: incidentDateAndTime,
    }),
  )
  const updateDetailsUrl = `/reports/${reportBasic.id}/update-details`
  const validPayload = {
    incidentDate: '21/10/2024',
    '_incidentTime-hours': '16',
    '_incidentTime-minutes': '32',
    description: 'Disorder took place on A wing',
  }

  let agent: Agent

  beforeEach(() => {
    agent = request.agent(app)
    incidentReportingApi.getReportById.mockResolvedValue(reportBasic)
  })

  function expectOnDetailsPage(res: Response): void {
    expect(res.request.url.endsWith(updateDetailsUrl)).toBe(true)
    expect(res.text).toContain('app-details')
    expect(res.text).toContain('Incident summary')
  }

  function expectRedirectToReportPage(res: Response): void {
    expect(res.redirect).toBe(true)
    expect(res.header.location).toEqual(`/reports/${reportBasic.id}`)
  }

  it('should 404 if report is not found', () => {
    const error = mockThrownError(mockErrorResponse({ status: 404, message: 'Report not found' }), 404)
    incidentReportingApi.getReportById.mockReset()
    incidentReportingApi.getReportById.mockRejectedValueOnce(error)

    return agent
      .get(updateDetailsUrl)
      .expect(404)
      .expect(res => {
        expect(res.text).toContain('Page not found')
      })
  })

  it('should display form prefilled with existing report details', () => {
    return agent
      .get(updateDetailsUrl)
      .expect(200)
      .expect(res => {
        expectOnDetailsPage(res)
        expect(res.text).not.toContain('There is a problem')
        expect(res.text).toContain('value="21/10/2024"')
        expect(res.text).toContain('value="15"')
        expect(res.text).toContain('value="32"')
        expect(res.text).toContain('A new incident created in the new service of type DISORDER')
      })
  })

  it('should not include date-checking component', () => {
    return agent
      .get(updateDetailsUrl)
      .expect(200)
      .expect(res => {
        expect(res.text).not.toContain('<dialog')
        expect(res.text).not.toContain('app-dialogue')
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
      .post(updateDetailsUrl)
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
      .post(updateDetailsUrl)
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
      .post(updateDetailsUrl)
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
      .post(updateDetailsUrl)
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
    incidentReportingApi.updateReport.mockResolvedValueOnce(reportBasic)

    return agent
      .post(updateDetailsUrl)
      .send(validPayload)
      .redirects(0)
      .expect(302)
      .expect(res => {
        expectRedirectToReportPage(res)
        expect(incidentReportingApi.updateReport).toHaveBeenCalledWith(reportBasic.id, {
          description: 'Disorder took place on A wing',
          incidentDateAndTime,
          updateEvent: true,
        })
      })
  })

  it('should show an error if API rejects request', () => {
    const error = mockThrownError(mockErrorResponse({ message: 'Description is too short' }))
    incidentReportingApi.updateReport.mockRejectedValueOnce(error)

    return agent
      .post(updateDetailsUrl)
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

  describe('Permissions', () => {
    // NB: these test cases are simplified because the permissions class methods are thoroughly tested elsewhere

    const granted = 'granted' as const
    const denied = 'denied' as const
    it.each([
      { userType: 'reporting officer', user: reportingUser, action: granted },
      { userType: 'data warden', user: approverUser, action: denied },
      { userType: 'HQ view-only user', user: hqUser, action: denied },
      { userType: 'unauthorised user', user: unauthorisedUser, action: denied },
    ])('should be $action to $userType', ({ user, action }) => {
      const testRequest = request
        .agent(appWithAllRoutes({ userSupplier: () => user }))
        .get(updateDetailsUrl)
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
