import type { Express } from 'express'
import request from 'supertest'

import { IncidentReportingApi, type ReportWithDetails } from '../../../data/incidentReportingApi'
import { convertReportWithDetailsDates } from '../../../data/incidentReportingApiUtils'
import { mockErrorResponse, mockReport } from '../../../data/testData/incidentReporting'
import { mockSharedUser, mockUser } from '../../../data/testData/manageUsers'
import { mockThrownError } from '../../../data/testData/thrownErrors'
import { reportingUser, approverUser, hqUser, unauthorisedUser } from '../../../data/testData/users'
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

describe('Report incident type history', () => {
  let mockedReport: ReportWithDetails
  let typeHistoryUrl: string

  beforeEach(() => {
    mockedReport = convertReportWithDetailsDates(
      mockReport({ reportReference: '6543', type: 'MISCELLANEOUS', reportDateAndTime: now, withDetails: true }),
    )
    incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(mockedReport)
    typeHistoryUrl = `/reports/${mockedReport.id}/history/type`
  })

  it('should 404 if report is not found', () => {
    const error = mockThrownError(mockErrorResponse({ status: 404, message: 'Report not found' }), 404)
    incidentReportingApi.getReportWithDetailsById.mockReset()
    incidentReportingApi.getReportWithDetailsById.mockRejectedValueOnce(error)

    return request(app)
      .get(typeHistoryUrl)
      .expect(404)
      .expect(res => {
        expect(res.text).toContain('Page not found')
      })
  })

  it('should show a message if the type has not been changed and therefore there is no history', () => {
    mockedReport.history = []

    return request(app)
      .get(typeHistoryUrl)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('Incident reference 6543 – incident type history')
        expect(res.text).toContain('This report’s type has not been changed')
        expect(res.text).not.toContain('moj-timeline')

        expect(incidentReportingApi.getReportWithDetailsById).toHaveBeenCalledTimes(1)

        expect(userService.getUsers.mock.calls).toHaveLength(1)
        const users = userService.getUsers.mock.calls[0][1]
        users.sort()
        expect(users).toEqual([])
      })
  })

  it('should show the history of a report that has changed type', () => {
    mockedReport.history = [
      {
        type: 'OLD_ASSAULT3',
        changedAt: now,
        changedBy: 'user1',
        questions: [
          {
            code: 'WHERE DID IT HAPPEN',
            question: 'Where did it happen?',
            additionalInformation: null,
            responses: [
              {
                response: 'CELL',
                responseDate: new Date(2023, 11, 4),
                additionalInformation: 'A-003',
                recordedBy: 'user1',
                recordedAt: now,
              },
            ],
          },
        ],
      },
      {
        type: 'DAMAGE',
        changedAt: now,
        changedBy: 'user2',
        questions: [
          {
            code: 'WAS ANYONE HURT',
            question: 'Was anyone hurt?',
            additionalInformation: null,
            responses: [
              {
                response: 'YES',
                responseDate: null,
                additionalInformation: null,
                recordedBy: 'user2',
                recordedAt: now,
              },
            ],
          },
        ],
      },
    ]

    return request(app)
      .get(typeHistoryUrl)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('Incident reference 6543 – incident type history')
        expect(res.text).not.toContain('This report’s type has not been changed')
        expect(res.text).toContain('moj-timeline')

        expect(res.text).toContain('Assault (from April 2017)')
        expect(res.text).toContain('by John Smith')
        expect(res.text).toContain('Where did it happen?')
        expect(res.text).toContain('Date: 4 December 2023')
        expect(res.text).toContain('Comment: A-003')

        expect(res.text).toContain('Damage')
        expect(res.text).toContain('by Mary Johnson')
        expect(res.text).toContain('Was anyone hurt?')
        expect(res.text).toContain('YES')

        // current type not listed
        expect(res.text).not.toContain('MISCELLANEOUS')
        expect(res.text).not.toContain('Miscellaneous')

        expect(incidentReportingApi.getReportWithDetailsById).toHaveBeenCalledTimes(1)

        expect(userService.getUsers.mock.calls).toHaveLength(1)
        const users = userService.getUsers.mock.calls[0][1]
        users.sort()
        expect(users).toEqual(['user1', 'user2'])
      })
  })

  describe('Permissions', () => {
    // NB: these test cases are simplified because the permissions class methods are thoroughly tested elsewhere

    const granted = 'granted' as const
    const denied = 'denied' as const
    it.each([
      { userType: 'reporting officer', user: reportingUser, action: granted },
      { userType: 'data warden', user: approverUser, action: granted },
      { userType: 'HQ view-only user', user: hqUser, action: granted },
      { userType: 'unauthorised user', user: unauthorisedUser, action: denied },
    ])('should be $action to $userType', ({ user, action }) => {
      const testRequest = request(appWithAllRoutes({ services: { userService }, userSupplier: () => user }))
        .get(typeHistoryUrl)
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
