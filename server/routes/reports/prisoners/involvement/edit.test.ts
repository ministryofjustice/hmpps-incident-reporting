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
import { convertReportDates } from '../../../../data/incidentReportingApiUtils'
import { PrisonApi } from '../../../../data/prisonApi'
import { mockErrorResponse, mockReport } from '../../../../data/testData/incidentReporting'
import { andrew, barry } from '../../../../data/testData/offenderSearch'
import { moorland } from '../../../../data/testData/prisonApi'
import { mockThrownError } from '../../../../data/testData/thrownErrors'
import {
  mockDataWarden,
  mockReportingOfficer,
  mockHqViewer,
  mockUnauthorisedUser,
} from '../../../../data/testData/users'
import { appWithAllRoutes } from '../../../testutils/appSetup'
import { mockHandleReportEdit } from '../../../testutils/handleReportEdit'
import { now } from '../../../../testutils/fakeClock'
import type { Values } from './fields'

jest.mock('../../../../data/incidentReportingApi')
jest.mock('../../../../data/prisonApi')
jest.mock('../../actions/handleReportEdit')

const incidentReportingApi = IncidentReportingApi.prototype as jest.Mocked<IncidentReportingApi>
const incidentReportingRelatedObjects = RelatedObjects.prototype as jest.Mocked<
  RelatedObjects<PrisonerInvolvement, AddPrisonerInvolvementRequest, UpdatePrisonerInvolvementRequest>
