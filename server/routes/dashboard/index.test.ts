import type { Express } from 'express'
import request from 'supertest'

import { appWithAllRoutes } from '../testutils/appSetup'
import { now } from '../../testutils/fakeClock'
import { setActiveAgencies } from '../../data/activeAgencies'
import { rolePecs } from '../../data/constants'
import { type GetReportsParams, IncidentReportingApi } from '../../data/incidentReportingApi'
import { convertReportDates } from '../../data/incidentReportingApiUtils'
import { mockErrorResponse, mockReport } from '../../data/testData/incidentReporting'
import { unsortedPageOf } from '../../data/testData/paginatedResponses'
import { mockPecsRegions } from '../../data/testData/pecsRegions'
import { mockSharedUser } from '../../data/testData/manageUsers'
import { mockDataWarden, mockReportingOfficer, mockHqViewer, mockUnauthorisedUser } from '../../data/testData/users'
import { mockThrownError } from '../../data/testData/thrownErrors'
import UserService from '../../services/userService'
import type { Status } from '../../reportConfiguration/constants'

jest.mock('../../data/incidentReportingApi')
jest.mock('../../services/userService')

const incidentReportingApi = IncidentReportingApi.prototype as jest.Mocked<IncidentReportingApi>
const userService = UserService.prototype as jest.Mocked<UserService>

let app: Express

beforeAll(() => {
  mockPecsRegions()
})

beforeEach(() => {
  app = appWithAllRoutes({ services: { userService } })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Dashboard permissions', () => {
  // NB: these test cases are simplified because the permissions class methods are thoroughly tested elsewhere

  beforeEach(() => {
    // actual table doesn't matter for these tests
    incidentReportingApi.getReports.mockResolvedValueOnce(unsortedPageOf([]))
  })

  it.each([
    {
      userType: 'reporting officer',
      user: mockReportingOfficer,
      action: 'show',
      buttonText: 'Create a report for Moorland',
    },
    { userType: 'data warden', user: mockDataWarden, action: 'show', buttonText: 'Create a PECS report' },
    { userType: 'HQ view-only user', user: mockHqViewer, action: 'not show' },
    { userType: 'unauthorised user', user: mockUnauthorisedUser, action: 'not show' },
  ])('should $action create report button for $userType', ({ user, buttonText }) => {
    return request(appWithAllRoutes({ services: { userService }, userSupplier: () => user }))
      .get('/reports')
      .expect(res => {
        if (buttonText) {
          expect(res.text).toContain(buttonText)
        } else {
          expect(res.text).not.toContain('Create a report')
          expect(res.text).not.toContain('Create a PECS report')
        }
      })
  })

  it('should hide report button for reporting officer when their active caseload in not active in the service', () => {
    const testApp = appWithAllRoutes({
      services: { userService },
      userSupplier: () => mockReportingOfficer,
    })
    setActiveAgencies(['LEI'])

    return request(testApp)
      .get('/reports')
      .expect(res => {
        expect(res.text).not.toContain('Report an incident')
        expect(res.text).toContain('You must use NOMIS to create reports in this establishment')
      })
  })
})

