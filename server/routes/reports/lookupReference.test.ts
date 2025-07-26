import request from 'supertest'

import { appWithAllRoutes } from '../testutils/appSetup'
import { IncidentReportingApi } from '../../data/incidentReportingApi'
import { convertBasicReportDates } from '../../data/incidentReportingApiUtils'
import { mockErrorResponse, mockReport } from '../../data/testData/incidentReporting'
import { mockThrownError } from '../../data/testData/thrownErrors'
import { now } from '../../testutils/fakeClock'

jest.mock('../../data/incidentReportingApi')

let incidentReportingApi: jest.Mocked<IncidentReportingApi>

beforeEach(() => {
  incidentReportingApi = IncidentReportingApi.prototype as jest.Mocked<IncidentReportingApi>
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Look up report by incident number', () => {
  it('should redirect to a report that user has permission to view', () => {
    const report = convertBasicReportDates(
      mockReport({
        reportReference: '6543',
        // prison accessible
        location: 'MDI',
        reportDateAndTime: now,
      }),
    )
    incidentReportingApi.getReportByReference.mockResolvedValueOnce(report)

    return request(appWithAllRoutes())
      .get('/reports/incident-number/6543')
      .expect(302)
      .expect(res => {
        expect(res.redirect).toBe(true)
        expect(res.header.location).toEqual(`/reports/${report.id}`)
      })
  })

  it('should 404 for a report that user does not have permission to view', () => {
    const report = convertBasicReportDates(
      mockReport({
        reportReference: '6543',
        // prison not accessible
        location: 'LGI',
        reportDateAndTime: now,
      }),
    )
    incidentReportingApi.getReportByReference.mockResolvedValueOnce(report)

    return request(appWithAllRoutes())
      .get('/reports/incident-number/6543')
      .expect(404)
      .expect(res => {
        expect(res.text).toContain('Page not found')
      })
  })

  it('should 404 for a report that whose reference is not found', () => {
    const error = mockThrownError(mockErrorResponse({ status: 404, message: 'Report not found' }), 404)
    incidentReportingApi.getReportByReference.mockRejectedValueOnce(error)

    return request(appWithAllRoutes())
      .get('/reports/incident-number/6543')
      .expect(404)
      .expect(res => {
        expect(res.text).toContain('Page not found')
      })
  })

  it('should show an error if report cannot be looked up', () => {
    const error = mockThrownError(mockErrorResponse({ status: 500, message: 'External problem' }), 500)
    incidentReportingApi.getReportByReference.mockRejectedValueOnce(error)

    return request(appWithAllRoutes())
      .get('/reports/incident-number/6543')
      .expect(res => {
        expect(res.text).toContain('Sorry, there is a problem with the service')
      })
  })
})
