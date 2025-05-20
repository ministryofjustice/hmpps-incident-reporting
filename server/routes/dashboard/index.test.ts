import type { Express } from 'express'
import request from 'supertest'

import config from '../../config'
import { appWithAllRoutes } from '../testutils/appSetup'
import { now } from '../../testutils/fakeClock'
import { type GetReportsParams, IncidentReportingApi } from '../../data/incidentReportingApi'
import { convertBasicReportDates } from '../../data/incidentReportingApiUtils'
import { mockErrorResponse, mockReport } from '../../data/testData/incidentReporting'
import { unsortedPageOf } from '../../data/testData/paginatedResponses'
import { mockSharedUser } from '../../data/testData/manageUsers'
import { approverUser, hqUser, reportingUser, unauthorisedUser } from '../../data/testData/users'
import { mockThrownError } from '../../data/testData/thrownErrors'
import UserService from '../../services/userService'
import { Status } from '../../reportConfiguration/constants'

jest.mock('../../data/incidentReportingApi')
jest.mock('../../services/userService')

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

  beforeEach(() => {
    // actual table doesn't matter for these tests
    incidentReportingApi.getReports.mockResolvedValueOnce(unsortedPageOf([]))
  })

  const show = 'show' as const
  const hide = 'hide' as const

  it.each([
    { userType: 'reporting officer', user: reportingUser, action: show },
    { userType: 'data warden', user: approverUser, action: hide },
    { userType: 'HQ view-only user', user: hqUser, action: hide },
    { userType: 'unauthorised user', user: unauthorisedUser, action: hide },
  ])('should $action report button for $userType', ({ user, action }) => {
    return request(appWithAllRoutes({ services: { userService }, userSupplier: () => user }))
      .get('/reports')
      .expect(res => {
        if (action === show) {
          expect(res.text).toContain('Create a report for Moorland')
        } else {
          expect(res.text).not.toContain('Create a report')
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
  beforeEach(() => {
    const mockedReports = [
      convertBasicReportDates(mockReport({ reportReference: '6543', reportDateAndTime: now })),
      convertBasicReportDates(mockReport({ reportReference: '6544', reportDateAndTime: now })),
    ]
    const pageOfReports = unsortedPageOf(mockedReports)
    incidentReportingApi.getReports.mockResolvedValueOnce(pageOfReports)

    userService.getUsers.mockResolvedValueOnce({ [mockSharedUser.username]: mockSharedUser })
  })

  it('should render dashboard with button and table, results filtered on caseload and "to do" status for RO', () => {
    const expectedParams: Partial<GetReportsParams> = {
      location: ['MDI'],
      incidentDateFrom: undefined,
      incidentDateUntil: undefined,
      involvingPrisonerNumber: undefined,
      page: 0,
      reference: undefined,
      sort: ['incidentDateAndTime,DESC'],
      status: ['DRAFT', 'INFORMATION_REQUIRED'],
      type: undefined,
    }
    return request(app)
      .get('/reports')
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('Incident reports')
        expect(res.text).toContain('Create a report for Moorland')
        expect(res.text).toContain('6543')
        expect(res.text).toContain('6544')
        expect(res.text).toContain('5 December 2023 at 11:34')
        expect(res.text).not.toContain('There is a problem')
        expect(incidentReportingApi.getReports).toHaveBeenCalledWith(expectedParams)
      })
  })

  it('should correctly clear all filters and default statuses when "Clear filters" clicked by RO', () => {
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
      .query({ incidentStatuses: '' })
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('Incident reports')
        expect(res.text).toContain('Create a report for Moorland')
        expect(res.text).toContain('6543')
        expect(res.text).toContain('6544')
        expect(res.text).toContain('5 December 2023 at 11:34')
        expect(res.text).not.toContain('There is a problem')
        expect(incidentReportingApi.getReports).toHaveBeenCalledWith(expectedParams)
      })
  })

  it('should submit query values correctly into the api call for RO', () => {
    const expectedParams: Partial<GetReportsParams> = {
      location: 'MDI',
      incidentDateFrom: new Date(2025, 0, 1, 12, 0, 0),
      incidentDateUntil: new Date(2025, 0, 14, 12, 0, 0),
      involvingPrisonerNumber: 'A0011BC',
      page: 0,
      reference: undefined,
      sort: ['incidentDateAndTime,DESC'],
      status: ['DRAFT', 'INFORMATION_REQUIRED'],
      type: ['ATTEMPTED_ESCAPE_FROM_PRISON_1'],
    }

    const queryParams = {
      searchID: 'A0011BC',
      fromDate: '1/1/2025',
      toDate: '14/1/2025',
      location: 'MDI',
      typeFamily: 'ATTEMPTED_ESCAPE_FROM_PRISON',
      incidentStatuses: 'toDo',
    }

    return request(appWithAllRoutes({ services: { userService }, userSupplier: () => reportingUser }))
      .get('/reports')
      .query(queryParams)
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(res => {
        expect(res.text).not.toContain('Enter a valid incident number or offender ID. For example, 12345678 or A0011BB')
        expect(res.text).not.toContain('There is a problem')
        expect(res.text).toContain('Clear filters')
        expect(incidentReportingApi.getReports).toHaveBeenCalledWith(expectedParams)
      })
  })

  it('should submit query values correctly into the api call for DW', () => {
    const expectedParams: Partial<GetReportsParams> = {
      location: 'LEI',
      incidentDateFrom: new Date(2025, 0, 1, 12, 0, 0),
      incidentDateUntil: new Date(2025, 0, 4, 12, 0, 0),
      involvingPrisonerNumber: 'A0011BC',
      page: 0,
      reference: undefined,
      sort: ['incidentDateAndTime,DESC'],
      status: 'DRAFT',
      type: ['ATTEMPTED_ESCAPE_FROM_PRISON_1'],
    }

    const queryParams = {
      searchID: 'A0011BC',
      fromDate: '01/01/2025', // leading zeros
      toDate: '4/1/2025', // no leading zeros
      location: 'LEI',
      typeFamily: 'ATTEMPTED_ESCAPE_FROM_PRISON',
      incidentStatuses: 'DRAFT',
    }

    return request(appWithAllRoutes({ services: { userService }, userSupplier: () => approverUser }))
      .get('/reports')
      .query(queryParams)
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(res => {
        expect(res.text).not.toContain('Enter a valid incident number or offender ID. For example, 12345678 or A0011BB')
        expect(res.text).not.toContain('There is a problem')
        expect(res.text).toContain('Clear filters')
        expect(incidentReportingApi.getReports).toHaveBeenCalledWith(expectedParams)
      })
  })

  it('should submit query values correctly when selected type family has several types in it', () => {
    const queryParams = {
      typeFamily: 'FIND',
    }

    return request(appWithAllRoutes({ services: { userService }, userSupplier: () => approverUser }))
      .get('/reports')
      .query(queryParams)
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(res => {
        expect(res.text).not.toContain('There is a problem')
        expect(res.text).toContain('Clear filters')
        expect(incidentReportingApi.getReports).toHaveBeenCalledWith(
          expect.objectContaining({
            type: ['FIND_1', 'FIND_2', 'FIND_3', 'FIND_4', 'FIND_5', 'FIND_6'],
          }),
        )
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
    incidentReportingApi.getReports.mockReset()
    incidentReportingApi.getReports.mockResolvedValueOnce(pageOfReports)
    userService.getUsers.mockReset()
    userService.getUsers.mockResolvedValueOnce({
      [mockSharedUser.username]: mockSharedUser,
      JOHN_SMITH: { username: 'JOHN_SMITH', name: 'John Smith' },
    })

    return request(app)
      .get('/reports')
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('John Smith')
        expect(res.text).not.toContain('>JOHN_SMITH<')
        expect(res.text).toContain('JOHN_WICK')
      })
  })

  it('should render expected filters for a RO user where caseload is only 1 establishment', () => {
    const expectedParams: Partial<GetReportsParams> = {
      location: ['MDI'],
      incidentDateFrom: undefined,
      incidentDateUntil: undefined,
      involvingPrisonerNumber: undefined,
      page: 0,
      reference: undefined,
      sort: ['incidentDateAndTime,DESC'],
      status: ['DRAFT', 'INFORMATION_REQUIRED'],
      type: undefined,
    }
    return request(appWithAllRoutes({ services: { userService }, userSupplier: () => reportingUser }))
      .get('/reports')
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('searchID')
        expect(res.text).toContain('Search an incident number or offender ID')
        expect(res.text).toContain('fromDate')
        expect(res.text).toContain('Incident date from')
        expect(res.text).toContain('toDate')
        expect(res.text).toContain('Incident date to')
        expect(res.text).not.toContain('Establishment')
        expect(res.text).not.toContain('location')
        expect(res.text).toContain('typeFamily')
        expect(res.text).toContain('Incident type')
        expect(res.text).toContain('Work list')
        expect(res.text).toContain('To do')
        expect(res.text).toContain('toDo')
        expect(res.text).not.toContain('DRAFT')
        expect(res.text).toContain('Apply filters')
        expect(res.text).toContain('Clear filters')
        expect(incidentReportingApi.getReports).toHaveBeenCalledWith(expectedParams)
      })
  })

  it('should not see clear filters button and render expected filters when cleared for a RO user where caseload is only 1 establishment', () => {
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
    return request(appWithAllRoutes({ services: { userService }, userSupplier: () => reportingUser }))
      .get('/reports')
      .query({ incidentStatuses: '' })
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('searchID')
        expect(res.text).toContain('Search an incident number or offender ID')
        expect(res.text).toContain('fromDate')
        expect(res.text).toContain('Incident date from')
        expect(res.text).toContain('toDate')
        expect(res.text).toContain('Incident date to')
        expect(res.text).not.toContain('Establishment')
        expect(res.text).not.toContain('location')
        expect(res.text).toContain('typeFamily')
        expect(res.text).toContain('Incident type')
        expect(res.text).toContain('Work list')
        expect(res.text).toContain('To do')
        expect(res.text).toContain('toDo')
        expect(res.text).not.toContain('DRAFT')
        expect(res.text).toContain('Apply filters')
        expect(res.text).not.toContain('Clear filters')
        expect(incidentReportingApi.getReports).toHaveBeenCalledWith(expectedParams)
      })
  })

  it('should render expected columns for a user with a single establishment caseload', () => {
    const expectedParams: Partial<GetReportsParams> = {
      location: ['MDI'],
      incidentDateFrom: undefined,
      incidentDateUntil: undefined,
      involvingPrisonerNumber: undefined,
      page: 0,
      reference: undefined,
      sort: ['incidentDateAndTime,DESC'],
      status: ['DRAFT', 'INFORMATION_REQUIRED'],
      type: undefined,
    }
    return request(appWithAllRoutes({ services: { userService }, userSupplier: () => reportingUser }))
      .get('/reports')
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('6543')
        expect(res.text).toContain('Find of illicit items')
        expect(res.text).toContain('5 December 2023 at 11:34')
        expect(res.text).toContain('A new incident created in the new service of type FIND_6')
        expect(res.text).toContain('John Smith')
        expect(res.text).not.toContain('Establishment') // cannot check for Moorland because it appears in create button
        expect(res.text).toContain('Draft')
        expect(incidentReportingApi.getReports).toHaveBeenCalledWith(expectedParams)
      })
  })

  it('should render expected columns for a user with a multiple establishment caseload', () => {
    const expectedParams: Partial<GetReportsParams> = {
      location: ['MDI', 'LEI'],
      incidentDateFrom: undefined,
      incidentDateUntil: undefined,
      involvingPrisonerNumber: undefined,
      page: 0,
      reference: undefined,
      sort: ['incidentDateAndTime,DESC'],
      status: undefined,
      type: undefined,
    }
    return request(appWithAllRoutes({ services: { userService }, userSupplier: () => approverUser }))
      .get('/reports')
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('6543')
        expect(res.text).toContain('Find of illicit items')
        expect(res.text).toContain('5 December 2023 at 11:34')
        expect(res.text).toContain('A new incident created in the new service of type FIND_6')
        expect(res.text).not.toContain('John Smith')
        expect(res.text).toContain('Establishment') // cannot check for Moorland because it appears in create button
        expect(res.text).toContain('Draft')
        expect(incidentReportingApi.getReports).toHaveBeenCalledWith(expectedParams)
      })
  })

  it('should render expected filters for a DW user where caseload is multiple establishments', () => {
    const expectedParams: Partial<GetReportsParams> = {
      location: ['MDI', 'LEI'],
      incidentDateFrom: undefined,
      incidentDateUntil: undefined,
      involvingPrisonerNumber: undefined,
      page: 0,
      reference: undefined,
      sort: ['incidentDateAndTime,DESC'],
      status: undefined,
      type: undefined,
    }
    return request(appWithAllRoutes({ services: { userService }, userSupplier: () => approverUser }))
      .get('/reports')
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('searchID')
        expect(res.text).toContain('Search an incident number or offender ID')
        expect(res.text).toContain('fromDate')
        expect(res.text).toContain('Incident date from')
        expect(res.text).toContain('toDate')
        expect(res.text).toContain('Incident date to')
        expect(res.text).toContain('Establishment')
        expect(res.text).toContain('location')
        expect(res.text).toContain('typeFamily')
        expect(res.text).toContain('Incident type')
        expect(res.text).not.toContain('Work list')
        expect(res.text).not.toContain('To do')
        expect(res.text).not.toContain('toDo')
        expect(res.text).toContain('Draft')
        expect(res.text).toContain('DRAFT')
        expect(res.text).toContain('Apply filters')
        expect(res.text).not.toContain('Clear filters')
        expect(incidentReportingApi.getReports).toHaveBeenCalledWith(expectedParams)
      })
  })
})

