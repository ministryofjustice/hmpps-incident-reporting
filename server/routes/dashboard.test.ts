import type { Express } from 'express'
import request from 'supertest'

import { PrisonApi } from '../data/prisonApi'
import { appWithAllRoutes } from './testutils/appSetup'
import { IncidentReportingApi } from '../data/incidentReportingApi'
import { mockReport } from '../data/testData/incidentReporting'
import { unsortedPageOf } from '../data/testData/paginatedResponses'
import { convertBasicReportDates } from '../data/incidentReportingApiUtils'
import UserService from '../services/userService'
import type { User } from '../data/manageUsersApiClient'
import { leeds, moorland } from '../data/testData/prisonApi'

jest.mock('../data/prisonApi')
jest.mock('../data/incidentReportingApi')
jest.mock('../services/userService')

let app: Express
let incidentReportingApi: jest.Mocked<IncidentReportingApi>
let userService: jest.Mocked<UserService>
let prisonApi: jest.Mocked<PrisonApi>

beforeEach(() => {
  userService = UserService.prototype as jest.Mocked<UserService>
  app = appWithAllRoutes({ services: { userService } })
  incidentReportingApi = IncidentReportingApi.prototype as jest.Mocked<IncidentReportingApi>
  prisonApi = PrisonApi.prototype as jest.Mocked<PrisonApi>
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET dashboard', () => {
  it('should render dashboard with button and table', () => {
    const now = new Date(2023, 11, 5, 12, 34, 56)
    const mockedReports = [
      convertBasicReportDates(mockReport({ reportReference: '6543', reportDateAndTime: now })),
      convertBasicReportDates(mockReport({ reportReference: '6544', reportDateAndTime: now })),
    ]
    const pageOfReports = unsortedPageOf(mockedReports)
    incidentReportingApi.getReports.mockResolvedValueOnce(pageOfReports)

    const users: Record<string, User> = { JOHN_SMITH: { username: 'JOHN_SMITH', name: 'John Smith' } }
    userService.getUsers.mockResolvedValueOnce(users)

    const prisons = {
      LEI: leeds,
      MDI: moorland,
    }
    prisonApi.getPrisons.mockResolvedValue(prisons)

    return request(app)
      .get('/reports')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Incident reports')
        expect(res.text).toContain('Report an incident')
        expect(res.text).toContain('6543')
        expect(res.text).toContain('6544')
        expect(res.text).toContain('5 December 2023, 11:34')
        expect(incidentReportingApi.getReports).toHaveBeenCalledTimes(1)
      })
  })
  it('should show actual name when username found, username if not', () => {
    const now = new Date(2023, 11, 5, 12, 34, 56)
    const mockedReports = [
      convertBasicReportDates(
        mockReport({ reportReference: '6543', reportDateAndTime: now, reportingUsername: 'JOHN_SMITH' }),
      ),
      convertBasicReportDates(
        mockReport({ reportReference: '6544', reportDateAndTime: now, reportingUsername: 'JOHN_WICK' }),
      ),
    ]
    const pageOfReports = unsortedPageOf(mockedReports)
    incidentReportingApi.getReports.mockResolvedValueOnce(pageOfReports)

    const users: Record<string, User> = { JOHN_SMITH: { username: 'JOHN_SMITH', name: 'John Smith' } }
    userService.getUsers.mockResolvedValueOnce(users)

    const prisons = {
      LEI: leeds,
      MDI: moorland,
    }
    prisonApi.getPrisons.mockResolvedValue(prisons)

    return request(app)
      .get('/reports')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('John Smith')
        expect(res.text).not.toContain('>JOHN_SMITH<')
        expect(res.text).toContain('JOHN_WICK')
      })
  })
})
