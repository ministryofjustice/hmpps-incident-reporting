import request, { type Agent } from 'supertest'

import {
  IncidentReportingApi,
  RelatedObjects,
  type ReportWithDetails,
  type StaffInvolvement,
  type AddStaffInvolvementRequest,
  type UpdateStaffInvolvementRequest,
} from '../../../../../data/incidentReportingApi'
import { convertReportWithDetailsDates } from '../../../../../data/incidentReportingApiUtils'
import { mockErrorResponse, mockReport } from '../../../../../data/testData/incidentReporting'
import { mockThrownError } from '../../../../../data/testData/thrownErrors'
import { approverUser, hqUser, reportingUser, unauthorisedUser } from '../../../../../data/testData/users'
import { appWithAllRoutes } from '../../../../testutils/appSetup'
import { now } from '../../../../../testutils/fakeClock'
import ManageUsersApiClient from '../../../../../data/manageUsersApiClient'

jest.mock('../../../../../data/incidentReportingApi')
jest.mock('../../../../../data/manageUsersApiClient')

let agent: Agent

let incidentReportingApi: jest.Mocked<IncidentReportingApi>
let incidentReportingRelatedObjects: jest.Mocked<
  RelatedObjects<StaffInvolvement, AddStaffInvolvementRequest, UpdateStaffInvolvementRequest>
>
let manageUsersApiClient: jest.Mocked<ManageUsersApiClient>

beforeEach(() => {
  agent = request.agent(appWithAllRoutes({}))

  incidentReportingApi = IncidentReportingApi.prototype as jest.Mocked<IncidentReportingApi>
  incidentReportingRelatedObjects = RelatedObjects.prototype as jest.Mocked<
    RelatedObjects<StaffInvolvement, AddStaffInvolvementRequest, UpdateStaffInvolvementRequest>
  >

  manageUsersApiClient = ManageUsersApiClient.prototype as jest.Mocked<ManageUsersApiClient>
  manageUsersApiClient.getPrisonUser.mockRejectedValue(new Error('should not be called'))
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Adding a new staff member to a report who does not have a DPS/NOMIS account', () => {
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
  })

  function addPageUrl(): string {
    return `/reports/${report.id}/staff/add/manual`
  }

  function detailsPageUrl(): string {
    return `/reports/${report.id}/staff/add/manual/details`
  }

  it('should 404 if report is not found', () => {
    const error = mockThrownError(mockErrorResponse({ status: 404, message: 'Report not found' }), 404)
    incidentReportingApi.getReportWithDetailsById.mockRejectedValueOnce(error)

    return agent
      .get(addPageUrl())
      .expect(404)
      .expect(res => {
        expect(res.text).toContain('Page not found')
      })
  })

  describe('Step 1: specifying name', () => {
    it.each([
      {
        scenario: 'first name is missing',
        invalidPayload: { lastName: 'Smith' },
        expectedError: 'This field is required',
      },
      {
        scenario: 'surname is missing',
        invalidPayload: { firstName: 'John' },
        expectedError: 'This field is required',
      },
    ])('should show an error when $scenario', ({ invalidPayload, expectedError }) => {
      incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(report)
      incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(report) // due to redirect

      return agent
        .post(addPageUrl())
        .send(invalidPayload)
        .redirects(1)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('There is a problem')
          expect(res.text).toContain(expectedError)
        })
    })

    it('should proceed to next step when a full name is entered', () => {
      incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(report)
      incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(report) // due to redirect

      return agent
        .post(addPageUrl())
        .send({
          firstName: 'John',
          lastName: 'Smith',
        })
        .redirects(1)
        .expect(200)
        .expect(res => {
          expect(res.text).not.toContain('There is a problem')
          expect(res.redirects[0]).toMatch(detailsPageUrl())
        })
    })
  })

  describe('Step 2: providing involvement details', () => {
    beforeEach(async () => {
      // complete step 1
      incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(report)
      incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(report) // due to redirect
      await agent.post(addPageUrl()).send({
        firstName: 'John',
        lastName: 'Smith',
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
          staffUsername: null,
          firstName: 'John',
          lastName: 'Smith',
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
          staffUsername: null,
          firstName: 'John',
          lastName: 'Smith',
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

      return agent
        .post(detailsPageUrl())
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
        expectedError: 'Choose the staff member’s role',
      },
      {
        scenario: 'role is invalid',
        invalidPayload: {
          staffRole: 'INVALID',
          comment: 'See duty log',
        },
        expectedError: 'Choose the staff member’s role',
      },
    ])('should show an error when $scenario', ({ invalidPayload, expectedError }) => {
      incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(report)

      return agent
        .post(detailsPageUrl())
        .send(invalidPayload)
        .redirects(1)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('There is a problem')
          expect(res.text).toContain(expectedError)

          expect(incidentReportingRelatedObjects.addToReport).not.toHaveBeenCalled()
        })
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
      incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(report)

      const testRequest = request(appWithAllRoutes({ userSupplier: () => user }))
        .get(addPageUrl())
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