describe('search validations', () => {
  beforeEach(() => {
    // actual table doesn't matter for these tests
    incidentReportingApi.getReports.mockResolvedValueOnce(unsortedPageOf([]))
  })

  it.each([
    { scenario: 'search contains only letters', searchValue: 'abcd' },
    { scenario: 'search contains wrong pattern', searchValue: 'AB11ABC' },
    { scenario: 'search contains multiple values', searchValue: '12345678 A0011BC' },
  ])('should present errors when $scenario', ({ searchValue }) => {
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

    return request(appWithAllRoutes({ services: { userService }, userSupplier: () => reportingUser }))
      .get('/reports')
      .query({ searchID: searchValue })
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('Enter a valid incident number or offender ID. For example, 12345678 or A0011BB')
        expect(res.text).toContain('There is a problem')
        expect(res.text).toContain('Clear filters')
        expect(incidentReportingApi.getReports).toHaveBeenCalledWith(expectedParams)
      })
  })

  it('should show an error if API rejects request', () => {
    incidentReportingApi.getReports.mockReset()
    const error = mockThrownError(mockErrorResponse({ message: 'Missing comment' }))
    incidentReportingApi.getReports.mockRejectedValue(error)

    return request
      .agent(app)
      .get('/reports')
      .query({ searchID: 'A0011BC' })
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('There is a problem')
        expect(res.text).toContain('Sorry, there was a problem with your request')
        expect(res.text).not.toContain('Bad Request')
        expect(res.text).not.toContain('Missing comment')
      })
  })

  it('should not present errors and search for reference number when only digits', () => {
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
      .get('/reports')
      .query({ searchID: '12345678' })
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(res => {
        expect(res.text).not.toContain('Enter a valid incident number or offender ID. For example, 12345678 or A0011BB')
        expect(res.text).not.toContain('There is a problem')
        expect(res.text).toContain('Clear filters')
        expect(incidentReportingApi.getReports).toHaveBeenCalledWith(expectedParams)
      })
  })

  it('should not present errors and search, removing whitespaces around digits', () => {
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
      .get('/reports')
      .query({ searchID: ' 12345678 ' })
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(res => {
        expect(res.text).not.toContain('Enter a valid incident number or offender ID. For example, 12345678 or A0011BB')
        expect(res.text).not.toContain('There is a problem')
        expect(res.text).toContain('Clear filters')
        expect(incidentReportingApi.getReports).toHaveBeenCalledWith(expectedParams)
      })
  })

  it('should not present errors and search for prisoner ID when matching pattern', () => {
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
      .get('/reports')
      .query({ searchID: 'A0011BC' })
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(res => {
        expect(res.text).not.toContain('Enter a valid incident number or offender ID. For example, 12345678 or A0011BB')
        expect(res.text).not.toContain('There is a problem')
        expect(res.text).toContain('Clear filters')
        expect(incidentReportingApi.getReports).toHaveBeenCalledWith(expectedParams)
      })
  })

  it('should not present errors and search, removing whitespaces around pattern', () => {
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
      .get('/reports')
      .query({ searchID: ' A0011BC ' })
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(res => {
        expect(res.text).not.toContain('Enter a valid incident number or offender ID. For example, 12345678 or A0011BB')
        expect(res.text).not.toContain('There is a problem')
        expect(res.text).toContain('Clear filters')
        expect(incidentReportingApi.getReports).toHaveBeenCalledWith(expectedParams)
      })
  })
})

