import type { Express } from 'express'
import request from 'supertest'

import {
  IncidentReportingApi,
  RelatedObjects,
  type ReportWithDetails,
  type PrisonerInvolvement,
  type AddPrisonerInvolvementRequest,
  type UpdatePrisonerInvolvementRequest,
} from '../../../../data/incidentReportingApi'
import { convertReportWithDetailsDates } from '../../../../data/incidentReportingApiUtils'
import { mockErrorResponse, mockReport } from '../../../../data/testData/incidentReporting'
import { andrew } from '../../../../data/testData/offenderSearch'
import { mockThrownError } from '../../../../data/testData/thrownErrors'
import { approverUser, hqUser, reportingUser, unauthorisedUser } from '../../../../data/testData/users'
import { appWithAllRoutes } from '../../../testutils/appSetup'
import { now } from '../../../../testutils/fakeClock'
import type { Values } from './fields'

jest.mock('../../../../data/incidentReportingApi')

let app: Express
let incidentReportingApi: jest.Mocked<IncidentReportingApi>
let incidentReportingRelatedObjects: jest.Mocked<
  RelatedObjects<PrisonerInvolvement, AddPrisonerInvolvementRequest, UpdatePrisonerInvolvementRequest>
>

beforeEach(() => {
  app = appWithAllRoutes()

  incidentReportingApi = IncidentReportingApi.prototype as jest.Mocked<IncidentReportingApi>
  incidentReportingRelatedObjects = RelatedObjects.prototype as jest.Mocked<
    RelatedObjects<PrisonerInvolvement, AddPrisonerInvolvementRequest, UpdatePrisonerInvolvementRequest>
  >
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Editing an existing prisoner in a report', () => {
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
    report.prisonersInvolved = [
      {
        prisonerNumber: andrew.prisonerNumber,
        firstName: andrew.firstName,
        lastName: andrew.lastName,
        prisonerRole: 'IMPEDED_STAFF',
        outcome: 'LOCAL_INVESTIGATION',
        comment: 'Some comments',
      },
    ]
    incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(report)
  })

  function editPageUrl(index: number): string {
    return `/reports/${report.id}/prisoners/${index}`
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

  it('should 404 if prisoner involvement is not found', () => {
    report.prisonersInvolved = []

    return request(app)
      .get(editPageUrl(1))
      .expect(404)
      .expect(res => {
        expect(res.text).toContain('Page not found')
      })
  })

  describe.each([
    { scenario: 'created on DPS', createdInNomis: false },
    { scenario: 'created in NOMIS', createdInNomis: true },
  ])('$scenario', ({ createdInNomis }) => {
    beforeEach(() => {
      report.createdInNomis = createdInNomis
    })

    it('should display a form to update prisoner involvement details', () => {
      return request(app)
        .get(editPageUrl(1))
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Andrew Arnold’s involvement in the incident')
          expect(res.text).toContain('What was Andrew’s role?')
          if (createdInNomis) {
            expect(res.text).toContain('What was the outcome?')
          } else {
            expect(res.text).not.toContain('What was the outcome?')
          }
          expect(res.text).toContain('Details of Andrew’s involvement')

          expect(res.text).toContain('value="IMPEDED_STAFF" checked')
          if (createdInNomis) {
            expect(res.text).toContain('value="LOCAL_INVESTIGATION" checked')
          } else {
            expect(res.text).not.toContain('LOCAL_INVESTIGATION')
          }
          expect(res.text).toContain('Some comments')

          expect(incidentReportingRelatedObjects.updateForReport).not.toHaveBeenCalled()
        })
    })

    interface ValidScenario {
      scenario: string
      validPayload: Partial<Values>
      expectedCall: object
    }
    const validScenarios: ValidScenario[] = createdInNomis
      ? [
          {
            scenario: 'request with all fields',
            validPayload: {
              prisonerRole: 'SUSPECTED_INVOLVED',
              outcome: 'LOCAL_INVESTIGATION',
              comment: 'See case notes',
            },
            expectedCall: {
              prisonerRole: 'SUSPECTED_INVOLVED',
              outcome: 'LOCAL_INVESTIGATION',
              comment: 'See case notes',
            },
          },
          {
            scenario: 'request without outcome',
            validPayload: {
              prisonerRole: 'SUSPECTED_INVOLVED',
              outcome: '',
              comment: 'See case notes',
            },
            expectedCall: {
              prisonerRole: 'SUSPECTED_INVOLVED',
              outcome: null,
              comment: 'See case notes',
            },
          },
          {
            scenario: 'request without comment',
            validPayload: {
              prisonerRole: 'SUSPECTED_INVOLVED',
              outcome: 'LOCAL_INVESTIGATION',
              comment: '',
            },
            expectedCall: {
              prisonerRole: 'SUSPECTED_INVOLVED',
              outcome: 'LOCAL_INVESTIGATION',
              comment: '',
            },
          },
          {
            scenario: 'request without outcome or comment',
            validPayload: {
              prisonerRole: 'SUSPECTED_INVOLVED',
            },
            expectedCall: {
              prisonerRole: 'SUSPECTED_INVOLVED',
              outcome: null,
              comment: '',
            },
          },
        ]
      : [
          {
            scenario: 'request with all fields',
            validPayload: {
              prisonerRole: 'SUSPECTED_INVOLVED',
              comment: 'See case notes',
            },
            expectedCall: {
              prisonerRole: 'SUSPECTED_INVOLVED',
              outcome: null,
              comment: 'See case notes',
            },
          },
          {
            scenario: 'request without comment',
            validPayload: {
              prisonerRole: 'SUSPECTED_INVOLVED',
              comment: '',
            },
            expectedCall: {
              prisonerRole: 'SUSPECTED_INVOLVED',
              outcome: null,
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
        incidentReportingApi.prisonersInvolved = incidentReportingRelatedObjects

        return request(app)
          .post(editPageUrl(1))
          .send(validPayload)
          .redirects(1)
          .expect(200)
          .expect(res => {
            expect(res.text).not.toContain('There is a problem')
            expect(res.redirects[0]).toMatch(`/reports/${report.id}/prisoners`)

            expect(incidentReportingRelatedObjects.updateForReport).toHaveBeenCalledWith(report.id, 1, expectedCall)
          })
      },
    )

    interface InvalidScenario {
      scenario: string
      invalidPayload: object
      expectedError: string
    }
    const invalidScenarios: InvalidScenario[] = createdInNomis
      ? [
          {
            scenario: 'required role is absent',
            invalidPayload: {
              prisonerRole: '',
              outcome: 'LOCAL_INVESTIGATION',
              comment: 'See case notes',
            },
            expectedError: 'Choose the prisoner’s role',
          },
          {
            scenario: 'role is invalid',
            invalidPayload: {
              prisonerRole: 'INVALID',
              outcome: 'LOCAL_INVESTIGATION',
              comment: 'See case notes',
            },
            expectedError: 'Choose the prisoner’s role',
          },
          {
            scenario: 'outcome is invalid',
            invalidPayload: {
              prisonerRole: 'SUSPECTED_INVOLVED',
              outcome: 'INVALID',
              comment: 'See case notes',
            },
            expectedError: 'Choose the outcome of the prisoner’s involvement',
          },
        ]
      : [
          {
            scenario: 'required role is absent',
            invalidPayload: {
              prisonerRole: '',
              comment: 'See case notes',
            },
            expectedError: 'Choose the prisoner’s role',
          },
          {
            scenario: 'role is invalid',
            invalidPayload: {
              prisonerRole: 'INVALID',
              comment: 'See case notes',
            },
            expectedError: 'Choose the prisoner’s role',
          },
        ]
    it.each(invalidScenarios)('should show an error when $scenario', ({ invalidPayload, expectedError }) => {
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
