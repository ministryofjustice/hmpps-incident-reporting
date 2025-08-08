import type { Express } from 'express'
import request, { type Agent, type Response } from 'supertest'

import format from '../../../utils/format'
import { appWithAllRoutes } from '../../testutils/appSetup'
import { mockHandleReportEdit } from '../../testutils/handleReportEdit'
import { IncidentReportingApi } from '../../../data/incidentReportingApi'
import { convertReportDates } from '../../../data/incidentReportingApiUtils'
import { mockErrorResponse, mockReport } from '../../../data/testData/incidentReporting'
import { mockThrownError } from '../../../data/testData/thrownErrors'
import { mockDataWarden, mockReportingOfficer, mockHqViewer, mockUnauthorisedUser } from '../../../data/testData/users'
import type { Status } from '../../../reportConfiguration/constants'

jest.mock('../../../data/incidentReportingApi')
jest.mock('../actions/handleReportEdit')

const incidentReportingApi = IncidentReportingApi.prototype as jest.Mocked<IncidentReportingApi>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes()
  mockHandleReportEdit.withoutSideEffect()
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Updating report details', () => {
  const incidentDateAndTime = new Date('2024-10-21T16:32:00+01:00')
  const reportBasic = convertReportDates(
    mockReport({
      type: 'DISORDER_2',
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
    { missingField: 'incidentDate', expectedError: 'Enter the date of the incident' },
    { missingField: '_incidentTime-hours', expectedError: 'Enter the time of the incident using the 24 hour clock' },
    { missingField: '_incidentTime-minutes', expectedError: 'Enter the time of the incident using the 24 hour clock' },
    { missingField: 'description', expectedError: 'Enter a description of the incident' },
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
      .post(updateDetailsUrl)
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
      .post(updateDetailsUrl)
      .send(invalidPayload)
      .redirects(1)
      .expect(200)
      .expect(res => {
        expectOnDetailsPage(res)
        expect(res.text).toContain('There is a problem')
        expect(res.text).toContain(errorMessage)
        expect(incidentReportingApi.updateReport).not.toHaveBeenCalled()
        mockHandleReportEdit.expectNotCalled()
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

  it('should send request to API if form is valid and proceed to next step', () => {
    incidentReportingApi.updateReport.mockResolvedValueOnce(reportBasic) // NB: response is ignored

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
        })
        mockHandleReportEdit.expectCalled()
      })
  })

  it('should show an error if API rejects update', () => {
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

  it('should show an error if API rejects (possible) status change', () => {
    incidentReportingApi.updateReport.mockResolvedValueOnce(reportBasic) // NB: response is ignored
    mockHandleReportEdit.failure()

    return agent
      .post(updateDetailsUrl)
      .send(validPayload)
      .redirects(1)
      .expect(200)
      .expect(res => {
        expectOnDetailsPage(res)
        expect(res.text).toContain('There is a problem')
        expect(res.text).toContain('Sorry, there was a problem with your request')
      })
  })

  describe('Cannot be used after data warden review', () => {
    afterAll(() => {
      reportBasic.status = 'DRAFT'
    })

    const scenarios: {
      status: Status
      result:
        | 'allow editing date and description'
        | 'redirect to incident date page'
        | 'forbid editing date and description'
    }[] = [
      { status: 'DRAFT', result: 'allow editing date and description' },
      { status: 'AWAITING_REVIEW', result: 'allow editing date and description' },
      { status: 'ON_HOLD', result: 'forbid editing date and description' },
      { status: 'NEEDS_UPDATING', result: 'redirect to incident date page' },
      { status: 'UPDATED', result: 'forbid editing date and description' },
      { status: 'CLOSED', result: 'forbid editing date and description' },
      { status: 'DUPLICATE', result: 'forbid editing date and description' },
      { status: 'NOT_REPORTABLE', result: 'forbid editing date and description' },
      { status: 'REOPENED', result: 'redirect to incident date page' },
      { status: 'WAS_CLOSED', result: 'forbid editing date and description' },
    ]
    it.each(scenarios)('should $result when report status is $status', ({ status, result }) => {
      reportBasic.status = status
      const testAgent = agent.get(updateDetailsUrl).redirects(1)
      if (result === 'allow editing date and description') {
        return testAgent.expect(200)
      }
      return testAgent.expect(res => {
        const redirectedTo = res.redirects[0]
        if (result === 'redirect to incident date page') {
          expect(redirectedTo).toContain(`/reports/${reportBasic.id}/update-date-and-time`)
        } else {
          expect(redirectedTo).toContain('/sign-out')
        }
      })
    })
  })

  describe('Permissions', () => {
    // NB: these test cases are simplified because the permissions class methods are thoroughly tested elsewhere

    const granted = 'granted' as const
    const denied = 'denied' as const
    it.each([
      { userType: 'reporting officer', user: mockReportingOfficer, action: granted },
      { userType: 'data warden', user: mockDataWarden, action: denied },
      { userType: 'HQ view-only user', user: mockHqViewer, action: denied },
      { userType: 'unauthorised user', user: mockUnauthorisedUser, action: denied },
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
