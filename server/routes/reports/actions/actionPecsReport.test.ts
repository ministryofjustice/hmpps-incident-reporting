import type { Express } from 'express'
import request from 'supertest'

import { PrisonApi } from '../../../data/prisonApi'
import { appWithAllRoutes } from '../../testutils/appSetup'
import { now } from '../../../testutils/fakeClock'
import UserService from '../../../services/userService'
import { type Status, statuses } from '../../../reportConfiguration/constants'
import { type UserAction, userActions } from '../../../middleware/permissions'
import {
  IncidentReportingApi,
  RelatedObjects,
  type ReportWithDetails,
  type CorrectionRequest,
  type AddCorrectionRequestRequest,
  type UpdateCorrectionRequestRequest,
} from '../../../data/incidentReportingApi'
import { convertReportDates } from '../../../data/incidentReportingApiUtils'
import * as reportValidity from '../../../data/reportValidity'
import { mockErrorResponse, mockReport } from '../../../data/testData/incidentReporting'
import { mockSharedUser } from '../../../data/testData/manageUsers'
import { mockPecsRegions } from '../../../data/testData/pecsRegions'
import { pecsNorth, pecsSouth } from '../../../data/testData/prisonApi'
import { mockThrownError } from '../../../data/testData/thrownErrors'
import { mockDataWarden, mockReportingOfficer, mockHqViewer, mockUnauthorisedUser } from '../../../data/testData/users'
import * as correctionRequestPlaceholder from './correctionRequestPlaceholder'
import { rolePecs } from '../../../data/constants'

jest.mock('../../../data/incidentReportingApi')
jest.mock('../../../data/prisonApi')
jest.mock('../../../data/reportValidity')
jest.mock('../../../services/userService')
jest.mock('./correctionRequestPlaceholder')

const incidentReportingApi = IncidentReportingApi.prototype as jest.Mocked<IncidentReportingApi>
const incidentReportingRelatedObjects = RelatedObjects.prototype as jest.Mocked<
  RelatedObjects<CorrectionRequest, AddCorrectionRequestRequest, UpdateCorrectionRequestRequest>
>
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore need to mock a getter method
incidentReportingApi.correctionRequests = incidentReportingRelatedObjects
const userService = UserService.prototype as jest.Mocked<UserService>
const prisonApi = PrisonApi.prototype as jest.Mocked<PrisonApi>

const { validateReport } = reportValidity as jest.Mocked<typeof import('../../../data/reportValidity')>
const { placeholderForCorrectionRequest } = correctionRequestPlaceholder as jest.Mocked<
  typeof import('./correctionRequestPlaceholder')
>

beforeAll(() => {
  mockPecsRegions()
})

const mockReportingOfficerWithPecsRole = { ...mockReportingOfficer, roles: [...mockReportingOfficer.roles, rolePecs] }
const mockHqViewerWithPecsRole = { ...mockHqViewer, roles: [...mockHqViewer.roles, rolePecs] }

beforeEach(() => {
  userService.getUsers.mockResolvedValueOnce({
    [mockSharedUser.username]: mockSharedUser,
  })

  prisonApi.getPrison.mockImplementation(locationCode =>
    Promise.resolve(
      {
        NORTH: pecsNorth,
        SOUTH: pecsSouth,
      }[locationCode],
    ),
  )

  placeholderForCorrectionRequest.mockReturnValue('PLACEHOLDER')
})

afterEach(() => {
  jest.resetAllMocks()
})

let app: Express

function setupAppForUser(user: Express.User): void {
  app = appWithAllRoutes({ services: { userService }, userSupplier: () => user })
}

function makeReportValid() {
  validateReport.mockReset()
  validateReport.mockImplementationOnce(function* generator() {
    /* empty */
  })
}

function makeReportInvalid() {
  validateReport.mockReset()
  validateReport.mockImplementationOnce(function* generator() {
    yield { text: 'Fill in missing details', href: '#' }
  })
}

