import request from 'supertest'
import type { Express } from 'express'
import { convertBasicReportDates, convertReportWithDetailsDates } from '../../data/incidentReportingApiUtils'
import { mockReport } from '../../data/testData/incidentReporting'
import { now } from '../../testutils/fakeClock'
import { IncidentReportingApi, ReportWithDetails } from '../../data/incidentReportingApi'
import UserService from '../../services/userService'
import { appWithAllRoutes } from '../testutils/appSetup'
import type { User } from '../../data/manageUsersApiClient'

jest.mock('../../data/incidentReportingApi')
jest.mock('../../services/userService')

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

describe('GET remove prisoner confirmation page', () => {
  let viewReportUrl: string

  it('should render title question and options to confirm or deny removal', () => {
    const mockedReport = convertReportWithDetailsDates(
      mockReport({ reportReference: '6543', reportDateAndTime: now, withDetails: true }),
    )
    incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(mockedReport)
    viewReportUrl = `/reports/${mockedReport.id}/remove-prisoner/0`
    return request(app)
      .get(viewReportUrl)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Are you sure you want to remove A1111AA: Andrew Arnold?')
        expect(res.text).toContain('Yes')
        expect(res.text).toContain('No')
        expect(res.text).toContain('Continue')
        expect(res.text).toContain('Save and exit')
        expect(incidentReportingApi.getReportWithDetailsById).toHaveBeenCalledTimes(1)
      })
  })
})
