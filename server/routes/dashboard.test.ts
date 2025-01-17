import type { Express } from 'express'
import request from 'supertest'

import { appWithAllRoutes } from './testutils/appSetup'
import { now } from '../testutils/fakeClock'
import { type GetReportsParams, IncidentReportingApi } from '../data/incidentReportingApi'
import { mockReport } from '../data/testData/incidentReporting'
import { unsortedPageOf } from '../data/testData/paginatedResponses'
import { mockSharedUser } from '../data/testData/manageUsers'
import { approverUser, hqUser, reportingUser, unauthorisedUser } from '../data/testData/users'
import { convertBasicReportDates } from '../data/incidentReportingApiUtils'
import UserService from '../services/userService'
import type { User } from '../data/manageUsersApiClient'
import config from '../config'

jest.mock('../data/incidentReportingApi')
jest.mock('../services/userService')

let previousActivePrisons: string[]

beforeAll(() => {
  previousActivePrisons = config.activePrisons
})

let app: Express
let incidentReportingApi: jest.Mocked<IncidentReportingApi>
let userService: jest.Mocked<UserService>

beforeEach(() => {
  userService = UserService.prototype as jest.Mocked<UserService>
  app = appWithAllRoutes({ services: { userService } })
  incidentReportingApi = IncidentReportingApi.prototype as jest.Mocked<IncidentReportingApi>
})

afterEach(() => {
  config.activePrisons = previousActivePrisons
  jest.resetAllMocks()
})

describe('Dashboard permissions', () => {
  // NB: these test cases are simplified because the permissions class methods are thoroughly tested elsewhere

  const pageOfReports = unsortedPageOf(
    [
      mockReport({ reportReference: '6543', reportDateAndTime: now }),
      mockReport({ reportReference: '6544', reportDateAndTime: now }),
    ].map(convertBasicReportDates),
  )

  beforeEach(() => {
    incidentReportingApi.getReports.mockResolvedValueOnce(pageOfReports)
    userService.getUsers.mockResolvedValueOnce({ [mockSharedUser.username]: mockSharedUser })
  })

  const show = 'show' as const
  const hide = 'hide' as const

  it.each([
    { userType: 'reporting officer', user: reportingUser, action: show },
    { userType: 'data warden', user: approverUser, action: show },
    { userType: 'HQ view-only user', user: hqUser, action: hide },
    { userType: 'unauthorised user', user: unauthorisedUser, action: hide },
  ])('should $action report button for $userType', ({ user, action }) => {
    return request(appWithAllRoutes({ services: { userService }, userSupplier: () => user }))
      .get('/reports')
      .expect(res => {
        if (action === show) {
          expect(res.text).toContain('Report an incident')
        } else {
          expect(res.text).not.toContain('Report an incident')
        }
      })
  })

  it('should hide report button for reporting officer when their active caseload in not active in the service', () => {
    config.activePrisons = ['LEI']

    return request(appWithAllRoutes({ services: { userService }, userSupplier: () => reportingUser }))
      .get('/reports')
      .expect(res => {
        expect(res.text).not.toContain('Report an incident')
        expect(res.text).toContain('You must use NOMIS to create reports in this establishment')
      })
  })
})

