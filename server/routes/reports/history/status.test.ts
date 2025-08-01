import type { Express } from 'express'
import request from 'supertest'

import { IncidentReportingApi, type ReportWithDetails } from '../../../data/incidentReportingApi'
import { convertReportDates } from '../../../data/incidentReportingApiUtils'
import { mockErrorResponse, mockReport } from '../../../data/testData/incidentReporting'
import { mockSharedUser, mockUser } from '../../../data/testData/manageUsers'
import { mockThrownError } from '../../../data/testData/thrownErrors'
import { mockDataWarden, mockReportingOfficer, mockHqViewer, mockUnauthorisedUser } from '../../../data/testData/users'
import UserService from '../../../services/userService'
import { appWithAllRoutes } from '../../testutils/appSetup'
import { now } from '../../../testutils/fakeClock'

jest.mock('../../../data/incidentReportingApi')
jest.mock('../../../services/userService')

let app: Express
let incidentReportingApi: jest.Mocked<IncidentReportingApi>
let userService: jest.Mocked<UserService>

beforeEach(() => {
  incidentReportingApi = IncidentReportingApi.prototype as jest.Mocked<IncidentReportingApi>
  userService = UserService.prototype as jest.Mocked<UserService>
  app = appWithAllRoutes({ services: { userService } })
  userService.getUsers.mockResolvedValueOnce({
    [mockSharedUser.username]: mockSharedUser,
    user2: mockUser('user2', 'Mary Johnson'),
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Report status history', () => {
  let mockedReport: ReportWithDetails
  let statusHistoryUrl: string

  beforeEach(() => {
    mockedReport = convertReportDates(
      mockReport({ reportReference: '6543', reportDateAndTime: now, withDetails: true }),
    )
    incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(mockedReport)
    statusHistoryUrl = `/reports/${mockedReport.id}/history/status`
  })

  it('should 404 if report is not found', () => {
    const error = mockThrownError(mockErrorResponse({ status: 404, message: 'Report not found' }), 404)
    incidentReportingApi.getReportWithDetailsById.mockReset()
    incidentReportingApi.getReportWithDetailsById.mockRejectedValueOnce(error)

    return request(app)
      .get(statusHistoryUrl)
      .expect(404)
      .expect(res => {
        expect(res.text).toContain('Page not found')
      })
  })

  it('should show one item status history for a draft report', () => {
    return request(app)
      .get(statusHistoryUrl)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('Incident report 6543 – status history')
        expect(res.text).toContain('Draft')
        expect(res.text).toContain('by John Smith')
        expect(res.text).toContain('5 December 2023 at 12:34')
        expect(res.text).not.toContain('The history of status changes in NOMIS is not recorded')

        expect(incidentReportingApi.getReportWithDetailsById).toHaveBeenCalledTimes(1)

        expect(userService.getUsers.mock.calls).toHaveLength(1)
        const users = userService.getUsers.mock.calls[0][1]
        users.sort()
        expect(users).toEqual(['user1'])
      })
  })

  it('should show status history for a report that has changed status', () => {
    mockedReport.historyOfStatuses.push({
      status: 'AWAITING_REVIEW',
      changedAt: new Date(2023, 11, 6, 10, 20, 50),
      changedBy: 'user2',
    })

    return request(app)
      .get(statusHistoryUrl)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('Incident report 6543 – status history')
        expect(res.text).toContain('Draft')
        expect(res.text).toContain('by John Smith')
        expect(res.text).toContain('5 December 2023 at 12:34')
        expect(res.text).toContain('Awaiting review')
        expect(res.text).toContain('by Mary Johnson')
        expect(res.text).toContain('6 December 2023 at 10:20') // minutes don't round up apparently

        expect(incidentReportingApi.getReportWithDetailsById).toHaveBeenCalledTimes(1)

        expect(userService.getUsers.mock.calls).toHaveLength(1)
        const users = userService.getUsers.mock.calls[0][1]
        users.sort()
        expect(users).toEqual(['user1', 'user2'])
      })
  })

  it('should show a message for NOMIS-created reports', () => {
    mockedReport.createdInNomis = true

    return request(app)
      .get(statusHistoryUrl)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('The history of status changes in NOMIS is not recorded')
      })
  })

  describe('Permissions', () => {
    // NB: these test cases are simplified because the permissions class methods are thoroughly tested elsewhere

    const granted = 'granted' as const
    const denied = 'denied' as const
    it.each([
      { userType: 'reporting officer', user: mockReportingOfficer, action: granted },
      { userType: 'data warden', user: mockDataWarden, action: granted },
      { userType: 'HQ view-only user', user: mockHqViewer, action: granted },
      { userType: 'unauthorised user', user: mockUnauthorisedUser, action: denied },
    ])('should be $action to $userType', ({ user, action }) => {
      const testRequest = request(appWithAllRoutes({ services: { userService }, userSupplier: () => user }))
        .get(statusHistoryUrl)
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
