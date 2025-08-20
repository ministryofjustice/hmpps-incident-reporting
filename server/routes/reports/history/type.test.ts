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

const incidentReportingApi = IncidentReportingApi.prototype as jest.Mocked<IncidentReportingApi>
const userService = UserService.prototype as jest.Mocked<UserService>

let app: Express

beforeEach(() => {
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
    mockedReport = convertReportDates(
      mockReport({ reportReference: '6543', type: 'MISCELLANEOUS_1', reportDateAndTime: now, withDetails: true }),
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
        expect(res.text).toContain('Incident report 6543 – incident type history')
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
        type: 'ASSAULT_4',
        changedAt: now,
        changedBy: 'user1',
        questions: [
          {
            code: '5385',
            question: 'WHERE DID IT HAPPEN',
            label: 'Where did it happen?',
            additionalInformation: null,
            responses: [
              {
                code: '212870',
                response: 'CELL',
                label: 'Cell',
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
        type: 'DAMAGE_1',
        changedAt: now,
        changedBy: 'user2',
        questions: [
          {
            code: '8242',
            question: 'WAS ANYONE HURT',
            label: 'Was anyone hurt?',
            additionalInformation: null,
            responses: [
              {
                code: '179784',
                response: 'YES',
                label: 'Yes',
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
        expect(res.text).toContain('Incident report 6543 – incident type history')
        expect(res.text).not.toContain('This report’s type has not been changed')
        expect(res.text).toContain('moj-timeline')

        expect(res.text).toContain('Assault')
        expect(res.text).toContain('by John Smith')
        expect(res.text).toContain('Where did it happen?')
        expect(res.text).toContain('4 December 2023')
        expect(res.text).toContain('Cell')
        expect(res.text).toContain('A-003')
        expect(res.text).not.toContain('WHERE DID IT HAPPEN')
        expect(res.text).not.toContain('CELL')

        expect(res.text).toContain('Deliberate damage')
        expect(res.text).toContain('by Mary Johnson')
        expect(res.text).toContain('Was anyone hurt?')
        expect(res.text).toContain('Yes')
        expect(res.text).not.toContain('WAS ANYONE HURT')
        expect(res.text).not.toContain('YES')

        // current type not listed
        expect(res.text).not.toContain('MISCELLANEOUS_1')
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
      { userType: 'reporting officer', user: mockReportingOfficer, action: granted },
      { userType: 'data warden', user: mockDataWarden, action: granted },
      { userType: 'HQ view-only user', user: mockHqViewer, action: granted },
      { userType: 'unauthorised user', user: mockUnauthorisedUser, action: denied },
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