describe('GET dashboard', () => {
  it('should render dashboard with button and table, results filtered on caseload', () => {
    const mockedReports = [
      convertBasicReportDates(mockReport({ reportReference: '6543', reportDateAndTime: now })),
      convertBasicReportDates(mockReport({ reportReference: '6544', reportDateAndTime: now })),
    ]
    const pageOfReports = unsortedPageOf(mockedReports)
    incidentReportingApi.getReports.mockResolvedValueOnce(pageOfReports)

    const users: Record<string, User> = { JOHN_SMITH: { username: 'JOHN_SMITH', name: 'John Smith' } }
    userService.getUsers.mockResolvedValueOnce(users)

    const expectedParams: Partial<GetReportsParams> = {
      location: ['MDI'],
      incidentDateFrom: undefined,
      incidentDateUntil: undefined,
      involvingPrisonerNumber: undefined,
      page: 0,
      reference: undefined,
      sort: ['incidentDateAndTime,DESC'],
      status: undefined,
      type: undefined,
    }
    return request(app)
      .get('/reports')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Incident reports')
        expect(res.text).toContain('Report an incident')
        expect(res.text).toContain('6543')
        expect(res.text).toContain('6544')
        expect(res.text).toContain('5 December 2023, 11:34')
        expect(incidentReportingApi.getReports).toHaveBeenCalledWith(expectedParams)
      })
  })

  it('should submit query values correctly into the api call', () => {
    const mockedReports = [
      convertBasicReportDates(mockReport({ reportReference: '6543', reportDateAndTime: now })),
      convertBasicReportDates(mockReport({ reportReference: '6544', reportDateAndTime: now })),
    ]
    const pageOfReports = unsortedPageOf(mockedReports)
    incidentReportingApi.getReports.mockResolvedValueOnce(pageOfReports)

    const users: Record<string, User> = { JOHN_SMITH: { username: 'JOHN_SMITH', name: 'John Smith' } }
    userService.getUsers.mockResolvedValueOnce(users)

    const expectedParams: Partial<GetReportsParams> = {
      location: 'MDI',
      incidentDateFrom: new Date(2025, 0, 1, 12, 0, 0),
      incidentDateUntil: new Date(2025, 0, 14, 12, 0, 0),
      involvingPrisonerNumber: 'A0011BC',
      page: 0,
      reference: undefined,
      sort: ['incidentDateAndTime,DESC'],
      status: 'DRAFT',
      type: 'ATTEMPTED_ESCAPE_FROM_CUSTODY',
    }

    const queryParams = {
      searchID: 'A0011BC',
      fromDate: '01/01/2025',
      toDate: '14/01/2025',
      location: 'MDI',
      incidentType: 'ATTEMPTED_ESCAPE_FROM_CUSTODY',
      incidentStatuses: 'DRAFT',
    }

    return request(app)
      .get(`/reports`)
      .query(queryParams)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).not.toContain(
          'Enter a valid incident reference number or offender ID. For example, 12345678 or A0011BB',
        )
        expect(res.text).toContain('Clear')
        expect(incidentReportingApi.getReports).toHaveBeenCalledWith(expectedParams)
      })
  })

  it('should show actual name when username found, username if not', () => {
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

    return request(app)
      .get('/reports')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('John Smith')
        expect(res.text).not.toContain('>JOHN_SMITH<')
        expect(res.text).toContain('JOHN_WICK')
      })
  })

  it('should render all filters except establishment if user caseload is only 1 establishment', () => {
    const mockedReports = [
      convertBasicReportDates(mockReport({ reportReference: '6543', reportDateAndTime: now })),
      convertBasicReportDates(mockReport({ reportReference: '6544', reportDateAndTime: now })),
    ]
    const pageOfReports = unsortedPageOf(mockedReports)
    incidentReportingApi.getReports.mockResolvedValueOnce(pageOfReports)

    const users: Record<string, User> = { JOHN_SMITH: { username: 'JOHN_SMITH', name: 'John Smith' } }
    userService.getUsers.mockResolvedValueOnce(users)

    const expectedParams: Partial<GetReportsParams> = {
      location: ['MDI'],
      incidentDateFrom: undefined,
      incidentDateUntil: undefined,
      involvingPrisonerNumber: undefined,
      page: 0,
      reference: undefined,
      sort: ['incidentDateAndTime,DESC'],
      status: undefined,
      type: undefined,
    }
    return request(app)
      .get('/reports')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('searchID')
        expect(res.text).toContain('Search an incident number or offender ID')
        expect(res.text).toContain('fromDate')
        expect(res.text).toContain('Incident date from')
        expect(res.text).toContain('toDate')
        expect(res.text).toContain('Incident date to')
        expect(res.text).not.toContain('Establishment')
        expect(res.text).not.toContain('location')
        expect(res.text).toContain('incidentType')
        expect(res.text).toContain('Incident type')
        expect(res.text).toContain('Filter')
        expect(res.text).not.toContain('Clear')
        expect(res.text).toContain('incidentStatuses')
        expect(incidentReportingApi.getReports).toHaveBeenCalledWith(expectedParams)
      })
  })
})

