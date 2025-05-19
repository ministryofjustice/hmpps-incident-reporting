import type { Express } from 'express'
import request, { type Agent, type Response } from 'supertest'

import format from '../../../utils/format'
import { appWithAllRoutes } from '../../testutils/appSetup'
import { IncidentReportingApi } from '../../../data/incidentReportingApi'
import { convertBasicReportDates } from '../../../data/incidentReportingApiUtils'
import { mockErrorResponse, mockReport } from '../../../data/testData/incidentReporting'
import { mockThrownError } from '../../../data/testData/thrownErrors'
import { approverUser, hqUser, reportingUser, unauthorisedUser } from '../../../data/testData/users'
import { type Status } from '../../../reportConfiguration/constants'

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

describe('Updating report incident date and time', () => {
  const incidentDateAndTime = new Date('2024-10-21T16:32:00+01:00')
  const reportBasic = convertBasicReportDates(
    mockReport({
      type: 'DISORDER_2',
      reportReference: '6544',
      reportDateAndTime: incidentDateAndTime,
    }),
  )
  reportBasic.status = 'IN_ANALYSIS'
  const updateIncidentDateAndTimeUrl = `/reports/${reportBasic.id}/update-date-and-time`
  const validPayload = {
    incidentDate: '21/10/2024',
    '_incidentTime-hours': '16',
    '_incidentTime-minutes': '32',
  }

  let agent: Agent

  beforeEach(() => {
    agent = request.agent(app)
    incidentReportingApi.getReportById.mockResolvedValue(reportBasic)
  })

  function expectOnDetailsPage(res: Response): void {
    expect(res.request.url.endsWith(updateIncidentDateAndTimeUrl)).toBe(true)
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
      .get(updateIncidentDateAndTimeUrl)
      .expect(404)
      .expect(res => {
        expect(res.text).toContain('Page not found')
      })
  })

  it('should display form prefilled with existing incident date and time', () => {
    return agent
      .get(updateIncidentDateAndTimeUrl)
      .expect(200)
      .expect(res => {
        expectOnDetailsPage(res)
        expect(res.text).not.toContain('There is a problem')
        expect(res.text).toContain('value="21/10/2024"')
        expect(res.text).toContain('value="15"')
        expect(res.text).toContain('value="32"')
      })
  })

  it('should not include date-checking component', () => {
    return agent
      .get(updateIncidentDateAndTimeUrl)
      .expect(200)
      .expect(res => {
        expect(res.text).not.toContain('<dialog')
        expect(res.text).not.toContain('app-dialogue')
      })
  })

  it.each([
    { missingField: 'incidentDate', expectedError: 'Enter the date of the incident' },
    { missingField: '_incidentTime-hours', expectedError: 'Enter the time of the incident using the 24 hour clock' },
    { missingField: '_incidentTime-minutes', expectedError: 'Enter the time of the incident using the 24 hour clock' },
  ])('should show an error if $missingField is left empty', ({ missingField, expectedError }) => {
    const invalidPayload = {
      ...validPayload,
      [missingField]: '',
    }
    return agent
      .post(updateIncidentDateAndTimeUrl)
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
    {
      scenario: 'date cannot be parsed',
      invalidPayload: { ...validPayload, incidentDate: 'yesterday' },
      errorMessage: 'Enter the date of the incident using the format DD MM YYYY',
    },
    {
      scenario: 'date in incorrect format',
      invalidPayload: { ...validPayload, incidentDate: '02/27/2024' },
      errorMessage: 'Enter the date of the incident using the format DD MM YYYY',
    },
    {
      scenario: 'time is invalid',
      invalidPayload: { ...validPayload, '_incidentTime-hours': '10', '_incidentTime-minutes': 'am' },
      errorMessage: 'Enter the time of the incident using the 24 hour clock',
    },
  ])('should show an error if $scenario', ({ invalidPayload, errorMessage }) => {
    return agent
      .post(updateIncidentDateAndTimeUrl)
      .send(invalidPayload)
      .redirects(1)
      .expect(200)
      .expect(res => {
        expectOnDetailsPage(res)
        expect(res.text).toContain('There is a problem')
        expect(res.text).toContain(errorMessage)
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
      errorMessage: 'Time of the incident must be in the past',
    },
    {
      scenario: 'tomorrow',
      dateCalculator: () => {
        const date = new Date()
        date.setDate(date.getDate() + 1)
        return date
      },
      errorMessage: 'Date of the incident must be today or in the past',
    },
  ])('should show an error if date and/or time is in the future, $scenario', ({ dateCalculator, errorMessage }) => {
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
      .post(updateIncidentDateAndTimeUrl)
      .send(invalidPayload)
      .redirects(1)
      .expect(200)
      .expect(res => {
        expectOnDetailsPage(res)
        expect(res.text).toContain('There is a problem')
        expect(res.text).toContain(errorMessage)
      })
  })

  it('should redisplay form input values when showing an error', () => {
    const invalidPayload = {
      ...validPayload,
      '_incidentTime-hours': '24',
    }
    return agent
      .post(updateIncidentDateAndTimeUrl)
      .send(invalidPayload)
      .redirects(1)
      .expect(200)
      .expect(res => {
        expectOnDetailsPage(res)
        expect(res.text).toContain('There is a problem')
        expect(res.text).toContain('value="21/10/2024"')
        expect(res.text).toContain('value="24"')
        expect(res.text).toContain('value="32"')
      })
  })

  it('should send request to API if form is valid and proceed to next step', () => {
    incidentReportingApi.updateReport.mockResolvedValueOnce(reportBasic)

    return agent
      .post(updateIncidentDateAndTimeUrl)
      .send(validPayload)
      .redirects(0)
      .expect(302)
      .expect(res => {
        expectRedirectToReportPage(res)
        expect(incidentReportingApi.updateReport).toHaveBeenCalledWith(reportBasic.id, {
          incidentDateAndTime,
          updateEvent: true,
        })
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
        .get(updateIncidentDateAndTimeUrl)
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

describe('redirect if status before DW has seen report', () => {
  const incidentDateAndTime = new Date('2024-10-21T16:32:00+01:00')
  const reportBasic = convertBasicReportDates(
    mockReport({
      type: 'DISORDER_2',
      reportReference: '6544',
      reportDateAndTime: incidentDateAndTime,
    }),
  )

  const updateIncidentDateAndTimeUrl = `/reports/${reportBasic.id}/update-date-and-time`
  const updateDetailsUrl = `/reports/${reportBasic.id}/update-details`

  let agent: Agent

  beforeEach(() => {
    agent = request.agent(app)
    incidentReportingApi.getReportById.mockResolvedValue(reportBasic)
  })

  it.each([
    { status: 'DRAFT', redirect: true },
    { status: 'AWAITING_ANALYSIS', redirect: true },
    { status: 'IN_ANALYSIS', redirect: false },
    { status: 'INFORMATION_REQUIRED', redirect: false },
    { status: 'INFORMATION_AMENDED', redirect: false },
    { status: 'CLOSED', redirect: false },
    { status: 'INCIDENT_UPDATED', redirect: false },
    { status: 'DUPLICATE', redirect: false },
  ])('report status of $status redirects page: $redirect', ({ status, redirect }) => {
    reportBasic.status = status as Status
    const testAgent = agent.get(updateIncidentDateAndTimeUrl).redirects(1)
    if (!redirect) {
      return testAgent.expect(200)
    }
    return testAgent.expect(res => {
      expect(res.redirects[0]).toContain(updateDetailsUrl)
    })
  })
})