describe('Dashboard', () => {
  beforeEach(() => {
    const mockedReports = [
      convertReportDates(mockReport({ reportReference: '6543', reportDateAndTime: now })),
      convertReportDates(mockReport({ reportReference: '6544', reportDateAndTime: now })),
    ]
    const pageOfReports = unsortedPageOf(mockedReports)
    incidentReportingApi.getReports.mockResolvedValueOnce(pageOfReports)

    userService.getUsers.mockResolvedValueOnce({ [mockSharedUser.username]: mockSharedUser })
  })

  it('should render dashboard with button and table, results filtered on caseload and "to do" status for reporting officers', () => {
    const expectedParams: Partial<GetReportsParams> = {
      location: ['MDI'],
      incidentDateFrom: undefined,
      incidentDateUntil: undefined,
      involvingPrisonerNumber: undefined,
      page: 0,
      reference: undefined,
      sort: ['incidentDateAndTime,DESC'],
      status: ['DRAFT', 'NEEDS_UPDATING', 'REOPENED'],
      type: undefined,
    }
    return request(app)
      .get('/reports?clearFilters=ToDo')
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('Incident reports')
        expect(res.text).toContain('Create a report for Moorland')
        expect(res.text).toContain('6543')
        expect(res.text).toContain('6544')
        expect(res.text).toContain('5/12/2023 at 11:34')
        expect(res.text).not.toContain('There is a problem')
        expect(incidentReportingApi.getReports).toHaveBeenCalledWith(expectedParams)
      })
  })

  it('should correctly clear all filters and default statuses when "Clear filters" clicked by reporting officer', () => {
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
      .query({ clearFilters: 'All' })
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('Incident reports')
        expect(res.text).toContain('Create a report for Moorland')
        expect(res.text).toContain('6543')
        expect(res.text).toContain('6544')
        expect(res.text).toContain('5/12/2023 at 11:34')
        expect(res.text).not.toContain('There is a problem')
        expect(incidentReportingApi.getReports).toHaveBeenCalledWith(expectedParams)
      })
  })

  it('should submit query values correctly to api call for reporting officer', () => {
    const expectedParams: Partial<GetReportsParams> = {
      location: ['MDI'],
      incidentDateFrom: new Date(2025, 0, 1, 12, 0, 0),
      incidentDateUntil: new Date(2025, 0, 14, 12, 0, 0),
      involvingPrisonerNumber: 'A0011BC',
      page: 0,
      reference: undefined,
      sort: ['incidentDateAndTime,DESC'],
      status: ['DRAFT', 'NEEDS_UPDATING', 'REOPENED'],
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

    return request(appWithAllRoutes({ services: { userService }, userSupplier: () => mockReportingOfficer }))
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

  it('should submit query values correctly to api call for data warden', () => {
    const expectedParams: Partial<GetReportsParams> = {
      location: ['LEI'],
      incidentDateFrom: new Date(2025, 0, 1, 12, 0, 0),
      incidentDateUntil: new Date(2025, 0, 4, 12, 0, 0),
      involvingPrisonerNumber: 'A0011BC',
      page: 0,
      reference: undefined,
      sort: ['incidentDateAndTime,DESC'],
      status: ['DRAFT'],
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

    return request(appWithAllRoutes({ services: { userService }, userSupplier: () => mockDataWarden }))
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

  it.each([
    {
      userType: 'reporting officer',
      user: {
        ...mockReportingOfficer,
        roles: [...mockReportingOfficer.roles, rolePecs],
      },
    },
    { userType: 'data warden', user: mockDataWarden },
    {
      userType: 'HQ view-only user',
      user: {
        ...mockHqViewer,
        roles: [...mockHqViewer.roles, rolePecs],
      },
    },
  ])(
    'should submit query values correctly to api for $userType (with PECS role) when searching for all PECS reports',
    ({ user }) => {
      return request(appWithAllRoutes({ services: { userService }, userSupplier: () => user }))
        .get('/reports')
        .query({ location: '.PECS' })
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          expect(res.text).not.toContain('There is a problem')
          expect(res.text).toContain('Clear filters')
          expect(incidentReportingApi.getReports).toHaveBeenCalledWith(
            expect.objectContaining({
              location: ['NORTH', 'SOUTH'],
            }),
          )
        })
    },
  )

  it.each([
    {
      userType: 'reporting officer',
      user: {
        ...mockReportingOfficer,
        roles: [...mockReportingOfficer.roles, rolePecs],
      },
    },
    { userType: 'data warden', user: mockDataWarden },
    {
      userType: 'HQ view-only user',
      user: {
        ...mockHqViewer,
        roles: [...mockHqViewer.roles, rolePecs],
      },
    },
  ])(
    'should submit query values correctly to api for $userType (with PECS role) when filtering by a single PECS region',
    ({ user }) => {
      return request(appWithAllRoutes({ services: { userService }, userSupplier: () => user }))
        .get('/reports')
        .query({ location: 'SOUTH' })
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          expect(res.text).not.toContain('There is a problem')
          expect(res.text).toContain('Clear filters')
          expect(incidentReportingApi.getReports).toHaveBeenCalledWith(
            expect.objectContaining({
              location: ['SOUTH'],
            }),
          )
        })
    },
  )

  it.each([
    // has access to only 1 prison (enabled in service)
    { userType: 'reporting officer', user: mockReportingOfficer, expectedLocations: ['MDI'] },
    // has access to 2 prisons (1 enabled) and all PECS regions (1 enabled)
    { userType: 'data warden', user: mockDataWarden, expectedLocations: ['MDI', 'NORTH'] },
    // has access to 2 prisons (1 enabled)
    { userType: 'HQ view-only user', user: mockHqViewer, expectedLocations: ['MDI'] },
  ])(
    'should submit query values correctly to api for $userType when searching for all active locations',
    ({ user, expectedLocations }) => {
      const testApp = appWithAllRoutes({ services: { userService }, userSupplier: () => user })
      setActiveAgencies(['MDI', 'NORTH']) // turns off LEI and SOUTH which some users could have accessed

      return request(testApp)
        .get('/reports')
        .query({ location: '.ACTIVE' })
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          expect(res.text).not.toContain('There is a problem')
          expect(res.text).toContain('Clear filters')
          expect(incidentReportingApi.getReports).toHaveBeenCalledWith(
            expect.objectContaining({
              location: expectedLocations,
            }),
          )
        })
    },
  )

  it('should submit query values correctly when selected type family has several types in it', () => {
    const queryParams = {
      typeFamily: 'FIND',
    }

    return request(appWithAllRoutes({ services: { userService }, userSupplier: () => mockDataWarden }))
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
      convertReportDates(
        mockReport({ reportReference: '6543', reportDateAndTime: now, reportingUsername: 'JOHN_SMITH' }),
      ),
      convertReportDates(
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

  it('should render expected filters for a reporting officer where caseload is only 1 establishment', () => {
    const expectedParams: Partial<GetReportsParams> = {
      location: ['MDI'],
      incidentDateFrom: undefined,
      incidentDateUntil: undefined,
      involvingPrisonerNumber: undefined,
      page: 0,
      reference: undefined,
      sort: ['incidentDateAndTime,DESC'],
      status: ['DRAFT', 'NEEDS_UPDATING', 'REOPENED'],
      type: undefined,
    }
    return request(appWithAllRoutes({ services: { userService }, userSupplier: () => mockReportingOfficer }))
      .get('/reports?clearFilters=ToDo')
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('searchID')
        expect(res.text).toContain('Search an incident number or offender ID')
        expect(res.text).toContain('fromDate')
        expect(res.text).toContain('Incident date from')
        expect(res.text).toContain('toDate')
        expect(res.text).toContain('Incident date to')
        expect(res.text).not.toContain('Location')
        expect(res.text).not.toContain('location')
        expect(res.text).toContain('typeFamily')
        expect(res.text).toContain('Incident type')
        expect(res.text).toContain('Incident report status')
        expect(res.text).not.toContain('Reporting status')
        expect(res.text).not.toContain('Reviewing status')
        expect(res.text).not.toContain('Completed status')
        expect(res.text).toContain('To do')
        expect(res.text).toContain('toDo')
        expect(res.text).not.toContain('DRAFT')
        expect(res.text).toContain('Apply filters')
        expect(res.text).toContain('Clear filters')
        expect(incidentReportingApi.getReports).toHaveBeenCalledWith(expectedParams)
      })
  })

  it('should render expected filters when cleared for a reporting officer where caseload is only 1 establishment', () => {
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
    return request(appWithAllRoutes({ services: { userService }, userSupplier: () => mockReportingOfficer }))
      .get('/reports')
      .query({ clearFilters: 'All' })
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('searchID')
        expect(res.text).toContain('Search an incident number or offender ID')
        expect(res.text).toContain('fromDate')
        expect(res.text).toContain('Incident date from')
        expect(res.text).toContain('toDate')
        expect(res.text).toContain('Incident date to')
        expect(res.text).not.toContain('Location')
        expect(res.text).not.toContain('location')
        expect(res.text).toContain('typeFamily')
        expect(res.text).toContain('Incident type')
        expect(res.text).toContain('Incident report status')
        expect(res.text).not.toContain('Reporting status')
        expect(res.text).not.toContain('Reviewing status')
        expect(res.text).not.toContain('Completed status')
        expect(res.text).toContain('To do')
        expect(res.text).toContain('toDo')
        expect(res.text).not.toContain('DRAFT')
        expect(res.text).toContain('Apply filters')
        expect(res.text).toContain('Clear filters')
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
      status: ['DRAFT', 'NEEDS_UPDATING', 'REOPENED'],
      type: undefined,
    }
    return request(appWithAllRoutes({ services: { userService }, userSupplier: () => mockReportingOfficer }))
      .get('/reports?clearFilters=ToDo')
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('6543')
        expect(res.text).toContain('Find of illicit items')
        expect(res.text).toContain('5/12/2023 at 11:34')
        expect(res.text).toContain('A new incident created in the new service of type FIND_6')
        expect(res.text).toContain('John Smith')
        // cannot check for Moorland because it appears in create button or column name
        expect(res.text).toContain('Draft')
        expect(res.text).toContain('A report that has been created but not yet submitted')
        expect(incidentReportingApi.getReports).toHaveBeenCalledWith(expectedParams)
      })
  })

  it('should render expected columns for a user with a multiple establishment caseload', () => {
    const expectedParams: Partial<GetReportsParams> = {
      location: ['MDI', 'LEI', 'NORTH', 'SOUTH'],
      incidentDateFrom: undefined,
      incidentDateUntil: undefined,
      involvingPrisonerNumber: undefined,
      page: 0,
      reference: undefined,
      sort: ['incidentDateAndTime,DESC'],
      status: undefined,
      type: undefined,
    }
    return request(appWithAllRoutes({ services: { userService }, userSupplier: () => mockDataWarden }))
      .get('/reports?clearFilers=All')
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('6543')
        expect(res.text).toContain('Find of illicit items')
        expect(res.text).toContain('5/12/2023 at 11:34')
        expect(res.text).toContain('A new incident created in the new service of type FIND_6')
        expect(res.text).not.toContain('John Smith')
        // cannot check for Moorland because it appears in create button or column name
        expect(res.text).toContain('Draft')
        expect(res.text).toContain('A report that has been created but not yet submitted')
        expect(incidentReportingApi.getReports).toHaveBeenCalledWith(expectedParams)
      })
  })

  it('should render expected filters for a data warden where caseload is multiple establishments', () => {
    const expectedParams: Partial<GetReportsParams> = {
      location: ['MDI', 'LEI', 'NORTH', 'SOUTH'],
      incidentDateFrom: undefined,
      incidentDateUntil: undefined,
      involvingPrisonerNumber: undefined,
      page: 0,
      reference: undefined,
      sort: ['incidentDateAndTime,DESC'],
      status: undefined,
      type: undefined,
    }
    return request(appWithAllRoutes({ services: { userService }, userSupplier: () => mockDataWarden }))
      .get('/reports?clearFilters=All')
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('searchID')
        expect(res.text).toContain('Search an incident number or offender ID')
        expect(res.text).toContain('fromDate')
        expect(res.text).toContain('Incident date from')
        expect(res.text).toContain('toDate')
        expect(res.text).toContain('Incident date to')
        expect(res.text).toContain('Location')
        expect(res.text).toContain('location')
        expect(res.text).toContain('typeFamily')
        expect(res.text).toContain('Incident type')
        expect(res.text).toContain('Reporting status')
        expect(res.text).toContain('Reviewing status')
        expect(res.text).toContain('Completed status')
        expect(res.text).not.toContain('Incident report status')
        expect(res.text).not.toContain('To do')
        expect(res.text).not.toContain('"toDo"')
        expect(res.text).toContain('Draft')
        expect(res.text).toContain('DRAFT')
        expect(res.text).toContain('Apply filters')
        expect(res.text).toContain('Clear filters')
        expect(incidentReportingApi.getReports).toHaveBeenCalledWith(expectedParams)
      })
  })
})

