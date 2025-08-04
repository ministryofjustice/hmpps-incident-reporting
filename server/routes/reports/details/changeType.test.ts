import request, { type Agent } from 'supertest'

import { appWithAllRoutes } from '../../testutils/appSetup'
import { IncidentReportingApi, type ReportWithDetails } from '../../../data/incidentReportingApi'
import { convertReportDates } from '../../../data/incidentReportingApiUtils'
import { PrisonApi } from '../../../data/prisonApi'
import { mockErrorResponse, mockReport } from '../../../data/testData/incidentReporting'
import { moorland } from '../../../data/testData/prisonApi'
import { mockThrownError } from '../../../data/testData/thrownErrors'
import { mockDataWarden, mockReportingOfficer, mockHqViewer, mockUnauthorisedUser } from '../../../data/testData/users'
import { types } from '../../../reportConfiguration/constants'
import { now } from '../../../testutils/fakeClock'

jest.mock('../../../data/incidentReportingApi')
jest.mock('../../../data/prisonApi')

let agent: Agent
let incidentReportingApi: jest.Mocked<IncidentReportingApi>
let prisonApi: jest.Mocked<PrisonApi>

beforeEach(() => {
  agent = request.agent(appWithAllRoutes())
  incidentReportingApi = IncidentReportingApi.prototype as jest.Mocked<IncidentReportingApi>
  prisonApi = PrisonApi.prototype as jest.Mocked<PrisonApi>
  prisonApi.getPrison.mockResolvedValueOnce(moorland)
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Changing incident type', () => {
  let mockedReport: ReportWithDetails

  let confirmationUrl: string
  let selectUrl: string

  beforeEach(() => {
    mockedReport = convertReportDates(
      mockReport({
        type: 'DISORDER_2',
        reportReference: '6544',
        reportDateAndTime: now,
        withDetails: true,
      }),
    )
    confirmationUrl = `/reports/${mockedReport.id}/change-type`
    selectUrl = `/reports/${mockedReport.id}/change-type/select`

    incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(mockedReport)
    incidentReportingApi.changeReportType.mockRejectedValue(new Error('should not be called'))
  })

  it('should 404 if report is not found', () => {
    const error = mockThrownError(mockErrorResponse({ status: 404, message: 'Report not found' }), 404)
    incidentReportingApi.getReportWithDetailsById.mockReset()
    incidentReportingApi.getReportWithDetailsById.mockRejectedValueOnce(error)

    return agent
      .get(confirmationUrl)
      .expect(404)
      .expect(res => {
        expect(res.text).toContain('Page not found')
      })
  })

  it.each([
    'UPDATED',
    'ON_HOLD',
    'WAS_CLOSED',
    'DUPLICATE',
    'NOT_REPORTABLE',
    'CLOSED',
    'POST_INCIDENT_UPDATE',
  ] as const)('should not be allowed if report has status %s', status => {
    mockedReport.status = status

    return agent
      .get(confirmationUrl)
      .expect(302)
      .expect(res => {
        expect(res.redirect).toBe(true)
        expect(res.header.location).toEqual('/sign-out')
      })
  })

  it.each(['DRAFT', 'AWAITING_REVIEW', 'NEEDS_UPDATING', 'REOPENED'] as const)(
    'should show a confirmation page first if report status is %s',
    status => {
      mockedReport.status = status

      return agent
        .get(confirmationUrl)
        .expect(200)
        .expect(res => {
          expect(res.request.url.endsWith('/change-type')).toBe(true)
          expect(res.text).toContain('app-confirm-change-type')
          expect(res.text).toContain('Most of your answers will be deleted')
        })
    },
  )

  describe('After confirmation page', () => {
    beforeEach(async () => {
      await agent.post(confirmationUrl).send({})
      incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(mockedReport)
    })

    it('should list active incident types apart from current one', () => {
      return agent
        .get(selectUrl)
        .expect(200)
        .expect(res => {
          expect(res.request.url.endsWith('/change-type/select')).toBe(true)

          expect(res.text).toContain('app-type')

          expect(res.text).toContain('Select the incident type')
          types.forEach(type => {
            if (type.code === mockedReport.type || !type.active) {
              expect(res.text).not.toContain(type.code)
              // TODO: there is overlap with active types
              // expect(res.text).not.toContain(type.description)
            } else {
              expect(res.text).toContain(type.code)
              expect(res.text).toContain(type.description)
            }
          })

          expect(res.text).not.toContain('There is a problem')
          expect(res.text).not.toContain('Choose one of the options')
        })
    })

    it.each([
      { scenario: 'no option is selected', invalidPayload: {} },
      { scenario: 'an inactive type is submitted', invalidPayload: { type: 'DISORDER_1' } },
      { scenario: 'current type is submitted', invalidPayload: { type: 'DISORDER_2' } },
    ])('should show an error if $scenario', ({ invalidPayload }) => {
      incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(mockedReport) // due to redirect

      return agent
        .post(selectUrl)
        .send(invalidPayload)
        .expect(200)
        .redirects(1)
        .expect(res => {
          expect(res.request.url.endsWith('/change-type/select')).toBe(true)
          expect(res.text).toContain('app-type')
          expect(res.text).toContain('There is a problem')
          expect(res.text).toContain('Select the incident type')
          expect(incidentReportingApi.changeReportType).not.toHaveBeenCalled()
          expect(incidentReportingApi.updateReport).not.toHaveBeenCalled()
        })
    })

    it('should send request to API if form is valid and proceed to next step', () => {
      incidentReportingApi.changeReportType.mockReset()
      incidentReportingApi.changeReportType.mockResolvedValueOnce(mockedReport) // NB: response is ignored
      incidentReportingApi.updateReport.mockResolvedValueOnce(mockedReport) // NB: response is ignored
      incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(mockedReport) // due to redirect

      return agent
        .post(selectUrl)
        .send({ type: 'MISCELLANEOUS_1' })
        .redirects(1)
        .expect(200)
        .expect(res => {
          expect(res.request.url.endsWith(`/create-report/${mockedReport.id}/prisoners`)).toBe(true)
          expect(incidentReportingApi.changeReportType).toHaveBeenCalledWith(mockedReport.id, {
            newType: 'MISCELLANEOUS_1',
          })
          expect(incidentReportingApi.updateReport).toHaveBeenCalledWith(mockedReport.id, {
            title: expect.any(String),
          })
        })
    })

    it('should show an error if API rejects changing type', () => {
      const error = mockThrownError(mockErrorResponse({ message: 'Type is inactive' }))
      incidentReportingApi.changeReportType.mockReset()
      incidentReportingApi.changeReportType.mockRejectedValueOnce(error)
      incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(mockedReport) // due to redirect

      return agent
        .post(selectUrl)
        .send({ type: 'MISCELLANEOUS_1' })
        .redirects(1)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('There is a problem')
          expect(res.text).toContain('Sorry, there was a problem with your request')
          expect(res.text).not.toContain('Bad Request')
          expect(res.text).not.toContain('Type is inactive')
          expect(incidentReportingApi.updateReport).not.toHaveBeenCalled()
        })
    })

    it('should not show an error if API rejects updating title', () => {
      incidentReportingApi.changeReportType.mockReset()
      incidentReportingApi.changeReportType.mockResolvedValueOnce(mockedReport) // NB: response is ignored
      const error = mockThrownError(mockErrorResponse({ message: 'Title is too long' }))
      incidentReportingApi.updateReport.mockRejectedValueOnce(error)

      return agent
        .post(selectUrl)
        .send({ type: 'MISCELLANEOUS_1' })
        .expect(302)
        .expect(res => {
          expect(res.text).not.toContain('There is a problem')
          expect(res.text).not.toContain('Sorry, there was a problem with your request')
          expect(res.redirect).toBe(true)
          expect(res.header.location).toEqual(`/create-report/${mockedReport.id}/prisoners`)

          expect(incidentReportingApi.updateReport).toHaveBeenCalledWith(mockedReport.id, {
            title: expect.any(String),
          })
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
        .get(confirmationUrl)
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