describe('date validation', () => {
  beforeEach(() => {
    // actual table doesn't matter for these tests
    incidentReportingApi.getReports.mockResolvedValueOnce(unsortedPageOf([]))
  })

  it.each([
    { field: 'fromDate', name: 'from date' },
    { field: 'toDate', name: 'to date' },
  ])('should present an error on invalid $name', ({ field, name }) => {
    return request(app)
      .get('/reports')
      .query({ [field]: 'today' })
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('There is a problem')
        expect(res.text).toContain(`Enter a valid ${name}`)
        expect(res.text).toContain('Clear filters')
        const [args] = incidentReportingApi.getReports.mock.lastCall
        expect(args.incidentDateFrom ?? null).toBeNull()
        expect(args.incidentDateUntil ?? null).toBeNull()
      })
  })

  it('should present an error if date range is invalid', () => {
    return request(app)
      .get('/reports')
      .query({ fromDate: '2/1/2025', toDate: '1/1/2025' })
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('There is a problem')
        expect(res.text).toContain('Enter a date after from date')
        expect(res.text).toContain('Clear filters')
        const [args] = incidentReportingApi.getReports.mock.lastCall
        expect(args.incidentDateFrom).toBeNull()
        expect(args.incidentDateUntil).toBeNull()
      })
  })
})

