import type { Express } from 'express'
import request from 'supertest'

import { IncidentReportingApi, ReportWithDetails } from '../../../../data/incidentReportingApi'
import { convertBasicReportDates, convertReportWithDetailsDates } from '../../../../data/incidentReportingApiUtils'
import type { User } from '../../../../data/manageUsersApiClient'
import { mockErrorResponse, mockReport } from '../../../../data/testData/incidentReporting'
import { appWithAllRoutes } from '../../../testutils/appSetup'
import { now } from '../../../../testutils/fakeClock'
import UserService from '../../../../services/userService'
import { mockThrownError } from '../../../../data/testData/thrownErrors'

jest.mock('../../../../data/incidentReportingApi')
jest.mock('../../../../services/userService')

let app: Express
let incidentReportingApi: jest.Mocked<IncidentReportingApi>
let userService: jest.Mocked<UserService>

beforeEach(() => {
  userService = UserService.prototype as jest.Mocked<UserService>
  app = appWithAllRoutes({ services: { userService } })
  incidentReportingApi = IncidentReportingApi.prototype as jest.Mocked<IncidentReportingApi>

  const users: Record<string, User> = {
    user1: {
      username: 'user1',
      name: 'John Smith',
    },
    lev79n: {
      username: 'lev79n',
      name: 'Barry Harrison',
    },
  }
  userService.getUsers.mockResolvedValueOnce(users)
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET staff summary for report', () => {
  let summaryUrl: string

  // TODO: permissions tests

  it('should 404 if report is not found', () => {
    const error = mockThrownError(mockErrorResponse({ status: 404, message: 'Report not found' }), 404)
    incidentReportingApi.getReportWithDetailsById.mockRejectedValueOnce(error)

    summaryUrl = '/reports/01952368-477f-72e9-a239-265ad6e9ec56/staff'

    return request(app)
      .get(summaryUrl)
      .expect(404)
      .expect(res => {
        expect(res.text).toContain('Page not found')
      })
  })

  it('should render staff summary table and add staff form for DPS report with existing prisoners involved', () => {
    const mockedReport = convertReportWithDetailsDates(
      mockReport({ reportReference: '6543', reportDateAndTime: now, withDetails: true }),
    )
    incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(mockedReport)
    summaryUrl = `/reports/${mockedReport.id}/staff`
    return request(app)
      .get(summaryUrl)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Staff involved')
        expect(res.text).toContain('Mary Johnson')
        expect(res.text).toContain('Actively involved')
        expect(res.text).toContain('Comment about Mary')
        expect(res.text).toContain('Remove')
        expect(res.text).toContain('Edit')
        expect(res.text).toContain('Do you want to add another member of staff?')
        expect(res.text).toContain('Continue')
        expect(res.text).toContain('Save and exit')
        // TODO: test links
        expect(incidentReportingApi.getReportWithDetailsById).toHaveBeenCalledTimes(1)
      })
  })

  it('should not render staff summary table and only add staff form if no existing staff involved', () => {
    const mockedReport = convertBasicReportDates(
      mockReport({ reportReference: '6543', reportDateAndTime: now }),
    ) as ReportWithDetails
    incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(mockedReport)
    summaryUrl = `/reports/${mockedReport.id}/staff`
    return request(app)
      .get(summaryUrl)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('No staff members have been added to this incident report.')
        expect(res.text).not.toContain('Role')
        expect(res.text).not.toContain('>Details')
        expect(res.text).not.toContain('Action')
        expect(res.text).not.toContain('Remove')
        expect(res.text).not.toContain('Edit')
        expect(res.text).toContain('Do you want to add a member of staff?')
        expect(res.text).toContain('Continue')
        expect(res.text).toContain('Save and exit')
        expect(incidentReportingApi.getReportWithDetailsById).toHaveBeenCalledTimes(1)
      })
  })
})
