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
import { OffenderSearchApi } from '../../../../data/offenderSearchApi'
import { mockErrorResponse, mockReport } from '../../../../data/testData/incidentReporting'
import { andrew } from '../../../../data/testData/offenderSearch'
import { mockThrownError } from '../../../../data/testData/thrownErrors'
import { approverUser, hqUser, reportingUser, unauthorisedUser } from '../../../../data/testData/users'
import { appWithAllRoutes } from '../../../testutils/appSetup'
import { now } from '../../../../testutils/fakeClock'
import type { Values } from './fields'

jest.mock('../../../../data/incidentReportingApi')
jest.mock('../../../../data/offenderSearchApi')

let app: Express
let incidentReportingApi: jest.Mocked<IncidentReportingApi>
let incidentReportingRelatedObjects: jest.Mocked<
  RelatedObjects<PrisonerInvolvement, AddPrisonerInvolvementRequest, UpdatePrisonerInvolvementRequest>
>
let offenderSearchApi: jest.Mocked<OffenderSearchApi>

beforeEach(() => {
  app = appWithAllRoutes()

  incidentReportingApi = IncidentReportingApi.prototype as jest.Mocked<IncidentReportingApi>
  incidentReportingRelatedObjects = RelatedObjects.prototype as jest.Mocked<
    RelatedObjects<PrisonerInvolvement, AddPrisonerInvolvementRequest, UpdatePrisonerInvolvementRequest>
  >

  offenderSearchApi = OffenderSearchApi.prototype as jest.Mocked<OffenderSearchApi>
  offenderSearchApi.getPrisoner.mockResolvedValueOnce(andrew)
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Adding a new prisoner to a report', () => {
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
    report.prisonersInvolved = []
    incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(report)
  })

  function addPageUrl(prisonerNumber: string): string {
    return `/reports/${report.id}/prisoners/add/${prisonerNumber}`
  }

  it('should 404 if report is not found', () => {
    const error = mockThrownError(mockErrorResponse({ status: 404, message: 'Report not found' }), 404)
    incidentReportingApi.getReportWithDetailsById.mockReset()
    incidentReportingApi.getReportWithDetailsById.mockRejectedValueOnce(error)

    return request(app)
      .get(addPageUrl(andrew.prisonerNumber))
      .expect(404)
      .expect(res => {
        expect(res.text).toContain('Page not found')

        expect(offenderSearchApi.getPrisoner).not.toHaveBeenCalledWith(andrew.prisonerNumber)
      })
  })

  it('should 404 if prisoner is not found', () => {
    const error = mockThrownError(mockErrorResponse({ status: 404, message: 'Prisoner not found' }), 404)
    offenderSearchApi.getPrisoner.mockReset()
    offenderSearchApi.getPrisoner.mockRejectedValueOnce(error)

    return request(app)
      .get(addPageUrl(andrew.prisonerNumber))
      .expect(404)
      .expect(res => {
        expect(res.text).toContain('Page not found')

        expect(offenderSearchApi.getPrisoner).toHaveBeenCalledWith(andrew.prisonerNumber)
      })
  })

  describe.each([
    { scenario: 'created on DPS', createdInNomis: false },
    { scenario: 'created in NOMIS', createdInNomis: true },
  ])('$scenario', ({ createdInNomis }) => {
    beforeEach(() => {
      report.createdInNomis = createdInNomis
    })

    it('should display a form to describe prisoner involvement details', () => {
      return request(app)
        .get(addPageUrl(andrew.prisonerNumber))
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

          // available roles depend on type
          expect(res.text).toContain('Impeded staff')
          expect(res.text).not.toContain('Active involvement')

          expect(incidentReportingRelatedObjects.addToReport).not.toHaveBeenCalled()
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
              prisonerNumber: 'A1111AA',
              firstName: 'ANDREW',
              lastName: 'ARNOLD',
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
              prisonerNumber: 'A1111AA',
              firstName: 'ANDREW',
              lastName: 'ARNOLD',
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
              prisonerNumber: 'A1111AA',
              firstName: 'ANDREW',
              lastName: 'ARNOLD',
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
              prisonerNumber: 'A1111AA',
              firstName: 'ANDREW',
              lastName: 'ARNOLD',
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
              prisonerNumber: 'A1111AA',
              firstName: 'ANDREW',
              lastName: 'ARNOLD',
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
              prisonerNumber: 'A1111AA',
              firstName: 'ANDREW',
              lastName: 'ARNOLD',
              prisonerRole: 'SUSPECTED_INVOLVED',
              outcome: null,
              comment: '',
            },
          },
        ]
    it.each(validScenarios)(
      'should send add $scenario to API if form is valid and go to summary page',
      ({ validPayload, expectedCall }) => {
        incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(report)
        incidentReportingRelatedObjects.addToReport.mockResolvedValueOnce([]) // NB: response is ignored
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore need to mock a getter method
        incidentReportingApi.prisonersInvolved = incidentReportingRelatedObjects
        offenderSearchApi.getPrisoner.mockResolvedValueOnce(andrew)

        return request(app)
          .post(addPageUrl(andrew.prisonerNumber))
          .send(validPayload)
          .redirects(1)
          .expect(200)
          .expect(res => {
            expect(res.text).not.toContain('There is a problem')
            expect(res.redirects[0]).toMatch(`/reports/${report.id}/prisoners`)

            expect(incidentReportingRelatedObjects.addToReport).toHaveBeenCalledWith(report.id, expectedCall)
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
      offenderSearchApi.getPrisoner.mockResolvedValueOnce(andrew)

      return request
        .agent(app)
        .post(addPageUrl(andrew.prisonerNumber))
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
      const testRequest = request(appWithAllRoutes({ userSupplier: () => user }))
        .get(addPageUrl(andrew.prisonerNumber))
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