describe('work list filter validations in RO view', () => {
  beforeEach(() => {
    // actual table doesn't matter for these tests
    incidentReportingApi.getReports.mockResolvedValueOnce(unsortedPageOf([]))
  })

  it.each([
    { scenario: 'single "to do" selected', statusQuery: 'toDo', expectedArgs: ['DRAFT', 'INFORMATION_REQUIRED'] },
    {
      scenario: 'single "submitted" selected',
      statusQuery: 'submitted',
      expectedArgs: ['AWAITING_ANALYSIS', 'INFORMATION_AMENDED', 'IN_ANALYSIS'],
    },
    {
      scenario: 'multiple selected - "to do" and "done"',
      statusQuery: ['toDo', 'done'],
      expectedArgs: ['DRAFT', 'INFORMATION_REQUIRED', 'CLOSED', 'DUPLICATE'],
    },
  ])('should submit correct status args when $scenario', ({ statusQuery, expectedArgs }) => {
    const expectedParams: Partial<GetReportsParams> = {
      location: ['MDI'],
      incidentDateFrom: undefined,
      incidentDateUntil: undefined,
      involvingPrisonerNumber: undefined,
      page: 0,
      reference: undefined,
      sort: ['incidentDateAndTime,DESC'],
      status: expectedArgs as Status[],
      type: undefined,
    }
    return request(appWithAllRoutes({ services: { userService }, userSupplier: () => reportingUser }))
      .get('/reports')
      .query({ incidentStatuses: statusQuery })
      .expect('Content-Type', /html/)
      .expect(() => {
        expect(incidentReportingApi.getReports).toHaveBeenCalledWith(expectedParams)
      })
  })
})

