import type { Express } from 'express'
import request from 'supertest'

import { appWithAllRoutes } from '../testutils/appSetup'
import { now } from '../../testutils/fakeClock'
import { type GetReportsParams, IncidentReportingApi } from '../../data/incidentReportingApi'
import { mockReport } from '../../data/testData/incidentReporting'
import { unsortedPageOf } from '../../data/testData/paginatedResponses'
import { mockSharedUser } from '../../data/testData/manageUsers'
import { approverUser, hqUser, reportingUser, unauthorisedUser } from '../../data/testData/users'
import { convertBasicReportDates } from '../../data/incidentReportingApiUtils'
import UserService from '../../services/userService'
import config from '../../config'
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
    { userType: 'data warden', user: approverUser, action: show },
    { userType: 'HQ view-only user', user: hqUser, action: hide },
    { userType: 'unauthorised user', user: unauthorisedUser, action: hide },
  ])('should $action report button for $userType', ({ user, action }) => {
    return request(appWithAllRoutes({ services: { userService }, userSupplier: () => user }))
      .get('/reports')
      .expect(res => {
        if (action === show) {
          expect(res.text).toContain('Create an incident report')
        } else {
          expect(res.text).not.toContain('Create an incident report')
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
      .expect(res => {
        expect(res.text).toContain('Incident reports')
        expect(res.text).toContain('Create an incident report')
        expect(res.text).toContain('6543')
        expect(res.text).toContain('6544')
        expect(res.text).toContain('5 December 2023, 11:34')
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
      .expect(res => {
        expect(res.text).toContain('Incident reports')
        expect(res.text).toContain('Create an incident report')
        expect(res.text).toContain('6543')
        expect(res.text).toContain('6544')
        expect(res.text).toContain('5 December 2023, 11:34')
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
      type: 'ATTEMPTED_ESCAPE_FROM_CUSTODY',
    }

    const queryParams = {
      searchID: 'A0011BC',
      fromDate: '01/01/2025',
      toDate: '14/01/2025',
      location: 'MDI',
      incidentType: 'ATTEMPTED_ESCAPE_FROM_CUSTODY',
      incidentStatuses: 'toDo',
    }

    return request(appWithAllRoutes({ services: { userService }, userSupplier: () => reportingUser }))
      .get(`/reports`)
      .query(queryParams)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).not.toContain(
          'Enter a valid incident reference number or offender ID. For example, 12345678 or A0011BB',
        )
        expect(res.text).not.toContain('There is a problem')
        expect(res.text).toContain('Clear filters')
        expect(incidentReportingApi.getReports).toHaveBeenCalledWith(expectedParams)
      })
  })

  it('should submit query values correctly into the api call for DW', () => {
    const expectedParams: Partial<GetReportsParams> = {
      location: 'LEI',
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
      location: 'LEI',
      incidentType: 'ATTEMPTED_ESCAPE_FROM_CUSTODY',
      incidentStatuses: 'DRAFT',
    }

    return request(appWithAllRoutes({ services: { userService }, userSupplier: () => approverUser }))
      .get(`/reports`)
      .query(queryParams)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).not.toContain(
          'Enter a valid incident reference number or offender ID. For example, 12345678 or A0011BB',
        )
        expect(res.text).not.toContain('There is a problem')
        expect(res.text).toContain('Clear filters')
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
      .expect(res => {
        expect(res.text).toContain('6543')
        expect(res.text).toContain('Finds')
        expect(res.text).toContain('5 December 2023, 11:34')
        expect(res.text).toContain('A new incident created in the new service of type FINDS')
        expect(res.text).toContain('John Smith')
        expect(res.text).not.toContain('Moorland (HMP &amp; YOI)')
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
      .expect(res => {
        expect(res.text).toContain('6543')
        expect(res.text).toContain('Finds')
        expect(res.text).toContain('5 December 2023, 11:34')
        expect(res.text).toContain('A new incident created in the new service of type FINDS')
        expect(res.text).not.toContain('John Smith')
        expect(res.text).toContain('Moorland (HMP &amp; YOI)')
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
      .expect(res => {
        expect(res.text).toContain('searchID')
        expect(res.text).toContain('Search an incident number or offender ID')
        expect(res.text).toContain('fromDate')
        expect(res.text).toContain('Incident date from')
        expect(res.text).toContain('toDate')
        expect(res.text).toContain('Incident date to')
        expect(res.text).toContain('Establishment')
        expect(res.text).toContain('location')
        expect(res.text).toContain('incidentType')
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
      status: ['DRAFT', 'INFORMATION_REQUIRED'],
      type: undefined,
    }

    return request(appWithAllRoutes({ services: { userService }, userSupplier: () => reportingUser }))
      .get(`/reports`)
      .query({ searchID: searchValue })
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain(
          'Enter a valid incident reference number or offender ID. For example, 12345678 or A0011BB',
        )
        expect(res.text).toContain('There is a problem')
        expect(res.text).toContain('Clear filters')
        expect(incidentReportingApi.getReports).toHaveBeenCalledWith(expectedParams)
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
      status: ['DRAFT', 'INFORMATION_REQUIRED'],
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
      status: ['DRAFT', 'INFORMATION_REQUIRED'],
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
      status: ['DRAFT', 'INFORMATION_REQUIRED'],
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
      status: ['DRAFT', 'INFORMATION_REQUIRED'],
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
      .query({ fromDate: '02/01/2025', toDate: '01/01/2025' })
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
      expectedStatus: ['DRAFT', 'INFORMATION_REQUIRED'] as Status[],
    },
    {
      usertype: 'DW',
      queryLocation: 'ASH',
      expectedLocations: ['MDI', 'LEI'],
      user: approverUser,
      expectedStatus: undefined,
    },
  ])(
    'Establishment locations should default to caseload locations if query is set to location outside of caseload for $usertype',
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
        .expect(() => {
          expect(incidentReportingApi.getReports).toHaveBeenCalledWith(expectedParams)
        })
    },
  )
})
