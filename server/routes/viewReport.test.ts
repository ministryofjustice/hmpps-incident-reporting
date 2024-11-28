import type { Express } from 'express'
import request from 'supertest'

import { PrisonApi } from '../data/prisonApi'
import { appWithAllRoutes } from './testutils/appSetup'
import {
  CorrectionRequest,
  Event,
  HistoricReport,
  HistoricStatus,
  IncidentReportingApi,
  PrisonerInvolvement,
  Question,
  type ReportWithDetails,
  StaffInvolvement,
} from '../data/incidentReportingApi'
import { OffenderSearchApi, type OffenderSearchResult } from '../data/offenderSearchApi'
import { mockReport } from '../data/testData/incidentReporting'
import { convertReportWithDetailsDates } from '../data/incidentReportingApiUtils'
import UserService from '../services/userService'
import type { User } from '../data/manageUsersApiClient'
import { leeds, moorland } from '../data/testData/prisonApi'
import { andrew } from '../data/testData/offenderSearch'

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

  const users: Record<string, User> = { user1: { username: 'user1', name: 'John Smith' } }
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
    const now = new Date(2023, 11, 5, 12, 34, 56)
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
        expect(res.text).toContain('Active involvement - Investigation (local)')
        expect(res.text).toContain('A2222BB')
        expect(res.text).toContain('Suspected involved - No outcome')
      })
  })
  it('should render staff involved with roles', () => {
    return request(app)
      .get('/reports/6543')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('lev79n')
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
        expect(res.text).toContain('NOT_SPECIFIED')
        expect(res.text).toContain('Please amend question 2')
      })
  })
})

describe('GET view report page without details', () => {
  beforeEach(() => {
    const now = new Date(2023, 11, 5, 12, 34, 56)
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
        expect(res.text).toContain('Add responses')
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