describe('work list filter validations in DW view', () => {
  beforeEach(() => {
    // actual table doesn't matter for these tests
    incidentReportingApi.getReports.mockResolvedValueOnce(unsortedPageOf([]))
  })

  it.each([
    { scenario: 'single "Draft" selected', statusQuery: 'DRAFT', expectedArgs: 'DRAFT' },
    { scenario: 'single "In analysis" selected', statusQuery: 'IN_ANALYSIS', expectedArgs: 'IN_ANALYSIS' },
    {
      scenario: 'multiple selected - "DRAFT", "IN_ANALYSIS" and "INFORMATION_AMENDED"',
      statusQuery: ['DRAFT', 'IN_ANALYSIS', 'INFORMATION_AMENDED'],
      expectedArgs: ['DRAFT', 'IN_ANALYSIS', 'INFORMATION_AMENDED'],
    },
  ])('should submit correct status args when $scenario', ({ statusQuery, expectedArgs }) => {
    const expectedParams: Partial<GetReportsParams> = {
      location: ['MDI', 'LEI'],
      incidentDateFrom: undefined,
      incidentDateUntil: undefined,
      involvingPrisonerNumber: undefined,
      page: 0,
      reference: undefined,
      sort: ['incidentDateAndTime,DESC'],
      status: expectedArgs as Status,
      type: undefined,
    }
    return request(appWithAllRoutes({ services: { userService }, userSupplier: () => approverUser }))
      .get('/reports')
      .query({ incidentStatuses: statusQuery })
      .expect('Content-Type', /html/)
      .expect(() => {
        expect(incidentReportingApi.getReports).toHaveBeenCalledWith(expectedParams)
      })
  })
})

