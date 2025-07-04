import type { Express } from 'express'
import request from 'supertest'

import { IncidentReportingApi, type ReportWithDetails } from '../../../../data/incidentReportingApi'
import { convertReportWithDetailsDates } from '../../../../data/incidentReportingApiUtils'
import ManageUsersApiClient, { type UsersSearchResponse } from '../../../../data/manageUsersApiClient'
import { mockErrorResponse, mockReport } from '../../../../data/testData/incidentReporting'
import { mockPrisonUserSearchResult } from '../../../../data/testData/manageUsers'
import { leeds, moorland } from '../../../../data/testData/prisonApi'
import { mockThrownError } from '../../../../data/testData/thrownErrors'
import {
  mockDataWarden,
  mockReportingOfficer,
  mockHqViewer,
  mockUnauthorisedUser,
} from '../../../../data/testData/users'
import { appWithAllRoutes } from '../../../testutils/appSetup'
import { now } from '../../../../testutils/fakeClock'
import type { Values } from './fields'
import { PrisonApi } from '../../../../data/prisonApi'

jest.mock('../../../../data/incidentReportingApi')
jest.mock('../../../../data/manageUsersApiClient')

let app: Express
let prisonApi: jest.Mocked<PrisonApi>
let incidentReportingApi: jest.Mocked<IncidentReportingApi>
let manageUsersApiClient: jest.Mocked<ManageUsersApiClient>

