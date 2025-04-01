import request, { type Agent } from 'supertest'

import { appWithAllRoutes } from '../../testutils/appSetup'
import { IncidentReportingApi, type ReportBasic, ReportWithDetails } from '../../../data/incidentReportingApi'
import { convertBasicReportDates } from '../../../data/incidentReportingApiUtils'
import { mockErrorResponse, mockReport } from '../../../data/testData/incidentReporting'
import { mockThrownError } from '../../../data/testData/thrownErrors'
import { approverUser, hqUser, reportingUser, unauthorisedUser } from '../../../data/testData/users'
import { types } from '../../../reportConfiguration/constants'
import { now } from '../../../testutils/fakeClock'

jest.mock('../../../data/incidentReportingApi')

let agent: Agent
let incidentReportingApi: jest.Mocked<IncidentReportingApi>

beforeEach(() => {
  agent = request.agent(appWithAllRoutes())
  incidentReportingApi = IncidentReportingApi.prototype as jest.Mocked<IncidentReportingApi>
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Changing incident type', () => {
  let mockedReport: ReportBasic

  let confirmationUrl: string
  let selectUrl: string

  beforeEach(() => {
    mockedReport = convertBasicReportDates(
      mockReport({
        type: 'DISORDER',
        reportReference: '6544',
        reportDateAndTime: now,
      }),
    )
    confirmationUrl = `/reports/${mockedReport.id}/change-type`
    selectUrl = `/reports/${mockedReport.id}/change-type/select`

    incidentReportingApi.getReportById.mockResolvedValueOnce(mockedReport)
    incidentReportingApi.changeReportType.mockRejectedValue(new Error('should not be called'))
  })

  it('should 404 if report is not found', () => {
    const error = mockThrownError(mockErrorResponse({ status: 404, message: 'Report not found' }), 404)
    incidentReportingApi.getReportById.mockReset()
    incidentReportingApi.getReportById.mockRejectedValueOnce(error)

    return agent
      .get(confirmationUrl)
      .expect(404)
      .expect(res => {
        expect(res.text).toContain('Page not found')
      })
  })

  it('should redirect if report is not a draft', () => {
    mockedReport.status = 'AWAITING_ANALYSIS'
    return agent
      .get(confirmationUrl)
      .expect(302)
      .expect(res => {
        expect(res.redirect).toBe(true)
        expect(res.header.location).toEqual(`/reports/${mockedReport.id}`)
      })
  })

  it('should show a confirmation page first', () => {
    return agent
      .get(confirmationUrl)
      .expect(200)
      .expect(res => {
        expect(res.request.url.endsWith('/change-type')).toBe(true)
        expect(res.text).toContain('app-confirm-change-type')
        expect(res.text).toContain('Some of your answers will be deleted')
      })
  })

  describe('After confirmation page', () => {
    beforeEach(async () => {
      await agent.post(confirmationUrl).send({})
      incidentReportingApi.getReportById.mockResolvedValueOnce(mockedReport)
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
      { scenario: 'an inactive type is submitted', invalidPayload: { type: 'OLD_DISORDER' } },
      { scenario: 'current type is submitted', invalidPayload: { type: 'DISORDER' } },
    ])('should show an error if $scenario', ({ invalidPayload }) => {
      incidentReportingApi.getReportById.mockResolvedValueOnce(mockedReport) // due to redirect

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
        })
    })

    it('should send request to API if form is valid and proceed to next step', () => {
      incidentReportingApi.changeReportType.mockReset()
      incidentReportingApi.changeReportType.mockResolvedValueOnce(mockedReport as ReportWithDetails) // mock is basic but value is unused anyway

      return agent
        .post(selectUrl)
        .send({ type: 'MISCELLANEOUS' })
        .expect(302)
        .expect(res => {
          expect(res.redirect).toBe(true)
          expect(res.header.location).toEqual(`/reports/${mockedReport.id}`)
          expect(incidentReportingApi.changeReportType).toHaveBeenCalledWith(mockedReport.id, {
            newType: 'MISCELLANEOUS',
          })
        })
    })

    it('should show an error if API rejects request', () => {
      const error = mockThrownError(mockErrorResponse({ message: 'Type is inactive' }))
      incidentReportingApi.changeReportType.mockReset()
      incidentReportingApi.changeReportType.mockRejectedValueOnce(error)
      incidentReportingApi.getReportById.mockResolvedValueOnce(mockedReport) // due to redirect

      return agent
        .post(selectUrl)
        .send({ type: 'MISCELLANEOUS' })
        .redirects(1)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('There is a problem')
          expect(res.text).toContain('Sorry, there was a problem with your request')
          expect(res.text).not.toContain('Bad Request')
          expect(res.text).not.toContain('Type is inactive')
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