describe('Establishment filter validations', () => {
  beforeEach(() => {
    // actual table doesn't matter for these tests
    incidentReportingApi.getReports.mockResolvedValueOnce(unsortedPageOf([]))
  })

  it.each([
    {
      usertype: 'RO',
      queryLocation: 'ASH',
      expectedLocations: ['MDI'],
      user: reportingUser,
      expectedStatus: undefined,
    },
    {
      usertype: 'DW',
      queryLocation: 'ASH',
      expectedLocations: ['MDI', 'LEI'],
      user: approverUser,
      expectedStatus: undefined,
    },
  ])(
    'Establishment locations should default to caseload locations and show error if query is set to location outside of caseload for $usertype',
    ({ queryLocation, expectedLocations, user, expectedStatus }) => {
      const expectedParams: Partial<GetReportsParams> = {
        location: expectedLocations,
        incidentDateFrom: undefined,
        incidentDateUntil: undefined,
        involvingPrisonerNumber: undefined,
        page: 0,
        reference: undefined,
        sort: ['incidentDateAndTime,DESC'],
        status: expectedStatus,
        type: undefined,
      }
      return request(appWithAllRoutes({ services: { userService }, userSupplier: () => user }))
        .get('/reports')
        .query({ location: queryLocation })
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Establishments can only be selected if they exist in the user’s caseload')
          expect(incidentReportingApi.getReports).toHaveBeenCalledWith(expectedParams)
        })
    },
  )
})

describe('Type family filter validations', () => {
  it.each([
    { scenario: 'unknown family code was supplied', query: { typeFamily: 'MISSING' } },
    { scenario: 'mistakenly filtering by type, not family', query: { typeFamily: 'DAMAGE_1' } },
    { scenario: 'more than one family was supplied', query: { typeFamily: ['DAMAGE', 'FIND'] } },
  ])('should show an error when $scenario', ({ query }) => {
    return request(app)
      .get('/reports')
      .query(query)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('There is a problem')
        expect(res.text).toContain('Select a valid incident type')
        const [args] = incidentReportingApi.getReports.mock.lastCall
        expect(args.type).toBeUndefined()
      })
  })
})

