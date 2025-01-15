import type { Express } from 'express'
import request from 'supertest'

import { PrisonApi } from '../data/prisonApi'
import { appWithAllRoutes } from './testutils/appSetup'
import { now } from '../testutils/fakeClock'
import { IncidentReportingApi } from '../data/incidentReportingApi'
import { OffenderSearchApi, type OffenderSearchResult } from '../data/offenderSearchApi'
import { mockReport } from '../data/testData/incidentReporting'
import { convertReportWithDetailsDates } from '../data/incidentReportingApiUtils'
import UserService from '../services/userService'
import type { User } from '../data/manageUsersApiClient'
import { leeds, moorland } from '../data/testData/prisonApi'
import { andrew } from '../data/testData/offenderSearch'
import { reportingUser, approverUser, hqUser, unauthorisedUser } from '../data/testData/users'

jest.mock('../data/prisonApi')
jest.mock('../data/incidentReportingApi')
jest.mock('../services/userService')
jest.mock('../data/offenderSearchApi')

let app: Express
let incidentReportingApi: jest.Mocked<IncidentReportingApi>
let userService: jest.Mocked<UserService>
let prisonApi: jest.Mocked<PrisonApi>
let offenderSearchApi: jest.Mocked<OffenderSearchApi>

beforeEach(() => {
  userService = UserService.prototype as jest.Mocked<UserService>
  app = appWithAllRoutes({ services: { userService } })
  incidentReportingApi = IncidentReportingApi.prototype as jest.Mocked<IncidentReportingApi>
  prisonApi = PrisonApi.prototype as jest.Mocked<PrisonApi>
  offenderSearchApi = OffenderSearchApi.prototype as jest.Mocked<OffenderSearchApi>

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

  const prisons = {
    LEI: leeds,
    MDI: moorland,
  }
  prisonApi.getPrisons.mockResolvedValue(prisons)

  const prisoners: Record<string, OffenderSearchResult> = { A1111AA: andrew }
  offenderSearchApi.getPrisoners.mockResolvedValue(prisoners)
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET view report page with details', () => {
  beforeEach(() => {
    const mockedReport = convertReportWithDetailsDates(
      mockReport({ reportReference: '6543', reportDateAndTime: now, withDetails: true }),
    )
    incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(mockedReport)
  })

  it('should render report page with all sections', () => {
    return request(app)
      .get('/reports/6543')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Report 6543')
        expect(res.text).toContain('Incident reported in Moorland (HMP &amp; YOI) by John Smith')
        expect(res.text).toContain('Incident details')
        expect(res.text).toContain('Incident type')
        expect(res.text).toContain('Prisoners involved')
        expect(res.text).toContain('Staff involved')
        expect(res.text).toContain('Question responses')
        expect(res.text).toContain('Correction requests')
        expect(incidentReportingApi.getReportWithDetailsById).toHaveBeenCalledTimes(1)
      })
  })

  it('should render incident details', () => {
    return request(app)
      .get('/reports/6543')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Date and time of incident')
        expect(res.text).toContain('5 December 2023, 11:34')
        expect(res.text).toContain('Description')
        expect(res.text).toContain('A new incident created in the new service of type FINDS')
      })
  })

  it('should render incident type with correct formatting', () => {
    return request(app)
      .get('/reports/6543')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Incident type')
        expect(res.text).toContain('Finds')
      })
  })

  it('should render prisoners involved with roles and outcomes. Names correct if available', () => {
    return request(app)
      .get('/reports/6543')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Andrew Arnold')
        expect(res.text).toContain('Role: Active involvement')
        expect(res.text).toContain('Outcome: Investigation (local)')
        expect(res.text).toContain('Comment: Comment about A1111AA')
        expect(res.text).toContain('A2222BB')
        expect(res.text).toContain('Role: Suspected involved')
        expect(res.text).toContain('Outcome: No outcome')
        expect(res.text).toContain('Comment: No comment')
      })
  })

  it('should render staff involved with roles', () => {
    return request(app)
      .get('/reports/6543')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Barry Harrison')
        expect(res.text).toContain('Present at scene')
        expect(res.text).toContain('abc12a')
        expect(res.text).toContain('Actively involved')
      })
  })

  it('should render question responses', () => {
    return request(app)
      .get('/reports/6543')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Question #1')
        expect(res.text).toContain('Response #1')
        expect(res.text).toContain('Question #2')
      })
  })

  it('should render correction requests', () => {
    return request(app)
      .get('/reports/6543')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('USER2')
        expect(res.text).toContain('Description: Please amend question 2')
        expect(res.text).toContain('Submitted at: 5 December 2023, 12:34')
      })
  })
})