describe('Actioning PECS reports', () => {
  let mockedReport: ReportWithDetails
  let viewReportUrl: string

  beforeEach(() => {
    mockedReport = convertReportDates(
      mockReport({
        reportReference: '6543',
        reportDateAndTime: now,
        location: 'NORTH',
        type: 'ASSAULT_5',
        withDetails: true,
      }),
    )
    incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(mockedReport)
    viewReportUrl = `/reports/${mockedReport.id}`
  })

  describe('Action options', () => {
    beforeEach(() => {
      makeReportValid()
    })

    describe('when viewed by data wardens', () => {
      beforeEach(() => {
        setupAppForUser(mockDataWarden)
      })

      interface OptionsScenario {
        reportStatus: Status
        formOptions: string[]
      }
      const optionsScenarios: OptionsScenario[] = [
        {
          reportStatus: 'DRAFT',
          formOptions: ['Close'],
        },
        {
          reportStatus: 'REOPENED',
          formOptions: [
            'Close',
            'Mark as a duplicate',
            'Enter incident report number of the original report',
            'Describe why it is a duplicate report (optional)',
            'Mark as not reportable',
            'Describe why it is not reportable',
          ],
        },
        {
          reportStatus: 'CLOSED',
          formOptions: ['Reopen and change report'],
        },
        {
          reportStatus: 'DUPLICATE',
          formOptions: ['Reopen and change report'],
        },
        {
          reportStatus: 'NOT_REPORTABLE',
          formOptions: ['Reopen and change report'],
        },
      ]
      it.each(optionsScenarios)(
        'should show options when viewing reports with status $reportStatus',
        ({ reportStatus, formOptions }) => {
          mockedReport.status = reportStatus

          return request(app)
            .get(viewReportUrl)
            .expect(200)
            .expect(res => {
              expect(res.text).toContain('app-view-report__user-action-form')
              formOptions.forEach(option => expect(res.text).toContain(option))
            })
        },
      )

      it.each(['DRAFT', 'REOPENED'] as const)(
        'should still show CLOSE option if a DPS report with status %s is invalid',
        status => {
          makeReportInvalid()
          mockedReport.status = status

          return request(app)
            .get(viewReportUrl)
            .expect(200)
            .expect(res => {
              expect(res.text).toContain('app-view-report__user-action-form')
              expect(res.text).toContain('Close')
            })
        },
      )

      it.each(['DRAFT', 'REOPENED'] as const)(
        'should still show CLOSE option if a NOMIS report with status %s is invalid',
        status => {
          makeReportInvalid()
          mockedReport.status = status
          mockedReport.createdInNomis = true
          mockedReport.lastModifiedInNomis = true

          return request(app)
            .get(viewReportUrl)
            .expect(200)
            .expect(res => {
              expect(res.text).toContain('app-view-report__user-action-form')
              expect(res.text).toContain('Close')
            })
        },
      )
    })

    describe.each([
      { userType: 'reporting officers', user: mockReportingOfficerWithPecsRole },
      { userType: 'HQ viewers', user: mockHqViewerWithPecsRole },
    ])('when viewed by $userType', ({ user }) => {
      it.each(statuses)('should not show any options when report has status $code', ({ code: status }) => {
        setupAppForUser(user)
        mockedReport.status = status

        return request(app)
          .get(viewReportUrl)
          .expect(200)
          .expect(res => {
            expect(res.text).not.toContain('app-view-report__user-action-form')
            expect(res.text).not.toContain('Continue')
            expect(res.text).not.toContain('Submit')
            expect(res.text).not.toContain('Resubmit')
            expect(res.text).not.toContain('Request to remove report')
            expect(res.text).not.toMatch(/Close[^d]/)
            expect(res.text).not.toContain('Send back')
            expect(res.text).not.toContain('Put on hold')
            expect(res.text).not.toContain('Mark as a duplicate')
            expect(res.text).not.toContain('Mark as not reportable')
          })
      })
    })
  })

  describe('Submitting actions', () => {
    interface ForbiddenTransitionScenario {
      userType: string
      user: Express.User
      forbiddenTransitions:
        | 'all'
        | {
            userAction: UserAction
            forbiddenStatuses: 'all' | Status[]
          }[]
    }
    const forbiddenTransitionScenarios: ForbiddenTransitionScenario[] = [
      {
        userType: 'data wardens',
        user: mockDataWarden,
        forbiddenTransitions: [
          {
            userAction: 'CLOSE',
            forbiddenStatuses: [
              'NEEDS_UPDATING',
              'AWAITING_REVIEW',
              'UPDATED',
              'ON_HOLD',
              'WAS_CLOSED',
              'CLOSED',
              'DUPLICATE',
              'NOT_REPORTABLE',
            ],
          },
          {
            userAction: 'MARK_DUPLICATE',
            forbiddenStatuses: [
              'DRAFT',
              'NEEDS_UPDATING',
              'AWAITING_REVIEW',
              'UPDATED',
              'ON_HOLD',
              'WAS_CLOSED',
              'CLOSED',
              'DUPLICATE',
              'NOT_REPORTABLE',
            ],
          },
          {
            userAction: 'MARK_NOT_REPORTABLE',
            forbiddenStatuses: [
              'DRAFT',
              'NEEDS_UPDATING',
              'AWAITING_REVIEW',
              'UPDATED',
              'ON_HOLD',
              'WAS_CLOSED',
              'CLOSED',
              'DUPLICATE',
              'NOT_REPORTABLE',
            ],
          },
          {
            userAction: 'RECALL',
            forbiddenStatuses: [
              'DRAFT',
              'NEEDS_UPDATING',
              'REOPENED',
              'AWAITING_REVIEW',
              'UPDATED',
              'ON_HOLD',
              'WAS_CLOSED',
            ],
          },
          { userAction: 'REQUEST_REVIEW', forbiddenStatuses: 'all' },
          { userAction: 'REQUEST_REMOVAL', forbiddenStatuses: 'all' },
          { userAction: 'REQUEST_CORRECTION', forbiddenStatuses: 'all' },
          { userAction: 'HOLD', forbiddenStatuses: 'all' },
        ],
      },
      { userType: 'reporting officers', user: mockReportingOfficerWithPecsRole, forbiddenTransitions: 'all' },
      { userType: 'HQ viewers', user: mockHqViewerWithPecsRole, forbiddenTransitions: 'all' },
    ]
    describe.each(forbiddenTransitionScenarios)('when $userType', ({ userType, user, forbiddenTransitions }) => {
      beforeEach(() => {
        setupAppForUser(user)
        makeReportInvalid()
      })

      function expectNotAllowedErrorMessages(status: Status, payload: object): request.Test {
        mockedReport.status = status
        incidentReportingRelatedObjects.addToReport.mockRejectedValueOnce(new Error('should not be called'))
        incidentReportingApi.changeReportStatus.mockRejectedValueOnce(new Error('should not be called'))

        return request(app)
          .post(viewReportUrl)
          .send(payload)
          .expect(200)
          .expect(res => {
            expect(res.text).toContain('There is a problem')
            const noActionsPermitted =
              userType === 'reporting officers' ||
              userType === 'HQ viewers' ||
              ['NEEDS_UPDATING', 'AWAITING_REVIEW', 'UPDATED', 'ON_HOLD', 'WAS_CLOSED'].includes(status)
            if (noActionsPermitted) {
              expect(res.text).toContain('You do not have permission to action this report')
            } else {
              expect(res.text).toContain('Select what you want to do with this report')
            }
            expect(res.text).not.toContain('Enter a valid incident report number')
            expect(res.text).not.toContain('Describe why incident is not reportable')
            expect(res.text).not.toContain('Enter what has changed in the report')
            expect(res.text).not.toContain('Please enter a comment')
            expect(res.text).not.toContain('Fill in missing details') // report validity should not be checked
            expect(incidentReportingRelatedObjects.addToReport).not.toHaveBeenCalled()
            expect(incidentReportingApi.changeReportStatus).not.toHaveBeenCalled()
          })
      }

      describe('try to submit a form without choosing an option', () => {
        it.each(statuses.map(status => status.code))('should not be allowed for a report with status %s', status =>
          expectNotAllowedErrorMessages(status, {}),
        )
      })

      describe.each(
        forbiddenTransitions === 'all'
          ? userActions
              .filter(({ code: userAction }) => !['VIEW', 'EDIT'].includes(userAction))
              .map(({ code: userAction }) => ({ userAction, forbiddenStatuses: 'all' as const }))
          : forbiddenTransitions,
      )('try to perform $userAction', ({ userAction, forbiddenStatuses }) => {
        it.each(forbiddenStatuses === 'all' ? statuses.map(status => status.code) : forbiddenStatuses)(
          'should not be allowed for a report with status %s',
          status => expectNotAllowedErrorMessages(status, { userAction }),
        )
      })
    })

    const actionsRequiringValidReports = ['CLOSE']

    interface TransitionScenarios {
      currentStatus: Status
      userAction: UserAction
      comment: 'not allowed' | 'optional'
      needsOriginalReportReference?: boolean
      postsCorrectionRequest?: AddCorrectionRequestRequest
      updatesTitle?: boolean
      newStatus: Status
      redirectedPage: 'dashboard' | 'view-report'
    }
    const transitionScenarios: TransitionScenarios[] = [
      {
        currentStatus: 'DRAFT',
        userAction: 'CLOSE',
        comment: 'not allowed',
        newStatus: 'CLOSED',
        redirectedPage: 'dashboard',
      },
      {
        currentStatus: 'REOPENED',
        userAction: 'CLOSE',
        comment: 'not allowed',
        newStatus: 'CLOSED',
        redirectedPage: 'dashboard',
      },
      {
        currentStatus: 'CLOSED',
        userAction: 'RECALL',
        comment: 'not allowed',
        newStatus: 'REOPENED',
        redirectedPage: 'view-report',
      },
      {
        currentStatus: 'DUPLICATE',
        userAction: 'RECALL',
        comment: 'not allowed',
        newStatus: 'REOPENED',
        redirectedPage: 'view-report',
      },
      {
        currentStatus: 'NOT_REPORTABLE',
        userAction: 'RECALL',
        comment: 'not allowed',
        newStatus: 'REOPENED',
        redirectedPage: 'view-report',
      },
      {
        currentStatus: 'REOPENED',
        userAction: 'MARK_NOT_REPORTABLE',
        comment: 'optional',
        postsCorrectionRequest: {
          userType: 'DATA_WARDEN',
          userAction: 'MARK_NOT_REPORTABLE',
          descriptionOfChange: 'My comment on this action',
        },
        newStatus: 'NOT_REPORTABLE',
        redirectedPage: 'dashboard',
      },
      {
        currentStatus: 'REOPENED',
        userAction: 'MARK_DUPLICATE',
        comment: 'optional',
        needsOriginalReportReference: true,
        postsCorrectionRequest: {
          userType: 'DATA_WARDEN',
          userAction: 'MARK_DUPLICATE',
          descriptionOfChange: 'My comment on this action',
          originalReportReference: '1234',
        },
        newStatus: 'DUPLICATE',
        redirectedPage: 'dashboard',
      },
    ]
    describe.each(transitionScenarios)(
      'when data wardens try to perform $userAction on report with status $currentStatus when a comment is $comment',
      ({
        currentStatus,
        userAction,
        comment,
        needsOriginalReportReference,
        postsCorrectionRequest,
        updatesTitle,
        newStatus,
        redirectedPage,
      }) => {
        type Payload = {
          userAction: UserAction
          originalReportReference?: string
        } & {
          [C in `${UserAction}_COMMENT`]?: string
        }

        const validPayload: Payload = { userAction }
        if (comment !== 'not allowed') {
          validPayload[`${userAction}_COMMENT`] = 'My comment on this action'
        }
        if (needsOriginalReportReference) {
          validPayload.originalReportReference = '1234'
        }

        let expectedRedirect: string

        beforeEach(() => {
          setupAppForUser(mockDataWarden)
          mockedReport.status = currentStatus
          expectedRedirect = redirectedPage === 'dashboard' ? '/reports' : `/reports/${mockedReport.id}`
          incidentReportingApi.getReportByReference.mockRejectedValueOnce(new Error('should not be called'))
        })

        const mockedOriginalReport = convertReportDates(mockReport({ reportReference: '1234', reportDateAndTime: now }))
        function makeOriginalReportReferenceExistIfNeeded() {
          if (needsOriginalReportReference) {
            incidentReportingApi.getReportByReference.mockReset()
            incidentReportingApi.getReportByReference.mockResolvedValueOnce(mockedOriginalReport)
          }
        }

        it(`should succeed changing the status to ${newStatus} if the report is valid`, () => {
          makeReportValid()
          makeOriginalReportReferenceExistIfNeeded()
          if (updatesTitle) {
            incidentReportingApi.updateReport.mockResolvedValueOnce(mockedReport) // NB: response is ignored
          }
          incidentReportingRelatedObjects.addToReport.mockResolvedValueOnce([]) // NB: response is ignored
          incidentReportingApi.changeReportStatus.mockResolvedValueOnce(mockedReport) // NB: response is ignored

          return request(app)
            .post(viewReportUrl)
            .send(validPayload)
            .expect(302)
            .expect(res => {
              expect(res.redirect).toBe(true)
              expect(res.header.location).toEqual(expectedRedirect)
              if (needsOriginalReportReference) {
                expect(incidentReportingApi.getReportByReference).toHaveBeenCalledWith('1234')
              } else {
                expect(incidentReportingApi.getReportByReference).not.toHaveBeenCalled()
              }
              if (updatesTitle) {
                expect(prisonApi.getPrison).toHaveBeenCalledTimes(2)
                expect(prisonApi.getPrison).toHaveBeenNthCalledWith(1, 'NORTH', false) // to display report location
                expect(prisonApi.getPrison).toHaveBeenNthCalledWith(2, 'NORTH', false) // to regenerate title
                expect(incidentReportingApi.updateReport).toHaveBeenCalledWith(mockedReport.id, {
                  title: 'Assault: Arnold A1111AA, Benjamin A2222BB (Moorland (HMP & YOI))',
                })
              } else {
                expect(prisonApi.getPrison).toHaveBeenCalledTimes(1)
                expect(prisonApi.getPrison).toHaveBeenCalledWith('NORTH', false) // to display report location
                if (userAction === 'MARK_DUPLICATE') {
                  expect(incidentReportingApi.updateReport).toHaveBeenCalledWith(mockedReport.id, {
                    duplicatedReportId: mockedOriginalReport.id,
                  })
                } else {
                  expect(incidentReportingApi.updateReport).not.toHaveBeenCalled()
                }
              }
              if (postsCorrectionRequest !== undefined) {
                expect(incidentReportingRelatedObjects.addToReport).toHaveBeenCalledWith(
                  mockedReport.id,
                  postsCorrectionRequest,
                )
              } else {
                expect(incidentReportingRelatedObjects.addToReport).not.toHaveBeenCalled()
              }
              expect(incidentReportingApi.changeReportStatus).toHaveBeenCalledWith(mockedReport.id, { newStatus })
            })
        })

        if (actionsRequiringValidReports.includes(userAction)) {
          it('should not be allowed if report, that was created in DPS, is invalid', () => {
            makeReportInvalid()
            makeOriginalReportReferenceExistIfNeeded()
            incidentReportingRelatedObjects.addToReport.mockRejectedValue(new Error('should not be called'))
            incidentReportingApi.changeReportStatus.mockRejectedValue(new Error('should not be called'))

            return request(app)
              .post(viewReportUrl)
              .send(validPayload)
              .expect(200)
              .expect(res => {
                expect(res.text).toContain('There is a problem')
                expect(res.text).toContain('Fill in missing details')
                expect(incidentReportingApi.updateReport).not.toHaveBeenCalled()
                expect(incidentReportingRelatedObjects.addToReport).not.toHaveBeenCalled()
                expect(incidentReportingApi.changeReportStatus).not.toHaveBeenCalled()
              })
          })

          it('should succeed if report, that was created in NOMIS, is invalid', () => {
            makeReportInvalid()
            makeOriginalReportReferenceExistIfNeeded()
            mockedReport.createdInNomis = true
            mockedReport.lastModifiedInNomis = true
            incidentReportingApi.updateReport.mockResolvedValueOnce(mockedReport) // NB: response is ignored
            incidentReportingRelatedObjects.addToReport.mockResolvedValueOnce([]) // NB: response is ignored
            incidentReportingApi.changeReportStatus.mockResolvedValueOnce(mockedReport) // NB: response is ignored

            return request(app)
              .post(viewReportUrl)
              .send(validPayload)
              .expect(302)
              .expect(res => {
                expect(res.redirect).toBe(true)
                expect(res.header.location).toEqual(expectedRedirect)
                if (postsCorrectionRequest !== undefined) {
                  expect(incidentReportingRelatedObjects.addToReport).toHaveBeenCalledWith(
                    mockedReport.id,
                    postsCorrectionRequest,
                  )
                } else {
                  expect(incidentReportingRelatedObjects.addToReport).not.toHaveBeenCalled()
                }
                expect(incidentReportingApi.changeReportStatus).toHaveBeenCalledWith(mockedReport.id, { newStatus })
              })
          })
        } else {
          it(`should succeed changing the status to ${newStatus} even if the report is invalid`, () => {
            makeReportInvalid()
            makeOriginalReportReferenceExistIfNeeded()
            incidentReportingRelatedObjects.addToReport.mockResolvedValueOnce([]) // NB: response is ignore
            incidentReportingApi.changeReportStatus.mockResolvedValueOnce(mockedReport) // NB: response is ignored

            return request(app)
              .post(viewReportUrl)
              .send(validPayload)
              .expect(302)
              .expect(res => {
                expect(res.redirect).toBe(true)
                expect(res.header.location).toEqual(expectedRedirect)
                if (postsCorrectionRequest !== undefined) {
                  expect(incidentReportingRelatedObjects.addToReport).toHaveBeenCalledWith(
                    mockedReport.id,
                    postsCorrectionRequest,
                  )
                } else {
                  expect(incidentReportingRelatedObjects.addToReport).not.toHaveBeenCalled()
                }
                expect(incidentReportingApi.changeReportStatus).toHaveBeenCalledWith(mockedReport.id, { newStatus })
              })
          })
        }

        if (comment === 'optional') {
          it(`should succeed changing the status to ${newStatus} even if comment is left empty`, () => {
            makeReportValid()
            makeOriginalReportReferenceExistIfNeeded()
            incidentReportingRelatedObjects.addToReport.mockResolvedValueOnce([]) // NB: response is ignored
            incidentReportingApi.changeReportStatus.mockResolvedValueOnce(mockedReport) // NB: response is ignored

            return request(app)
              .post(viewReportUrl)
              .send({
                ...validPayload,
                [`${userAction}_COMMENT`]: '',
              } satisfies Payload)
              .expect(302)
              .expect(res => {
                expect(res.redirect).toBe(true)
                expect(res.header.location).toEqual(expectedRedirect)
                if (postsCorrectionRequest !== undefined) {
                  expect(incidentReportingRelatedObjects.addToReport).toHaveBeenCalledWith(mockedReport.id, {
                    ...postsCorrectionRequest,
                    descriptionOfChange: 'PLACEHOLDER',
                  })
                } else {
                  expect(incidentReportingRelatedObjects.addToReport).not.toHaveBeenCalled()
                }
                expect(incidentReportingApi.changeReportStatus).toHaveBeenCalledWith(mockedReport.id, { newStatus })
              })
          })
        }

        if (needsOriginalReportReference) {
          it('should show an error if original reference of duplicate report is left empty', () => {
            makeReportValid()
            incidentReportingRelatedObjects.addToReport.mockRejectedValue(new Error('should not be called'))
            incidentReportingApi.changeReportStatus.mockRejectedValue(new Error('should not be called'))

            return request(app)
              .post(viewReportUrl)
              .send({
                ...validPayload,
                originalReportReference: '',
              } satisfies Payload)
              .expect(200)
              .expect(res => {
                expect(res.text).toContain('There is a problem')
                expect(res.text).toContain('Enter a valid incident report number')
                expect(incidentReportingApi.getReportByReference).not.toHaveBeenCalled()
                expect(incidentReportingRelatedObjects.addToReport).not.toHaveBeenCalled()
                expect(incidentReportingApi.changeReportStatus).not.toHaveBeenCalled()
              })
          })

          it('should show an error if original reference of duplicate report is the same', () => {
            makeReportValid()
            incidentReportingRelatedObjects.addToReport.mockRejectedValue(new Error('should not be called'))
            incidentReportingApi.changeReportStatus.mockRejectedValue(new Error('should not be called'))

            return request(app)
              .post(viewReportUrl)
              .send({
                ...validPayload,
                originalReportReference: '6543',
              } satisfies Payload)
              .expect(200)
              .expect(res => {
                expect(res.text).toContain('There is a problem')
                expect(res.text).toContain('Enter a different report number')
                expect(incidentReportingApi.getReportByReference).not.toHaveBeenCalled()
                expect(incidentReportingRelatedObjects.addToReport).not.toHaveBeenCalled()
                expect(incidentReportingApi.changeReportStatus).not.toHaveBeenCalled()
              })
          })

          it('should show an error if original reference of duplicate report cannot be found', () => {
            makeReportValid()
            const error = mockThrownError(mockErrorResponse({ status: 404, message: 'Report not found' }), 404)
            incidentReportingApi.getReportByReference.mockReset()
            incidentReportingApi.getReportByReference.mockRejectedValueOnce(error)
            incidentReportingRelatedObjects.addToReport.mockRejectedValue(new Error('should not be called'))
            incidentReportingApi.changeReportStatus.mockRejectedValue(new Error('should not be called'))

            return request(app)
              .post(viewReportUrl)
              .send(validPayload)
              .expect(200)
              .expect(res => {
                expect(res.text).toContain('There is a problem')
                expect(res.text).toContain('Enter a valid incident report number')
                expect(incidentReportingRelatedObjects.addToReport).not.toHaveBeenCalled()
                expect(incidentReportingApi.changeReportStatus).not.toHaveBeenCalled()
              })
          })

          it('should show an error if original reference of duplicate report cannot be looked up', () => {
            makeReportValid()
            const error = mockThrownError(mockErrorResponse({ status: 500, message: 'External problem' }), 500)
            incidentReportingApi.getReportByReference.mockReset()
            incidentReportingApi.getReportByReference.mockRejectedValueOnce(error)
            incidentReportingRelatedObjects.addToReport.mockRejectedValue(new Error('should not be called'))
            incidentReportingApi.changeReportStatus.mockRejectedValue(new Error('should not be called'))

            return request(app)
              .post(viewReportUrl)
              .send(validPayload)
              .expect(200)
              .expect(res => {
                expect(res.text).toContain('There is a problem')
                expect(res.text).toContain('Incident number could not be looked up')
                expect(res.text).not.toContain('Enter a valid incident report number')
                expect(res.text).not.toContain('External problem')
                expect(incidentReportingRelatedObjects.addToReport).not.toHaveBeenCalled()
                expect(incidentReportingApi.changeReportStatus).not.toHaveBeenCalled()
              })
          })
        }

        if (updatesTitle) {
          it('should show an error if API rejects updating title', () => {
            makeReportValid()
            makeOriginalReportReferenceExistIfNeeded()
            const error = mockThrownError(mockErrorResponse({ message: 'Title is too long' }))
            incidentReportingApi.updateReport.mockRejectedValueOnce(error)
            incidentReportingRelatedObjects.addToReport.mockResolvedValueOnce([]) // NB: response is ignored
            incidentReportingApi.changeReportStatus.mockResolvedValueOnce(mockedReport) // NB: response is ignored

            return request(app)
              .post(viewReportUrl)
              .send(validPayload)
              .expect(200)
              .expect(res => {
                expect(res.text).toContain('There is a problem')
                expect(res.text).toContain('Sorry, there was a problem with your request')
                expect(res.text).not.toContain('Bad Request')
                expect(res.text).not.toContain('Title is too long')
                expect(incidentReportingRelatedObjects.addToReport).not.toHaveBeenCalled()
                expect(incidentReportingApi.changeReportStatus).not.toHaveBeenCalled()
              })
          })
        }

        if (postsCorrectionRequest !== undefined) {
          it('should show an error if API rejects adding a correction request', () => {
            makeReportValid()
            makeOriginalReportReferenceExistIfNeeded()
            const error = mockThrownError(mockErrorResponse({ message: 'Comment is required' }))
            incidentReportingRelatedObjects.addToReport.mockRejectedValueOnce(error)
            incidentReportingApi.changeReportStatus.mockResolvedValueOnce(mockedReport) // NB: response is ignored

            return request(app)
              .post(viewReportUrl)
              .send(validPayload)
              .expect(200)
              .expect(res => {
                expect(res.text).toContain('There is a problem')
                expect(res.text).toContain('Sorry, there was a problem with your request')
                expect(res.text).not.toContain('Bad Request')
                expect(res.text).not.toContain('Comment is required')
                expect(incidentReportingApi.changeReportStatus).not.toHaveBeenCalled()
              })
          })
        }

        it('should show an error if API rejects changing status', () => {
          makeReportValid()
          makeOriginalReportReferenceExistIfNeeded()
          incidentReportingRelatedObjects.addToReport.mockResolvedValueOnce([]) // NB: response is ignored
          const error = mockThrownError(mockErrorResponse({ message: 'Comment is required' }))
          incidentReportingApi.changeReportStatus.mockRejectedValueOnce(error)

          return request(app)
            .post(viewReportUrl)
            .send(validPayload)
            .expect(200)
            .expect(res => {
              expect(res.text).toContain('There is a problem')
              expect(res.text).toContain('Sorry, there was a problem with your request')
              expect(res.text).not.toContain('Bad Request')
              expect(res.text).not.toContain('Comment is required')
            })
        })
      },
    )

    describe('unauthorised users', () => {
      beforeEach(() => {
        setupAppForUser(mockUnauthorisedUser)
        makeReportValid()
      })

      describe.each(userActions.filter(({ code: userAction }) => !['VIEW', 'EDIT'].includes(userAction)))(
        'cannot take action $code',
        ({ code: userAction }) => {
          it.each(statuses)('on a report with status $code', ({ code: status }) => {
            mockedReport.status = status
            incidentReportingRelatedObjects.addToReport.mockRejectedValue(new Error('should not be called'))
            incidentReportingApi.changeReportStatus.mockRejectedValue(new Error('should not be called'))

            const maybeValidPayload = { userAction } // doesn’t matter that it’s invalid since expectation is a specific error
            return request(app)
              .post(viewReportUrl)
              .send(maybeValidPayload)
              .expect(302)
              .expect(res => {
                expect(res.redirect).toBe(true)
                expect(res.header.location).toEqual('/sign-out')
                expect(incidentReportingRelatedObjects.addToReport).not.toHaveBeenCalled()
                expect(incidentReportingApi.changeReportStatus).not.toHaveBeenCalled()
              })
          })
        },
      )
    })
  })
})