describe('search validations', () => {
  it.each([
    { scenario: 'search contains only letters', searchValue: 'abcd' },
    { scenario: 'search contains wrong pattern', searchValue: 'AB11ABC' },
    { scenario: 'search contains multiple values', searchValue: '12345678 A0011BC' },
  ])('should present errors when $scenario', ({ searchValue }) => {
    const mockedReports = [
      convertBasicReportDates(mockReport({ reportReference: '6543', reportDateAndTime: now })),
      convertBasicReportDates(mockReport({ reportReference: '6544', reportDateAndTime: now })),
    ]
    const pageOfReports = unsortedPageOf(mockedReports)
    incidentReportingApi.getReports.mockResolvedValueOnce(pageOfReports)

    const users: Record<string, User> = { JOHN_SMITH: { username: 'JOHN_SMITH', name: 'John Smith' } }
    userService.getUsers.mockResolvedValueOnce(users)

    const expectedParams: Partial<GetReportsParams> = {
      location: ['MDI'],
      incidentDateFrom: undefined,
      incidentDateUntil: undefined,
      involvingPrisonerNumber: undefined,
      page: 0,
      reference: undefined,
      sort: ['incidentDateAndTime,DESC'],
      status: undefined,
      type: undefined,
    }

    return request(app)
      .get(`/reports`)
      .query({ searchID: searchValue })
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain(
          'Enter a valid incident reference number or offender ID. For example, 12345678 or A0011BB',
        )
        expect(res.text).toContain('Clear')
        expect(incidentReportingApi.getReports).toHaveBeenCalledWith(expectedParams)
      })
  })

  it('should not present errors and search for reference number when only digits', () => {
    const mockedReports = [
      convertBasicReportDates(mockReport({ reportReference: '6543', reportDateAndTime: now })),
      convertBasicReportDates(mockReport({ reportReference: '6544', reportDateAndTime: now })),
    ]
    const pageOfReports = unsortedPageOf(mockedReports)
    incidentReportingApi.getReports.mockResolvedValueOnce(pageOfReports)

    const users: Record<string, User> = { JOHN_SMITH: { username: 'JOHN_SMITH', name: 'John Smith' } }
    userService.getUsers.mockResolvedValueOnce(users)

    const expectedParams: Partial<GetReportsParams> = {
      location: ['MDI'],
      incidentDateFrom: undefined,
      incidentDateUntil: undefined,
      involvingPrisonerNumber: undefined,
      page: 0,
      reference: '12345678',
      sort: ['incidentDateAndTime,DESC'],
      status: undefined,
      type: undefined,
    }

    return request(app)
      .get(`/reports`)
      .query({ searchID: '12345678' })
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).not.toContain(
          'Enter a valid incident reference number or offender ID. For example, 12345678 or A0011BB',
        )
        expect(res.text).toContain('Clear')
        expect(incidentReportingApi.getReports).toHaveBeenCalledWith(expectedParams)
      })
  })

  it('should not present errors and search, removing whitespaces around digits', () => {
    const mockedReports = [
      convertBasicReportDates(mockReport({ reportReference: '6543', reportDateAndTime: now })),
      convertBasicReportDates(mockReport({ reportReference: '6544', reportDateAndTime: now })),
    ]
    const pageOfReports = unsortedPageOf(mockedReports)
    incidentReportingApi.getReports.mockResolvedValueOnce(pageOfReports)

    const users: Record<string, User> = { JOHN_SMITH: { username: 'JOHN_SMITH', name: 'John Smith' } }
    userService.getUsers.mockResolvedValueOnce(users)

    const expectedParams: Partial<GetReportsParams> = {
      location: ['MDI'],
      incidentDateFrom: undefined,
      incidentDateUntil: undefined,
      involvingPrisonerNumber: undefined,
      page: 0,
      reference: '12345678',
      sort: ['incidentDateAndTime,DESC'],
      status: undefined,
      type: undefined,
    }

    return request(app)
      .get(`/reports`)
      .query({ searchID: ' 12345678 ' })
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).not.toContain(
          'Enter a valid incident reference number or offender ID. For example, 12345678 or A0011BB',
        )
        expect(res.text).toContain('Clear')
        expect(incidentReportingApi.getReports).toHaveBeenCalledWith(expectedParams)
      })
  })

  it('should not present errors and search for prisoner ID when matching pattern', () => {
    const mockedReports = [
      convertBasicReportDates(mockReport({ reportReference: '6543', reportDateAndTime: now })),
      convertBasicReportDates(mockReport({ reportReference: '6544', reportDateAndTime: now })),
    ]
    const pageOfReports = unsortedPageOf(mockedReports)
    incidentReportingApi.getReports.mockResolvedValueOnce(pageOfReports)

    const users: Record<string, User> = { JOHN_SMITH: { username: 'JOHN_SMITH', name: 'John Smith' } }
    userService.getUsers.mockResolvedValueOnce(users)

    const expectedParams: Partial<GetReportsParams> = {
      location: ['MDI'],
      incidentDateFrom: undefined,
      incidentDateUntil: undefined,
      involvingPrisonerNumber: 'A0011BC',
      page: 0,
      reference: undefined,
      sort: ['incidentDateAndTime,DESC'],
      status: undefined,
      type: undefined,
    }

    return request(app)
      .get(`/reports`)
      .query({ searchID: 'A0011BC' })
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).not.toContain(
          'Enter a valid incident reference number or offender ID. For example, 12345678 or A0011BB',
        )
        expect(res.text).toContain('Clear')
        expect(incidentReportingApi.getReports).toHaveBeenCalledWith(expectedParams)
      })
  })

  it('should not present errors and search, removing whitespaces around pattern', () => {
    const mockedReports = [
      convertBasicReportDates(mockReport({ reportReference: '6543', reportDateAndTime: now })),
      convertBasicReportDates(mockReport({ reportReference: '6544', reportDateAndTime: now })),
    ]
    const pageOfReports = unsortedPageOf(mockedReports)
    incidentReportingApi.getReports.mockResolvedValueOnce(pageOfReports)

    const users: Record<string, User> = { JOHN_SMITH: { username: 'JOHN_SMITH', name: 'John Smith' } }
    userService.getUsers.mockResolvedValueOnce(users)

    const expectedParams: Partial<GetReportsParams> = {
      location: ['MDI'],
      incidentDateFrom: undefined,
      incidentDateUntil: undefined,
      involvingPrisonerNumber: 'A0011BC',
      page: 0,
      reference: undefined,
      sort: ['incidentDateAndTime,DESC'],
      status: undefined,
      type: undefined,
    }

    return request(app)
      .get(`/reports`)
      .query({ searchID: ' A0011BC ' })
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).not.toContain(
          'Enter a valid incident reference number or offender ID. For example, 12345678 or A0011BB',
        )
        expect(res.text).toContain('Clear')
        expect(incidentReportingApi.getReports).toHaveBeenCalledWith(expectedParams)
      })
  })
})