describe('GET view report page without details', () => {
  beforeEach(() => {
    const mockedReport = convertReportWithDetailsDates(
      mockReport({ reportReference: '6543', reportDateAndTime: now, withDetails: true }),
    )
    mockedReport.questions = []
    mockedReport.staffInvolved = []
    mockedReport.prisonersInvolved = []
    mockedReport.correctionRequests = []

    incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(mockedReport)
  })

  it('should render report page with all sections', () => {
    return request(app)
      .get('/reports/6543')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Report 6543')
        expect(res.text).toContain('Incident reported in Moorland (HMP &amp; YOI) by John Smith')
        expect(res.text).toContain('Incident details')
        expect(res.text).toContain('Incident type')
        expect(res.text).toContain('Prisoners involved')
        expect(res.text).toContain('Staff involved')
        expect(res.text).toContain('Question responses')
        expect(res.text).toContain('Correction requests')
        expect(incidentReportingApi.getReportWithDetailsById).toHaveBeenCalledTimes(1)
      })
  })

  it('should render incident details', () => {
    return request(app)
      .get('/reports/6543')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Date and time of incident')
        expect(res.text).toContain('5 December 2023, 11:34')
        expect(res.text).toContain('Description')
        expect(res.text).toContain('A new incident created in the new service of type FINDS')
      })
  })

  it('should render incident type with correct formatting', () => {
    return request(app)
      .get('/reports/6543')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Incident type')
        expect(res.text).toContain('Finds')
      })
  })

  it('should render no prisoners found', () => {
    return request(app)
      .get('/reports/6543')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Prisoners involved')
        expect(res.text).toContain('No prisoners found')
        expect(res.text).toContain('Add a prisoner')
      })
  })

  it('should render no staff found', () => {
    return request(app)
      .get('/reports/6543')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Staff involved')
        expect(res.text).toContain('No staff found')
        expect(res.text).toContain('Add a staff member')
      })
  })

  it('should render no question responses found', () => {
    return request(app)
      .get('/reports/6543')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Question responses')
        expect(res.text).toContain('No responses found')
      })
  })

  it('should render correction requests', () => {
    return request(app)
      .get('/reports/6543')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Correction requests')
        expect(res.text).toContain('No corrections found')
        expect(res.text).toContain('Add a correction')
      })
  })
})

describe('Report viewing permissions', () => {
  // NB: these test cases are simplified because the permissions class methods are thoroughly tested elsewhere

  let reportId: string

  beforeEach(() => {
    const report = convertReportWithDetailsDates(
      mockReport({ reportReference: '6543', reportDateAndTime: now, withDetails: true }),
    )
    reportId = report.id
    incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(report)
  })

  const granted = 'granted' as const
  const denied = 'denied' as const
  it.each([
    { userType: 'reporting officer', user: reportingUser, action: granted },
    { userType: 'data warden', user: approverUser, action: granted },
    { userType: 'HQ view-only user', user: hqUser, action: granted },
    { userType: 'unauthorised user', user: unauthorisedUser, action: denied },
  ])('should be $action to $userType', ({ user, action }) => {
    const testRequest = request(appWithAllRoutes({ services: { userService }, userSupplier: () => user }))
      .get(`/reports/${reportId}`)
      .redirects(1)
    if (action === 'granted') {
      return testRequest.expect(200)
    }
    return testRequest.expect(res => {
      expect(res.redirects[0]).toContain('/sign-out')
    })
  })
})