describe('Status/work list filter validations', () => {
  beforeEach(() => {
    // actual table doesn't matter for these tests
    incidentReportingApi.getReports.mockResolvedValueOnce(unsortedPageOf([]))
  })

  it.each([
    {
      scenario: 'single invalid entry',
      usertype: 'RO',
      expectedLocations: ['MDI'],
      user: reportingUser,
      queryStatus: 'DRAFT',
      expectedStatus: undefined,
      expectedError: 'Work list filter submitted contains invalid values',
    },
    {
      scenario: 'multiple invalid entries',
      usertype: 'RO',
      expectedLocations: ['MDI'],
      user: reportingUser,
      queryStatus: ['DRAFT', 'AWAITING_ANALYSIS'],
      expectedStatus: undefined,
      expectedError: 'Work list filter submitted contains invalid values',
    },
    {
      scenario: 'invalid entries alongside valid entries',
      usertype: 'RO',
      expectedLocations: ['MDI'],
      user: reportingUser,
      queryStatus: ['submitted', 'done', 'DRAFT', 'AWAITING_ANALYSIS'],
      expectedStatus: undefined,
      expectedError: 'Work list filter submitted contains invalid values',
    },
    {
      scenario: 'entry entirely invalid for any user',
      usertype: 'RO',
      expectedLocations: ['MDI'],
      user: reportingUser,
      queryStatus: 'random_status',
      expectedStatus: undefined,
      expectedError: 'Work list filter submitted contains invalid values',
    },
    {
      scenario: 'entries entirely invalid for any user',
      usertype: 'RO',
      expectedLocations: ['MDI'],
      user: reportingUser,
      queryStatus: ['random_status', 'another_option'],
      expectedStatus: undefined,
      expectedError: 'Work list filter submitted contains invalid values',
    },
    {
      scenario: 'single invalid entry',
      usertype: 'DW',
      expectedLocations: ['MDI', 'LEI'],
      user: approverUser,
      queryStatus: 'toDo',
      expectedStatus: undefined,
      expectedError: 'Status filter submitted contains invalid values',
    },
    {
      scenario: 'multiple invalid entries',
      usertype: 'DW',
      expectedLocations: ['MDI', 'LEI'],
      user: approverUser,
      queryStatus: ['toDo', 'done'],
      expectedStatus: undefined,
      expectedError: 'Status filter submitted contains invalid values',
    },
    {
      scenario: 'invalid entries alongside valid entries',
      usertype: 'DW',
      expectedLocations: ['MDI', 'LEI'],
      user: approverUser,
      queryStatus: ['submitted', 'done', 'DRAFT', 'AWAITING_ANALYSIS'],
      expectedStatus: undefined,
      expectedError: 'Status filter submitted contains invalid values',
    },
    {
      scenario: 'entry entirely invalid for any user',
      usertype: 'DW',
      expectedLocations: ['MDI', 'LEI'],
      user: approverUser,
      queryStatus: 'random_status',
      expectedStatus: undefined,
      expectedError: 'Status filter submitted contains invalid values',
    },
    {
      scenario: 'entries entirely invalid for any user',
      usertype: 'DW',
      expectedLocations: ['MDI', 'LEI'],
      user: approverUser,
      queryStatus: ['random_status', 'another_option'],
      expectedStatus: undefined,
      expectedError: 'Status filter submitted contains invalid values',
    },
  ])(
    'Status/work list should default to undefined and show error if query is set to option invalid for $usertype with $scenario',
    ({ queryStatus, expectedLocations, user, expectedStatus, expectedError }) => {
      const expectedParams: Partial<GetReportsParams> = {
        location: expectedLocations,
        incidentDateFrom: undefined,
        incidentDateUntil: undefined,
        involvingPrisonerNumber: undefined,
        page: 0,
        reference: undefined,
        sort: ['incidentDateAndTime,DESC'],
        status: expectedStatus,
        type: undefined,
      }
      return request(appWithAllRoutes({ services: { userService }, userSupplier: () => user }))
        .get('/reports')
        .query({ incidentStatuses: queryStatus })
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(expectedError)
          expect(incidentReportingApi.getReports).toHaveBeenCalledWith(expectedParams)
        })
    },
  )
})