describe('Search validation', () => {
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

    return request(appWithAllRoutes({ services: { userService }, userSupplier: () => mockReportingOfficer }))
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

describe('Date validation', () => {
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

describe('Work list filter validation in reporting officer view', () => {
  beforeEach(() => {
    // actual table doesn't matter for these tests
    incidentReportingApi.getReports.mockResolvedValueOnce(unsortedPageOf([]))
  })

  it.each([
    { scenario: 'single "to do" selected', statusQuery: 'toDo', expectedArgs: ['DRAFT', 'NEEDS_UPDATING', 'REOPENED'] },
    {
      scenario: 'single "submitted" selected',
      statusQuery: 'submitted',
      expectedArgs: ['AWAITING_REVIEW', 'UPDATED', 'ON_HOLD', 'WAS_CLOSED'],
    },
    {
      scenario: 'multiple selected - "to do" and "completed"',
      statusQuery: ['toDo', 'completed'],
      expectedArgs: ['DRAFT', 'NEEDS_UPDATING', 'REOPENED', 'CLOSED', 'DUPLICATE', 'NOT_REPORTABLE'],
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
    return request(appWithAllRoutes({ services: { userService }, userSupplier: () => mockReportingOfficer }))
      .get('/reports')
      .query({ incidentStatuses: statusQuery })
      .expect('Content-Type', /html/)
      .expect(() => {
        expect(incidentReportingApi.getReports).toHaveBeenCalledWith(expectedParams)
      })
  })
})

describe('Work list filter validation in data warden view', () => {
  beforeEach(() => {
    // actual table doesn't matter for these tests
    incidentReportingApi.getReports.mockResolvedValueOnce(unsortedPageOf([]))
  })

  it.each([
    { scenario: 'single "Draft" selected', statusQuery: 'DRAFT', expectedArgs: ['DRAFT'] },
    { scenario: 'single "On hold" selected', statusQuery: 'ON_HOLD', expectedArgs: ['ON_HOLD'] },
    {
      scenario: 'multiple selected - "DRAFT", "ON_HOLD" and "UPDATED"',
      statusQuery: ['DRAFT', 'ON_HOLD', 'UPDATED'],
      expectedArgs: ['DRAFT', 'ON_HOLD', 'UPDATED'],
    },
  ])('should submit correct status args when $scenario', ({ statusQuery, expectedArgs }) => {
    const expectedParams: Partial<GetReportsParams> = {
      location: ['MDI', 'LEI', 'NORTH', 'SOUTH'],
      incidentDateFrom: undefined,
      incidentDateUntil: undefined,
      involvingPrisonerNumber: undefined,
      page: 0,
      reference: undefined,
      sort: ['incidentDateAndTime,DESC'],
      status: expectedArgs as Status[],
      type: undefined,
    }
    return request(appWithAllRoutes({ services: { userService }, userSupplier: () => mockDataWarden }))
      .get('/reports')
      .query({ incidentStatuses: statusQuery })
      .expect('Content-Type', /html/)
      .expect(() => {
        expect(incidentReportingApi.getReports).toHaveBeenCalledWith(expectedParams)
      })
  })
})

describe('Location filter validation', () => {
  beforeEach(() => {
    // actual table doesn't matter for these tests
    incidentReportingApi.getReports.mockResolvedValueOnce(unsortedPageOf([]))
  })

  it.each([
    {
      scenario: 'location outside of caseload',
      userType: 'reporting officer',
      queryLocation: 'ASH',
      expectedLocations: ['MDI'],
      user: mockReportingOfficer,
      expectedStatus: undefined,
    },
    {
      scenario: 'PECS',
      userType: 'reporting officer',
      queryLocation: '.PECS',
      expectedLocations: ['MDI'],
      user: mockReportingOfficer,
      expectedStatus: undefined,
    },
    {
      scenario: 'location outside of caseload',
      userType: 'data warden',
      queryLocation: 'ASH',
      expectedLocations: ['MDI', 'LEI', 'NORTH', 'SOUTH'],
      user: mockDataWarden,
      expectedStatus: undefined,
    },
  ])(
    'should default to caseload locations and show error if query is set to $scenario for $userType',
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
          expect(res.text).toContain('Select a location to search')
          expect(incidentReportingApi.getReports).toHaveBeenCalledWith(expectedParams)
        })
    },
  )
})

describe('Type family filter validation', () => {
  it.each([
    { scenario: 'unknown family code was supplied', query: { typeFamily: ['MISSING'] } },
    { scenario: 'mistakenly filtering by type, not family', query: { typeFamily: ['DAMAGE_1'] } },
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

describe('Status/work list filter validation', () => {
  beforeEach(() => {
    // actual table doesn't matter for these tests
    incidentReportingApi.getReports.mockResolvedValueOnce(unsortedPageOf([]))
  })

  it.each([
    {
      scenario: 'single invalid entry',
      userType: 'reporting officer',
      expectedLocations: ['MDI'],
      user: mockReportingOfficer,
      queryStatus: 'DRAFT',
      expectedStatus: undefined,
      expectedError: 'Select a valid work list',
    },
    {
      scenario: 'multiple invalid entries',
      userType: 'reporting officer',
      expectedLocations: ['MDI'],
      user: mockReportingOfficer,
      queryStatus: ['DRAFT', 'AWAITING_REVIEW'],
      expectedStatus: undefined,
      expectedError: 'Select a valid work list',
    },
    {
      scenario: 'invalid entries alongside valid entries',
      userType: 'reporting officer',
      expectedLocations: ['MDI'],
      user: mockReportingOfficer,
      queryStatus: ['submitted', 'completed', 'DRAFT', 'AWAITING_REVIEW'],
      expectedStatus: undefined,
      expectedError: 'Select a valid work list',
    },
    {
      scenario: 'entry entirely invalid for any user',
      userType: 'reporting officer',
      expectedLocations: ['MDI'],
      user: mockReportingOfficer,
      queryStatus: 'random_status',
      expectedStatus: undefined,
      expectedError: 'Select a valid work list',
    },
    {
      scenario: 'entries entirely invalid for any user',
      userType: 'reporting officer',
      expectedLocations: ['MDI'],
      user: mockReportingOfficer,
      queryStatus: ['random_status', 'another_option'],
      expectedStatus: undefined,
      expectedError: 'Select a valid work list',
    },
    {
      scenario: 'single invalid entry',
      userType: 'data warden',
      expectedLocations: ['MDI', 'LEI', 'NORTH', 'SOUTH'],
      user: mockDataWarden,
      queryStatus: 'toDo',
      expectedStatus: undefined,
      expectedError: 'Select a valid status',
    },
    {
      scenario: 'multiple invalid entries',
      userType: 'data warden',
      expectedLocations: ['MDI', 'LEI', 'NORTH', 'SOUTH'],
      user: mockDataWarden,
      queryStatus: ['toDo', 'completed'],
      expectedStatus: undefined,
      expectedError: 'Select a valid status',
    },
    {
      scenario: 'invalid entries alongside valid entries',
      userType: 'data warden',
      expectedLocations: ['MDI', 'LEI', 'NORTH', 'SOUTH'],
      user: mockDataWarden,
      queryStatus: ['submitted', 'completed', 'DRAFT', 'AWAITING_REVIEW'],
      expectedStatus: undefined,
      expectedError: 'Select a valid status',
    },
    {
      scenario: 'entry entirely invalid for any user',
      userType: 'data warden',
      expectedLocations: ['MDI', 'LEI', 'NORTH', 'SOUTH'],
      user: mockDataWarden,
      queryStatus: 'random_status',
      expectedStatus: undefined,
      expectedError: 'Select a valid status',
    },
    {
      scenario: 'entries entirely invalid for any user',
      userType: 'data warden',
      expectedLocations: ['MDI', 'LEI', 'NORTH', 'SOUTH'],
      user: mockDataWarden,
      queryStatus: ['random_status', 'another_option'],
      expectedStatus: undefined,
      expectedError: 'Select a valid status',
    },
  ])(
    'should default to undefined and show error if query is set to option invalid for $userType with $scenario',
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

  describe('Removal request filter validation in data warden view', () => {
    beforeEach(() => {
      // actual table doesn't matter for these tests
      incidentReportingApi.getReports.mockResolvedValueOnce(unsortedPageOf([]))
    })

    it('should submit correct user action args when filter selected', () => {
      const expectedParams: Partial<GetReportsParams> = {
        location: ['MDI', 'LEI', 'NORTH', 'SOUTH'],
        incidentDateFrom: undefined,
        incidentDateUntil: undefined,
        involvingPrisonerNumber: undefined,
        page: 0,
        reference: undefined,
        sort: ['incidentDateAndTime,DESC'],
        status: undefined,
        userAction: ['REQUEST_NOT_REPORTABLE', 'REQUEST_DUPLICATE'],
        type: undefined,
      }
      return request(appWithAllRoutes({ services: { userService }, userSupplier: () => mockDataWarden }))
        .get('/reports')
        .query({ latestUserActions: 'REQUEST_REMOVAL' })
        .expect('Content-Type', /html/)
        .expect(() => {
          expect(incidentReportingApi.getReports).toHaveBeenCalledWith(expectedParams)
        })
    })
  })
})