beforeEach(() => {
  app = appWithAllRoutes()

  prisonApi = PrisonApi.prototype as jest.Mocked<PrisonApi>
  prisonApi.getServicePrisonIds = jest.fn().mockResolvedValue(['MDI'])

  incidentReportingApi = IncidentReportingApi.prototype as jest.Mocked<IncidentReportingApi>
  manageUsersApiClient = ManageUsersApiClient.prototype as jest.Mocked<ManageUsersApiClient>
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Searching for a member of staff to add to a report', () => {
  let report: ReportWithDetails

  beforeEach(() => {
    report = convertReportWithDetailsDates(
      mockReport({
        type: 'FIND_6',
        reportReference: '6544',
        reportDateAndTime: now,
        withDetails: true,
      }),
    )
    report.staffInvolved = []
    incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(report)
  })

  function searchPageUrl(): string {
    return `/reports/${report.id}/staff/search`
  }

  function expectPageNotSubmitted(res: request.Response): void {
    expect(res.text).toContain('app-staff-search')

    expect(res.text).toContain('Search for a member of staff')
    expect(res.text).toContain('You can add more later')

    expect(res.text).not.toContain('Select the member of staff')
    expect(res.text).not.toContain(
      'Contact the person directly if you need to confirm which email address belongs to them',
    )
    expect(res.text).not.toContain('manually add the member of staff')

    expect(res.text).not.toContain('cannot be found')
    expect(res.text).not.toContain('Ask the person what name is on their Digital Prison Services account')
  }

  function expectPageSubmittedWithResults(res: request.Response): void {
    expect(res.text).toContain('app-staff-search')

    expect(res.text).not.toContain('Search for a member of staff')
    expect(res.text).not.toContain('You can add more later')

    expect(res.text).toContain('Select the member of staff')
    expect(res.text).toContain('Contact the person directly if you need to confirm which email address belongs to them')
    expect(res.text).toContain('manually add the member of staff')

    expect(res.text).not.toContain('cannot be found')
    expect(res.text).not.toContain('Ask the person what name is on their Digital Prison Services account')
  }

  function expectPageSubmittedWithoutResults(res: request.Response): void {
    expect(res.text).toContain('app-staff-search')

    expect(res.text).not.toContain('Search for a member of staff')
    expect(res.text).not.toContain('You can add more later')

    expect(res.text).not.toContain('Select the member of staff')
    expect(res.text).not.toContain(
      'Contact the person directly if you need to confirm which email address belongs to them',
    )

    expect(res.text).toContain('cannot be found')
    expect(res.text).toContain('Ask the person what name is on their Digital Prison Services account')
    expect(res.text).toContain('manually add the member of staff')
  }

  it('should 404 if report is not found', () => {
    const error = mockThrownError(mockErrorResponse({ status: 404, message: 'Report not found' }), 404)
    incidentReportingApi.getReportWithDetailsById.mockReset()
    incidentReportingApi.getReportWithDetailsById.mockRejectedValueOnce(error)

    return request(app)
      .get(searchPageUrl())
      .expect(404)
      .expect(res => {
        expect(res.text).toContain('Page not found')

        expect(manageUsersApiClient.searchUsers).not.toHaveBeenCalled()
      })
  })

  it('should display search form and not perform search until something is submitted', () => {
    return request(app)
      .get(searchPageUrl())
      .expect(200)
      .expect(res => {
        expectPageNotSubmitted(res)

        expect(res.text).not.toContain('There is a problem')

        expect(manageUsersApiClient.searchUsers).not.toHaveBeenCalled()
      })
  })

  it.each([
    {
      scenario: 'name is not provided',
      invalidPayload: { q: '', page: '1' },
      expectedError: 'Enter a member of staff’s name',
    },
    {
      scenario: 'page is invalid',
      invalidPayload: { q: 'John', page: '0' },
      expectedError: 'Page is not valid',
    },
  ])('should display errors when $scenario', ({ invalidPayload, expectedError }) => {
    return request(app)
      .get(searchPageUrl())
      .query(invalidPayload)
      .expect(200)
      .expect(res => {
        expectPageNotSubmitted(res)

        expect(res.text).toContain('There is a problem')
        expect(res.text).toContain(expectedError)

        expect(manageUsersApiClient.searchUsers).not.toHaveBeenCalled()
      })
  })

  it.each([
    {
      scenario: 'on submission',
      validPayload: { q: 'John', page: '1' },
      expectedCall: ['test-system-token', 'John', 0],
    },
    {
      scenario: 'on another page',
      validPayload: { q: 'Smith', page: '2' },
      expectedCall: ['test-system-token', 'Smith', 1],
    },
    {
      scenario: 'ignoring missing page',
      validPayload: { q: 'Barry' },
      expectedCall: ['test-system-token', 'Barry', 0],
    },
  ])('should search for staff $scenario', ({ validPayload, expectedCall }) => {
    // mock no results as this test is concerned with api call, table contents tested separately
    manageUsersApiClient.searchUsers.mockResolvedValueOnce({
      content: [],
      number: 0,
      totalElements: 0,
      totalPages: 0,
      last: true,
    })

    return request(app)
      .get(searchPageUrl())
      .query(validPayload)
      .expect(200)
      .expect(res => {
        expectPageSubmittedWithoutResults(res)

        expect(res.text).not.toContain('There is a problem')
        expect(res.text).toContain(`‘${validPayload.q}’ cannot be found`)

        expect(manageUsersApiClient.searchUsers).toHaveBeenCalledWith(...expectedCall)
      })
  })

  describe('Results table', () => {
    let validPayload: Values
    let results: UsersSearchResponse

    beforeEach(() => {
      validPayload = {
        q: 'Smith',
        page: '1',
      }
      results = {
        content: [
          // typical user
          mockPrisonUserSearchResult,
          // another prison
          {
            username: 'lev79n',
            firstName: 'BARRY',
            lastName: 'HARRISON',
            email: 'b.harrison1@localhost',
            activeCaseload: {
              id: leeds.agencyId,
              name: leeds.description,
            },
          },
          // missing email
          {
            username: 'abc12a',
            firstName: 'MARY',
            lastName: 'JOHNSON',
            activeCaseload: {
              id: moorland.agencyId,
              name: moorland.description,
            },
          },
          // missing active caseload (e.g. central admin?)
          {
            username: 'cde45z',
            firstName: 'PENELOPE',
            lastName: 'ROSE',
            email: 'p.rose@localhost',
          },
          // missing username (shouldn't be possible)
          {
            username: '',
            firstName: 'BOT',
            lastName: 'USER',
            email: 'bot@localhost',
          },
        ],
        number: 1,
        totalElements: 1,
        totalPages: 1,
        last: true,
      }
      manageUsersApiClient.searchUsers.mockResolvedValueOnce(results)
    })

    it('should display 1 page of results without pagination', () => {
      return request(app)
        .get(searchPageUrl())
        .query(validPayload)
        .expect(200)
        .expect(res => {
          expectPageSubmittedWithResults(res)

          expect(res.text).not.toContain('There is a problem')

          // results table
          expect(res.text).toContain('Select John Smith')
          expect(res.text).toContain('Moorland')
          expect(res.text).toContain('user1@localhost')
          expect(res.text).toContain(`/reports/${report.id}/staff/add/username/user1`)
          expect(res.text).toContain('Select Barry Harrison')
          expect(res.text).toContain('Leeds')
          expect(res.text).toContain('Select Mary Johnson')
          expect(res.text).toContain('Select Penelope Rose')

          expect(res.text).not.toContain('bot@localhost')

          // no pagination links
          expect(res.text).not.toContain('moj-pagination__item')
          expect(res.text).not.toContain('Page 1 of')
          expect(res.text).not.toContain('&amp;page=1')
          expect(res.text).not.toContain('&amp;page=2')
        })
    })

    it('should display a page of results pagination when there are more pages', () => {
      results.totalElements = 21

      return request(app)
        .get(searchPageUrl())
        .query(validPayload)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('app-staff-search')

          expect(res.text).not.toContain('There is a problem')

          // pagination links
          expect(res.text).toContain('moj-pagination__item')
          expect(res.text).toContain('Page 1 of 2')
          expect(res.text).not.toContain('&amp;page=1')
          expect(res.text).toContain('&amp;page=2')
        })
    })

    it('should display another page of results', () => {
      results.totalElements = 21
      validPayload.page = '2'

      return request(app)
        .get(searchPageUrl())
        .query(validPayload)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('app-staff-search')

          expect(res.text).not.toContain('There is a problem')

          // pagination links
          expect(res.text).toContain('moj-pagination__item')
          expect(res.text).toContain('Page 1 of 2')
          expect(res.text).toContain('&amp;page=1')
          expect(res.text).not.toContain('&amp;page=2')
        })
    })

    it('should redirect to last page if out of bounds', () => {
      results.content = []
      results.totalElements = 21
      validPayload.page = '200'

      return request(app)
        .get(searchPageUrl())
        .query(validPayload)
        .expect(302)
        .expect(res => {
          expect(res.headers.location).toContain(`/reports/${report.id}/staff/search`)
          expect(res.headers.location).toContain('&page=2')
        })
    })
  })

  it('should show an error if API rejects request', () => {
    const error = mockThrownError(mockErrorResponse({ message: 'Query is too long' }))
    manageUsersApiClient.searchUsers.mockRejectedValueOnce(error)

    return request(app)
      .get(searchPageUrl())
      .query({ q: 'John', page: '1' })
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('There is a problem')
        expect(res.text).toContain('Sorry, there was a problem with your request')
        expect(res.text).not.toContain('Bad Request')
        expect(res.text).not.toContain('Query is too long')
      })
  })

  describe('Permissions', () => {
    // NB: these test cases are simplified because the permissions class methods are thoroughly tested elsewhere

    const granted = 'granted' as const
    const denied = 'denied' as const
    it.each([
      { userType: 'reporting officer', user: mockReportingOfficer, action: granted },
      { userType: 'data warden', user: mockDataWarden, action: denied },
      { userType: 'HQ view-only user', user: mockHqViewer, action: denied },
      { userType: 'unauthorised user', user: mockUnauthorisedUser, action: denied },
    ])('should be $action to $userType', ({ user, action }) => {
      const testRequest = request(appWithAllRoutes({ userSupplier: () => user }))
        .get(searchPageUrl())
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
