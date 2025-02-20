import type { Express } from 'express'
import request from 'supertest'

import {
  IncidentReportingApi,
  RelatedObjects,
  type ReportWithDetails,
  type StaffInvolvement,
  type AddStaffInvolvementRequest,
  type UpdateStaffInvolvementRequest,
} from '../../../../data/incidentReportingApi'
import { convertReportWithDetailsDates } from '../../../../data/incidentReportingApiUtils'
import ManageUsersApiClient, { type PrisonUser } from '../../../../data/manageUsersApiClient'
import { mockErrorResponse, mockReport } from '../../../../data/testData/incidentReporting'
import { mockThrownError } from '../../../../data/testData/thrownErrors'
import { approverUser, hqUser, reportingUser, unauthorisedUser } from '../../../../data/testData/users'
import { appWithAllRoutes } from '../../../testutils/appSetup'
import { now } from '../../../../testutils/fakeClock'

jest.mock('../../../../data/incidentReportingApi')
jest.mock('../../../../data/manageUsersApiClient')

const mockPrisonUser: PrisonUser = {
  username: 'user1',
  firstName: 'JOHN',
  lastName: 'SMITH',
}

let app: Express
let incidentReportingApi: jest.Mocked<IncidentReportingApi>
let incidentReportingRelatedObjects: jest.Mocked<
  RelatedObjects<StaffInvolvement, AddStaffInvolvementRequest, UpdateStaffInvolvementRequest>
>
let manageUsersApiClient: jest.Mocked<ManageUsersApiClient>

beforeEach(() => {
  app = appWithAllRoutes({})

  incidentReportingApi = IncidentReportingApi.prototype as jest.Mocked<IncidentReportingApi>
  incidentReportingRelatedObjects = RelatedObjects.prototype as jest.Mocked<
    RelatedObjects<StaffInvolvement, AddStaffInvolvementRequest, UpdateStaffInvolvementRequest>
  >

  manageUsersApiClient = ManageUsersApiClient.prototype as jest.Mocked<ManageUsersApiClient>
  manageUsersApiClient.getPrisonUser.mockResolvedValueOnce(mockPrisonUser)
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Adding a new staff member to a report', () => {
  let report: ReportWithDetails

  beforeEach(() => {
    report = convertReportWithDetailsDates(
      mockReport({
        type: 'FINDS',
        reportReference: '6544',
        reportDateAndTime: now,
        withDetails: true,
      }),
    )
    report.staffInvolved = []
    incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(report)
  })

  function addPageUrl(username: string): string {
    return `/reports/${report.id}/staff/add/username/${username}`
  }

  it('should 404 if report is not found', () => {
    const error = mockThrownError(mockErrorResponse({ status: 404, message: 'Report not found' }), 404)
    incidentReportingApi.getReportWithDetailsById.mockReset()
    incidentReportingApi.getReportWithDetailsById.mockRejectedValueOnce(error)

    return request(app)
      .get(addPageUrl(mockPrisonUser.username))
      .expect(404)
      .expect(res => {
        expect(res.text).toContain('Page not found')

        expect(manageUsersApiClient.getPrisonUser).not.toHaveBeenCalledWith(mockPrisonUser.username)
      })
  })

  it('should 404 if staff user is not found', () => {
    const error = mockThrownError(mockErrorResponse({ status: 404, message: 'User not found' }), 404)
    manageUsersApiClient.getPrisonUser.mockReset()
    manageUsersApiClient.getPrisonUser.mockRejectedValueOnce(error)

    return request(app)
      .get(addPageUrl(mockPrisonUser.username))
      .expect(404)
      .expect(res => {
        expect(res.text).toContain('Page not found')

        expect(manageUsersApiClient.getPrisonUser).toHaveBeenCalledWith('test-system-token', mockPrisonUser.username)
      })
  })

  it('should display a form to describe staff involvement details', () => {
    return request(app)
      .get(addPageUrl(mockPrisonUser.username))
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('How was John Smith involved in the incident?')
        expect(res.text).toContain('Details of John’s involvement')

        expect(incidentReportingRelatedObjects.addToReport).not.toHaveBeenCalled()
      })
  })

  it.each([
    {
      scenario: 'request with all fields',
      validPayload: {
        staffRole: 'NEGOTIATOR',
        comment: 'See duty log',
      },
      expectedCall: {
        staffUsername: 'user1',
        firstName: 'JOHN',
        lastName: 'SMITH',
        staffRole: 'NEGOTIATOR',
        comment: 'See duty log',
      },
    },
    {
      scenario: 'request without comment',
      validPayload: {
        staffRole: 'NEGOTIATOR',
      },
      expectedCall: {
        staffUsername: 'user1',
        firstName: 'JOHN',
        lastName: 'SMITH',
        staffRole: 'NEGOTIATOR',
        comment: '',
      },
    },
  ])('should send add $scenario to API if form is valid and go to summary page', ({ validPayload, expectedCall }) => {
    incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(report)
    incidentReportingRelatedObjects.addToReport.mockResolvedValueOnce([]) // NB: response is ignored
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore need to mock a getter method
    incidentReportingApi.staffInvolved = incidentReportingRelatedObjects
    manageUsersApiClient.getPrisonUser.mockResolvedValueOnce(mockPrisonUser)

    return request(app)
      .post(addPageUrl(mockPrisonUser.username))
      .send(validPayload)
      .redirects(1)
      .expect(200)
      .expect(res => {
        expect(res.text).not.toContain('There is a problem')
        expect(res.redirects[0]).toMatch(`/reports/${report.id}/staff`)

        expect(incidentReportingRelatedObjects.addToReport).toHaveBeenCalledWith(report.id, expectedCall)
      })
  })

  it.each([
    {
      scenario: 'required role is absent',
      invalidPayload: {
        staffRole: '',
        comment: 'See duty log',
      },
      expectedError: 'Chose the staff member’s role',
    },
    {
      scenario: 'role is invalid',
      invalidPayload: {
        staffRole: 'INVALID',
        comment: 'See duty log',
      },
      expectedError: 'Chose the staff member’s role',
    },
  ])('should show an error when $scenario', ({ invalidPayload, expectedError }) => {
    incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(report)
    manageUsersApiClient.getPrisonUser.mockResolvedValueOnce(mockPrisonUser)

    return request
      .agent(app)
      .post(addPageUrl(mockPrisonUser.username))
      .send(invalidPayload)
      .redirects(1)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('There is a problem')
        expect(res.text).toContain(expectedError)

        expect(incidentReportingRelatedObjects.addToReport).not.toHaveBeenCalled()
      })
  })

  describe('Permissions', () => {
    // NB: these test cases are simplified because the permissions class methods are thoroughly tested elsewhere

    const granted = 'granted' as const
    const denied = 'denied' as const
    it.each([
      { userType: 'reporting officer', user: reportingUser, action: granted },
      { userType: 'data warden', user: approverUser, action: granted },
      { userType: 'HQ view-only user', user: hqUser, action: denied },
      { userType: 'unauthorised user', user: unauthorisedUser, action: denied },
    ])('should be $action to $userType', ({ user, action }) => {
      const testRequest = request(appWithAllRoutes({ userSupplier: () => user }))
        .get(addPageUrl(mockPrisonUser.username))
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
