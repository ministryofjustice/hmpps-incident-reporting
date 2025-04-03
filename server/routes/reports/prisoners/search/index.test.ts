import type { Express } from 'express'
import request from 'supertest'

import { IncidentReportingApi, type ReportWithDetails } from '../../../../data/incidentReportingApi'
import { convertReportWithDetailsDates } from '../../../../data/incidentReportingApiUtils'
import { OffenderSearchApi, type OffenderSearchResults } from '../../../../data/offenderSearchApi'
import { mockErrorResponse, mockReport } from '../../../../data/testData/incidentReporting'
import { andrew, barry, chris, donald, ernie, fred } from '../../../../data/testData/offenderSearch'
import { mockThrownError } from '../../../../data/testData/thrownErrors'
import { approverUser, hqUser, reportingUser, unauthorisedUser } from '../../../../data/testData/users'
import { appWithAllRoutes } from '../../../testutils/appSetup'
import { now } from '../../../../testutils/fakeClock'
import type { Values } from './fields'

jest.mock('../../../../data/incidentReportingApi')
jest.mock('../../../../data/offenderSearchApi')

let app: Express
let incidentReportingApi: jest.Mocked<IncidentReportingApi>
let offenderSearchApi: jest.Mocked<OffenderSearchApi>

beforeEach(() => {
  app = appWithAllRoutes()

  incidentReportingApi = IncidentReportingApi.prototype as jest.Mocked<IncidentReportingApi>
  offenderSearchApi = OffenderSearchApi.prototype as jest.Mocked<OffenderSearchApi>
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Searching for a prisoner to add to a report', () => {
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
    report.prisonersInvolved = []
    incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(report)
  })

  function searchPageUrl(): string {
    return `/reports/${report.id}/prisoners/search`
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

        expect(offenderSearchApi.searchInPrison).not.toHaveBeenCalled()
        expect(offenderSearchApi.searchGlobally).not.toHaveBeenCalled()
      })
  })

  it('should display search form and not perform search until something is submitted', () => {
    return request(app)
      .get(searchPageUrl())
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('app-prisoner-search')

        expect(res.text).toContain('Search for a prisoner')
        expect(res.text).toContain('In Moorland')

        expect(offenderSearchApi.searchInPrison).not.toHaveBeenCalled()
        expect(offenderSearchApi.searchGlobally).not.toHaveBeenCalled()
      })
  })

  it.each([
    {
      scenario: 'name or prisoner number is not provided',
      invalidPayload: { q: '', global: 'yes', page: '1' },
      expectedError: 'Enter the prisoner&#39;s name or prison number',
    },
    {
      scenario: 'global option is invalid',
      invalidPayload: { q: 'John', global: '', page: '1' },
      expectedError: 'Choose where to search',
    },
    {
      scenario: 'page is invalid',
      invalidPayload: { q: 'John', global: 'no', page: '0' },
      expectedError: 'Page is not valid',
    },
  ])('should display errors when $scenario', ({ invalidPayload, expectedError }) => {
    return request(app)
      .get(searchPageUrl())
      .query(invalidPayload)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('app-prisoner-search')

        expect(res.text).toContain('There is a problem')
        expect(res.text).toContain(expectedError)

        expect(offenderSearchApi.searchInPrison).not.toHaveBeenCalled()
        expect(offenderSearchApi.searchGlobally).not.toHaveBeenCalled()
      })
  })

  it.each([
    {
      scenario: 'on submission',
      validPayload: { q: 'John', global: 'no', page: '1' },
      expectedCall: ['MDI', 'John', 0],
    },
    {
      scenario: 'on another page',
      validPayload: { q: 'Smith', global: 'no', page: '2' },
      expectedCall: ['MDI', 'Smith', 1],
    },
    {
      scenario: 'ignoring missing location switch',
      validPayload: { q: 'A1234AA', page: '1' },
      expectedCall: ['MDI', 'A1234AA', 0],
    },
    {
      scenario: 'ignoring missing page',
      validPayload: { q: 'Barry', global: 'no' },
      expectedCall: ['MDI', 'Barry', 0],
    },
  ])('should search in active caseload prison $scenario', ({ validPayload, expectedCall }) => {
    // mock no results as this test is concerned with api call, table contents tested separately
    offenderSearchApi.searchInPrison.mockResolvedValueOnce({
      content: [],
      totalElements: 0,
    })

    return request(app)
      .get(searchPageUrl())
      .query(validPayload)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('app-prisoner-search')

        expect(res.text).not.toContain('There is a problem')
        expect(res.text).toContain(`0 results found for “${validPayload.q}”.`)

        expect(offenderSearchApi.searchInPrison).toHaveBeenCalledWith(...expectedCall)
        expect(offenderSearchApi.searchGlobally).not.toHaveBeenCalled()
      })
  })

  it.each([
    {
      scenario: 'for surname',
      validPayload: { q: 'Smith', global: 'yes', page: '1' },
      expectedCall: [
        {
          lastName: 'Smith',
          location: 'ALL',
          includeAliases: true,
        },
        0,
      ],
    },
    {
      scenario: 'on another page',
      validPayload: { q: 'Smith', global: 'yes', page: '2' },
      expectedCall: [
        {
          lastName: 'Smith',
          location: 'ALL',
          includeAliases: true,
        },
        1,
      ],
    },
    {
      scenario: 'ignoring missing page',
      validPayload: { q: 'Smith', global: 'yes' },
      expectedCall: [
        {
          lastName: 'Smith',
          location: 'ALL',
          includeAliases: true,
        },
        0,
      ],
    },

    {
      scenario: 'for a prisoner number',
      validPayload: { q: 'a1234ab', global: 'yes', page: '1' },
      expectedCall: [
        {
          prisonerIdentifier: 'A1234AB',
          location: 'ALL',
          includeAliases: true,
        },
        0,
      ],
    },

    {
      scenario: 'for first and last name',
      validPayload: { q: 'Smith John', global: 'yes', page: '1' },
      expectedCall: [
        {
          firstName: 'John',
          lastName: 'Smith',
          location: 'ALL',
          includeAliases: true,
        },
        0,
      ],
    },
    {
      scenario: 'ignoring more than 2 words', // which is a shame
      validPayload: { q: 'Arnold Andrew Moorland', global: 'yes', page: '1' },
      expectedCall: [
        {
          firstName: 'Andrew',
          lastName: 'Arnold',
          location: 'ALL',
          includeAliases: true,
        },
        0,
      ],
    },
    {
      scenario: 'treating the whole thing as a prisoner number if any numbers exist', // which of course is nonsense
      validPayload: { q: 'Arnold a1111aa', global: 'yes', page: '1' },
      expectedCall: [
        {
          prisonerIdentifier: 'ARNOLD A1111AA',
          location: 'ALL',
          includeAliases: true,
        },
        0,
      ],
    },
  ])('should search globally $scenario', ({ validPayload, expectedCall }) => {
    // mock no results as this test is concerned with api call, table contents tested separately
    offenderSearchApi.searchGlobally.mockResolvedValueOnce({
      content: [],
      totalElements: 0,
    })

    return request(app)
      .get(searchPageUrl())
      .query(validPayload)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('app-prisoner-search')

        expect(res.text).not.toContain('There is a problem')
        expect(res.text).toContain(`0 results found for “${validPayload.q}”.`)

        expect(offenderSearchApi.searchInPrison).not.toHaveBeenCalled()
        expect(offenderSearchApi.searchGlobally).toHaveBeenCalledWith(...expectedCall)
      })
  })

  describe.each([
    { scenario: 'locally', global: false },
    { scenario: 'globally', global: true },
  ])('Results table when searching $scenario', ({ global }) => {
    let validPayload: Values
    let results: OffenderSearchResults

    beforeEach(() => {
      validPayload = {
        q: 'Smith',
        global: global ? 'yes' : 'no',
        page: '1',
      }
      results = {
        content: [andrew, barry, chris, donald, ernie, fred],
        totalElements: 6,
      }
      if (global) {
        offenderSearchApi.searchGlobally.mockResolvedValueOnce(results)
      } else {
        offenderSearchApi.searchInPrison.mockResolvedValueOnce(results)
      }
    })

    // TODO: fakeClock() seems to prevent tests from running so age assertions need to be done in integration tests

    it('should display 1 page of results without pagination', () => {
      return request(app)
        .get(searchPageUrl())
        .query(validPayload)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('app-prisoner-search')

          expect(res.text).not.toContain('There is a problem')

          // results table
          expect(res.text).toContain('/prisoner/A2222BB/photo.jpeg')
          expect(res.text).toContain('Photo of Barry Benjamin')
          expect(res.text).toContain('Select Barry Benjamin')
          expect(res.text).toContain(`/reports/${report.id}/prisoners/add/A2222BB`)
          expect(res.text).toContain('Moorland')
          expect(res.text).toContain('Leeds')
          expect(res.text).toContain('Transfer')
          expect(res.text).toContain('Outside')
          expect(res.text).toContain('Not known')

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
          expect(res.text).toContain('app-prisoner-search')

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
          expect(res.text).toContain('app-prisoner-search')

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
          expect(res.headers.location).toContain(`/reports/${report.id}/prisoners/search`)
          expect(res.headers.location).toContain('&page=2')
        })
    })
  })

  it('should show an error if API rejects local request', () => {
    const error = mockThrownError(mockErrorResponse({ message: 'Query is too long' }))
    offenderSearchApi.searchInPrison.mockRejectedValueOnce(error)

    return request(app)
      .get(searchPageUrl())
      .query({ q: 'John', global: 'no', page: '1' })
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('There is a problem')
        expect(res.text).toContain('Sorry, there was a problem with your request')
        expect(res.text).not.toContain('Bad Request')
        expect(res.text).not.toContain('Query is too long')
      })
  })

  it('should show an error if API rejects global request', () => {
    const error = mockThrownError(mockErrorResponse({ message: 'Query is too long' }))
    offenderSearchApi.searchGlobally.mockRejectedValueOnce(error)

    return request(app)
      .get(searchPageUrl())
      .query({ q: 'Smith', global: 'yes', page: '1' })
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
      { userType: 'reporting officer', user: reportingUser, action: granted },
      { userType: 'data warden', user: approverUser, action: denied },
      { userType: 'HQ view-only user', user: hqUser, action: denied },
      { userType: 'unauthorised user', user: unauthorisedUser, action: denied },
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
