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
import { mockErrorResponse, mockReport } from '../../../../data/testData/incidentReporting'
import { mockThrownError } from '../../../../data/testData/thrownErrors'
import { approverUser, hqUser, reportingUser, unauthorisedUser } from '../../../../data/testData/users'
import { appWithAllRoutes } from '../../../testutils/appSetup'
import { now } from '../../../../testutils/fakeClock'
import type { Values } from './fields'

jest.mock('../../../../data/incidentReportingApi')

let app: Express
let incidentReportingApi: jest.Mocked<IncidentReportingApi>
let incidentReportingRelatedObjects: jest.Mocked<
  RelatedObjects<StaffInvolvement, AddStaffInvolvementRequest, UpdateStaffInvolvementRequest>
>

beforeEach(() => {
  app = appWithAllRoutes()

  incidentReportingApi = IncidentReportingApi.prototype as jest.Mocked<IncidentReportingApi>
  incidentReportingRelatedObjects = RelatedObjects.prototype as jest.Mocked<
    RelatedObjects<StaffInvolvement, AddStaffInvolvementRequest, UpdateStaffInvolvementRequest>
  >
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Editing an existing staff member in a report', () => {
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
    report.staffInvolved = [
      {
        staffUsername: 'user1',
        firstName: 'JOHN',
        lastName: 'SMITH',
        staffRole: 'NEGOTIATOR',
        comment: 'See duty log',
      },
    ]
    incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(report)
  })

  function editPageUrl(index: number): string {
    return `/reports/${report.id}/staff/${index}`
  }

  it('should 404 if report is not found', () => {
    const error = mockThrownError(mockErrorResponse({ status: 404, message: 'Report not found' }), 404)
    incidentReportingApi.getReportWithDetailsById.mockReset()
    incidentReportingApi.getReportWithDetailsById.mockRejectedValueOnce(error)

    return request(app)
      .get(editPageUrl(1))
      .expect(404)
      .expect(res => {
        expect(res.text).toContain('Page not found')
      })
  })

  it('should 404 if staff involvement is invalid', () => {
    return request(app)
      .get(editPageUrl(0))
      .expect(404)
      .expect(res => {
        expect(res.text).toContain('Page not found')
      })
  })

  it('should 404 if staff involvement is not found', () => {
    report.staffInvolved = []

    return request(app)
      .get(editPageUrl(1))
      .expect(404)
      .expect(res => {
        expect(res.text).toContain('Page not found')
      })
  })

  it('should display a form to update staff involvement details', () => {
    return request(app)
      .get(editPageUrl(1))
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('How was John Smith involved in the incident?')
        expect(res.text).toContain('Details of John’s involvement')

        expect(res.text).toContain('value="NEGOTIATOR" checked')
        expect(res.text).toContain('See duty log')

        expect(incidentReportingRelatedObjects.updateForReport).not.toHaveBeenCalled()
      })
  })

  interface ValidScenario {
    scenario: string
    validPayload: Partial<Values>
    expectedCall: object
  }
  const validScenarios: ValidScenario[] = [
    {
      scenario: 'request with all fields',
      validPayload: {
        staffRole: 'NEGOTIATOR',
        comment: 'See duty log',
      },
      expectedCall: {
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
        staffRole: 'NEGOTIATOR',
        comment: '',
      },
    },
  ]
  it.each(validScenarios)(
    'should send update $scenario to API if form is valid and go to summary page',
    ({ validPayload, expectedCall }) => {
      incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(report)
      incidentReportingRelatedObjects.updateForReport.mockResolvedValueOnce([]) // NB: response is ignored
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore need to mock a getter method
      incidentReportingApi.staffInvolved = incidentReportingRelatedObjects

      return request(app)
        .post(editPageUrl(1))
        .send(validPayload)
        .redirects(1)
        .expect(200)
        .expect(res => {
          expect(res.text).not.toContain('There is a problem')
          expect(res.redirects[0]).toMatch(`/reports/${report.id}/staff`)

          expect(incidentReportingRelatedObjects.updateForReport).toHaveBeenCalledWith(report.id, 1, expectedCall)
        })
    },
  )

  it('should allow exiting to report view when saving', () => {
    incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(report)
    incidentReportingRelatedObjects.updateForReport.mockResolvedValueOnce([]) // NB: response is ignored
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore need to mock a getter method
    incidentReportingApi.staffInvolved = incidentReportingRelatedObjects

    return request(app)
      .post(editPageUrl(1))
      .send({
        ...validScenarios[0].validPayload,
        userAction: 'exit',
      })
      .expect(302)
      .expect(res => {
        expect(res.redirect).toBe(true)
        expect(res.header.location).toEqual(`/reports/${report.id}`)

        expect(incidentReportingRelatedObjects.updateForReport).toHaveBeenCalledWith(report.id, 1, {
          ...validScenarios[0].expectedCall,
        })
      })
  })

  it.each([
    {
      scenario: 'role is absent',
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

    return request
      .agent(app)
      .post(editPageUrl(1))
      .send(invalidPayload)
      .redirects(1)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('There is a problem')
        expect(res.text).toContain(expectedError)

        expect(incidentReportingRelatedObjects.updateForReport).not.toHaveBeenCalled()
      })
  })

  it('should show an error if API rejects request', () => {
    incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(report)
    const error = mockThrownError(mockErrorResponse({ message: 'Comment is too short' }))
    incidentReportingRelatedObjects.updateForReport.mockRejectedValueOnce(error)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore need to mock a getter method
    incidentReportingApi.staffInvolved = incidentReportingRelatedObjects

    return request
      .agent(app)
      .post(editPageUrl(1))
      .send({
        staffRole: 'NEGOTIATOR',
        comment: 'See duty log',
      })
      .redirects(1)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('There is a problem')
        expect(res.text).toContain('Sorry, there was a problem with your request')
        expect(res.text).not.toContain('Bad Request')
        expect(res.text).not.toContain('Comment is too short')
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
        .get(editPageUrl(1))
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