>
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore need to mock a getter method
incidentReportingApi.prisonersInvolved = incidentReportingRelatedObjects
const prisonApi = PrisonApi.prototype as jest.Mocked<PrisonApi>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes()

  mockHandleReportEdit.withoutSideEffect()
  prisonApi.getPrison.mockResolvedValueOnce(moorland)
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Editing an existing prisoner in a report', () => {
  let report: ReportWithDetails

  beforeEach(() => {
    report = convertReportDates(
      mockReport({
        type: 'FIND_6',
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

  it('should 404 if prisoner involvement is invalid', () => {
    return request(app)
      .get(editPageUrl(0))
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

          // available roles depend on type
          expect(res.text).toContain('Impeded staff')
          expect(res.text).not.toContain('Active involvement')

          // prefilled with existing involvement
          expect(res.text).toContain('value="IMPEDED_STAFF" checked')
          if (createdInNomis) {
            expect(res.text).toContain('value="LOCAL_INVESTIGATION" checked')
          } else {
            expect(res.text).not.toContain('LOCAL_INVESTIGATION')
          }
          expect(res.text).toContain('Some comments')

          expect(incidentReportingRelatedObjects.updateForReport).not.toHaveBeenCalled()
          mockHandleReportEdit.expectNotCalled()
        })
    })

    describe('roles that are only allowed once', () => {
      beforeEach(() => {
        report.type = 'ESCAPE_FROM_PRISON_1'
      })

      it('should be hidden if already used in a different involvement', () => {
        report.prisonersInvolved.push({
          prisonerNumber: barry.prisonerNumber,
          firstName: barry.firstName,
          lastName: barry.lastName,
          prisonerRole: 'ESCAPE',
          outcome: 'POLICE_INVESTIGATION',
          comment: 'Matter being handled by police',
        })

        return request(app)
          .get(editPageUrl(1))
          .expect(200)
          .expect(res => {
            expect(res.text).not.toContain('Escapee')
          })
      })

      it('should not be hidden if used only in this involvement', () => {
        report.prisonersInvolved[0].prisonerRole = 'ESCAPE'

        return request(app)
          .get(editPageUrl(1))
          .expect(200)
          .expect(res => {
            expect(res.text).toContain('Escapee')
          })
      })

      it('should not be hidden if not used yet', () => {
        return request(app)
          .get(editPageUrl(1))
          .expect(200)
          .expect(res => {
            expect(res.text).toContain('Escapee')
          })
      })
    })

    it('should show an error on the summary page if no roles are available', () => {
      report.type = 'ABSCOND_1'
      report.prisonersInvolved.unshift({
        prisonerNumber: barry.prisonerNumber,
        firstName: barry.firstName,
        lastName: barry.lastName,
        prisonerRole: 'ABSCONDER',
        outcome: 'POLICE_INVESTIGATION',
        comment: 'Matter being handled by police',
      })
      incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(report)

      return request
        .agent(app)
        .get(editPageUrl(2))
        .redirects(1)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('app-prisoner-summary')
          expect(res.text).toContain('No more prisoner roles can be added')
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
        incidentReportingApi.updateReport.mockResolvedValueOnce(report) // NB: response is ignored

        return request(app)
          .post(editPageUrl(1))
          .send(validPayload)
          .redirects(1)
          .expect(200)
          .expect(res => {
            expect(res.text).not.toContain('There is a problem')
            expect(res.redirects[0]).toMatch(`/reports/${report.id}/prisoners`)

            expect(incidentReportingRelatedObjects.updateForReport).toHaveBeenCalledWith(report.id, 1, expectedCall)
            mockHandleReportEdit.expectCalled()
            expect(incidentReportingApi.updateReport).toHaveBeenCalledWith(report.id, {
              title: expect.any(String),
            })
          })
      },
    )

    it('should allow exiting to report view when saving', () => {
      incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(report)
      incidentReportingRelatedObjects.updateForReport.mockResolvedValueOnce([]) // NB: response is ignored
      incidentReportingApi.updateReport.mockResolvedValueOnce(report) // NB: response is ignored

      return request(app)
        .post(editPageUrl(1))
        .send({
          ...validScenarios[0].validPayload,
          formAction: 'exit',
        })
        .expect(302)
        .expect(res => {
          expect(res.redirect).toBe(true)
          expect(res.header.location).toEqual(`/reports/${report.id}`)

          expect(incidentReportingRelatedObjects.updateForReport).toHaveBeenCalledWith(report.id, 1, {
            ...validScenarios[0].expectedCall,
          })
          mockHandleReportEdit.expectCalled()
          expect(incidentReportingApi.updateReport).toHaveBeenCalledWith(report.id, {
            title: expect.any(String),
          })
        })
    })

    interface InvalidScenario {
      scenario: string
      invalidPayload: object
      expectedError: string
    }
    const invalidScenarios: InvalidScenario[] = createdInNomis
      ? [
          {
            scenario: 'role is absent',
            invalidPayload: {
              prisonerRole: '',
              outcome: 'LOCAL_INVESTIGATION',
              comment: 'See case notes',
            },
            expectedError: 'Select the prisoner’s role in the incident',
          },
          {
            scenario: 'role is invalid',
            invalidPayload: {
              prisonerRole: 'INVALID',
              outcome: 'LOCAL_INVESTIGATION',
              comment: 'See case notes',
            },
            expectedError: 'Select the prisoner’s role in the incident',
          },
          {
            scenario: 'outcome is invalid',
            invalidPayload: {
              prisonerRole: 'SUSPECTED_INVOLVED',
              outcome: 'INVALID',
              comment: 'See case notes',
            },
            expectedError: 'Select an outcome for the incident',
          },
        ]
      : [
          {
            scenario: 'role is absent',
            invalidPayload: {
              prisonerRole: '',
              comment: 'See case notes',
            },
            expectedError: 'Select the prisoner’s role in the incident',
          },
          {
            scenario: 'role is invalid',
            invalidPayload: {
              prisonerRole: 'INVALID',
              comment: 'See case notes',
            },
            expectedError: 'Select the prisoner’s role in the incident',
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
          mockHandleReportEdit.expectNotCalled()
          expect(incidentReportingApi.updateReport).not.toHaveBeenCalled()
        })
    })

    it('should show an error if API rejects editing involvement', () => {
      incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(report)
      const error = mockThrownError(mockErrorResponse({ message: 'Comment is too short' }))
      incidentReportingRelatedObjects.updateForReport.mockRejectedValueOnce(error)

      return request
        .agent(app)
        .post(editPageUrl(1))
        .send(
          createdInNomis
            ? {
                prisonerRole: 'SUSPECTED_INVOLVED',
                outcome: 'LOCAL_INVESTIGATION',
                comment: 'See case notes',
              }
            : {
                prisonerRole: 'SUSPECTED_INVOLVED',
                comment: 'See case notes',
              },
        )
        .redirects(1)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('There is a problem')
          expect(res.text).toContain('Sorry, there was a problem with your request')
          expect(res.text).not.toContain('Bad Request')
          expect(res.text).not.toContain('Comment is too short')
          expect(incidentReportingApi.updateReport).not.toHaveBeenCalled()
        })
    })

    it('should show an error if API rejects (possible) status change', () => {
      incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(report)
      incidentReportingRelatedObjects.updateForReport.mockResolvedValueOnce([]) // NB: response is ignored
      mockHandleReportEdit.failure()
      incidentReportingApi.updateReport.mockResolvedValueOnce(report) // NB: response is ignored

      return request
        .agent(app)
        .post(editPageUrl(1))
        .send(
          createdInNomis
            ? {
                prisonerRole: 'SUSPECTED_INVOLVED',
                outcome: 'LOCAL_INVESTIGATION',
                comment: 'See case notes',
              }
            : {
                prisonerRole: 'SUSPECTED_INVOLVED',
                comment: 'See case notes',
              },
        )
        .redirects(1)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('There is a problem')
          expect(res.text).toContain('Sorry, there was a problem with your request')
          expect(incidentReportingApi.updateReport).not.toHaveBeenCalled()
        })
    })

    it('should not show an error if API rejects updating title', () => {
      incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(report)
      incidentReportingRelatedObjects.updateForReport.mockResolvedValueOnce([]) // NB: response is ignored
      const error = mockThrownError(mockErrorResponse({ message: 'Title is too long' }))
      incidentReportingApi.updateReport.mockRejectedValueOnce(error)

      return request
        .agent(app)
        .post(editPageUrl(1))
        .send(
          createdInNomis
            ? {
                prisonerRole: 'SUSPECTED_INVOLVED',
                outcome: 'LOCAL_INVESTIGATION',
                comment: 'See case notes',
              }
            : {
                prisonerRole: 'SUSPECTED_INVOLVED',
                comment: 'See case notes',
              },
        )
        .redirects(1)
        .expect(200)
        .expect(res => {
          expect(res.text).not.toContain('There is a problem')
          expect(res.text).not.toContain('Sorry, there was a problem with your request')
          expect(res.redirects[0]).toMatch(`/reports/${report.id}/prisoners`)

          expect(incidentReportingApi.updateReport).toHaveBeenCalledWith(report.id, {
            title: expect.any(String),
          })
        })
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
