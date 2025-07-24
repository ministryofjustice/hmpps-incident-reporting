import type { Express } from 'express'
import request from 'supertest'

import { PrisonApi } from '../../../data/prisonApi'
import { appWithAllRoutes } from '../../testutils/appSetup'
import { now } from '../../../testutils/fakeClock'
import UserService from '../../../services/userService'
import { type Status, statuses } from '../../../reportConfiguration/constants'
import { type UserAction, userActions } from '../../../middleware/permissions'
import { IncidentReportingApi, type ReportWithDetails } from '../../../data/incidentReportingApi'
import { convertBasicReportDates, convertReportWithDetailsDates } from '../../../data/incidentReportingApiUtils'
import * as reportValidity from '../../../data/reportValidity'
import { mockErrorResponse, mockReport } from '../../../data/testData/incidentReporting'
import { mockSharedUser } from '../../../data/testData/manageUsers'
import { leeds, moorland } from '../../../data/testData/prisonApi'
import { mockThrownError } from '../../../data/testData/thrownErrors'
import { mockDataWarden, mockReportingOfficer, mockHqViewer, mockUnauthorisedUser } from '../../../data/testData/users'

jest.mock('../../../data/incidentReportingApi')
jest.mock('../../../data/prisonApi')
jest.mock('../../../data/reportValidity')
jest.mock('../../../services/userService')

let incidentReportingApi: jest.Mocked<IncidentReportingApi>
let userService: jest.Mocked<UserService>
let prisonApi: jest.Mocked<PrisonApi>

beforeEach(() => {
  userService = UserService.prototype as jest.Mocked<UserService>
  incidentReportingApi = IncidentReportingApi.prototype as jest.Mocked<IncidentReportingApi>
  prisonApi = PrisonApi.prototype as jest.Mocked<PrisonApi>

  userService.getUsers.mockResolvedValueOnce({
    [mockSharedUser.username]: mockSharedUser,
  })

  const prisons = {
    LEI: leeds,
    MDI: moorland,
  }
  prisonApi.getPrisons.mockResolvedValue(prisons)
})

afterEach(() => {
  jest.resetAllMocks()
})

let app: Express

function setupAppForUser(user: Express.User): void {
  app = appWithAllRoutes({ services: { userService }, userSupplier: () => user })
}

const { validateReport } = reportValidity as jest.Mocked<typeof import('../../../data/reportValidity')>

function makeReportValid() {
  validateReport.mockImplementationOnce(function* generator() {
    /* empty */
  })
}

function makeReportInvalid() {
  validateReport.mockImplementationOnce(function* generator() {
    yield { text: 'Fill in missing details', href: '#' }
  })
}

describe('Actioning reports', () => {
  let mockedReport: ReportWithDetails
  let viewReportUrl: string

  beforeEach(() => {
    mockedReport = convertReportWithDetailsDates(
      mockReport({
        reportReference: '6543',
        reportDateAndTime: now,
        type: 'ASSAULT_5',
        withDetails: true,
      }),
    )
    incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(mockedReport)
    viewReportUrl = `/reports/${mockedReport.id}`
  })

  describe('Action options', () => {
    beforeEach(() => {
      makeReportInvalid()
    })

    interface OptionsScenario {
      userType: string
      user: Express.User
      reportStatus: Status
      formOptions: string[]
    }
    const optionsScenarios: OptionsScenario[] = [
      {
        userType: 'reporting officers',
        user: mockReportingOfficer,
        reportStatus: 'DRAFT',
        formOptions: ['Submit', 'Request to remove report'],
      },
      {
        userType: 'reporting officers',
        user: mockReportingOfficer,
        reportStatus: 'NEEDS_UPDATING',
        formOptions: ['Resubmit', 'Describe what has changed in the report', 'Request to remove report'],
      },
      {
        userType: 'reporting officers',
        user: mockReportingOfficer,
        reportStatus: 'REOPENED',
        formOptions: ['Resubmit', 'Describe what has changed in the report', 'Request to remove report'],
      },
      {
        userType: 'reporting officers',
        user: mockReportingOfficer,
        reportStatus: 'AWAITING_REVIEW',
        formOptions: ['Change report'],
      },
      {
        userType: 'reporting officers',
        user: mockReportingOfficer,
        reportStatus: 'UPDATED',
        formOptions: ['Change report'],
      },
      {
        userType: 'reporting officers',
        user: mockReportingOfficer,
        reportStatus: 'WAS_CLOSED',
        formOptions: ['Change report'],
      },
      {
        userType: 'reporting officers',
        user: mockReportingOfficer,
        reportStatus: 'CLOSED',
        formOptions: ['Reopen and change report'],
      },
      {
        userType: 'reporting officers',
        user: mockReportingOfficer,
        reportStatus: 'DUPLICATE',
        formOptions: ['Reopen and change report'],
      },
      {
        userType: 'reporting officers',
        user: mockReportingOfficer,
        reportStatus: 'NOT_REPORTABLE',
        formOptions: ['Reopen and change report'],
      },
      {
        userType: 'data wardens',
        user: mockDataWarden,
        reportStatus: 'AWAITING_REVIEW',
        formOptions: [
          'Close',
          'Send back',
          'Put on hold',
          'Describe why the report is being put on hold',
          'Mark as a duplicate',
          'Mark as not reportable',
        ],
      },
      {
        userType: 'data wardens',
        user: mockDataWarden,
        reportStatus: 'UPDATED',
        formOptions: [
          'Close',
          'Send back',
          'Describe why the report is being sent back',
          'Put on hold',
          'Describe why the report is being put on hold',
          'Mark as a duplicate',
          'Enter incident report number of the original report',
          'Describe why it is a duplicate report (optional)',
          'Mark as not reportable',
          'Describe why it is not reportable',
        ],
      },
      {
        userType: 'data wardens',
        user: mockDataWarden,
        reportStatus: 'WAS_CLOSED',
        formOptions: [
          'Close',
          'Send back',
          'Describe why the report is being sent back',
          'Mark as a duplicate',
          'Enter incident report number of the original report',
          'Describe why it is a duplicate report (optional)',
          'Mark as not reportable',
          'Describe why it is not reportable',
        ],
      },
      {
        userType: 'data wardens',
        user: mockDataWarden,
        reportStatus: 'ON_HOLD',
        formOptions: [
          'Close',
          'Send back',
          'Describe why the report is being sent back',
          'Mark as a duplicate',
          'Enter incident report number of the original report',
          'Describe why it is a duplicate report (optional)',
          'Mark as not reportable',
          'Describe why it is not reportable',
        ],
      },
      {
        userType: 'data wardens',
        user: mockDataWarden,
        reportStatus: 'NEEDS_UPDATING',
        formOptions: ['Change report status'],
      },
      {
        userType: 'data wardens',
        user: mockDataWarden,
        reportStatus: 'REOPENED',
        formOptions: ['Change report status'],
      },
      { userType: 'data wardens', user: mockDataWarden, reportStatus: 'CLOSED', formOptions: ['Change report status'] },
      {
        userType: 'data wardens',
        user: mockDataWarden,
        reportStatus: 'DUPLICATE',
        formOptions: ['Change report status'],
      },
      {
        userType: 'data wardens',
        user: mockDataWarden,
        reportStatus: 'NOT_REPORTABLE',
        formOptions: ['Change report status'],
      },
    ]
    it.each(optionsScenarios)(
      'should show options to $userType when viewing reports with status $reportStatus',
      ({ user, reportStatus, formOptions }) => {
        setupAppForUser(user)
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

    it('should not show any options to reporting officers, only a banner, when report is on hold', () => {
      setupAppForUser(mockReportingOfficer)
      mockedReport.status = 'ON_HOLD'

      return request(app)
        .get(viewReportUrl)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('On hold')
          expect(res.text).toContain(
            'A data warden has placed this report on hold, if you need to make an update contact (email address)',
          )
          expect(res.text).not.toContain('app-view-report__user-action-form')
          expect(res.text).not.toContain('Continue')
          expect(res.text).not.toContain('Submit')
          expect(res.text).not.toContain('Resubmit')
          expect(res.text).not.toContain('Request to remove report')
        })
    })

    it('should not show any options to data wardens when report is a draft', () => {
      setupAppForUser(mockDataWarden)
      mockedReport.status = 'DRAFT'

      return request(app)
        .get(viewReportUrl)
        .expect(200)
        .expect(res => {
          expect(res.text).not.toContain('app-view-report__user-action-form')
          expect(res.text).not.toContain('Continue')
          expect(res.text).not.toContain('Submit')
          expect(res.text).not.toContain('Resubmit')
          expect(res.text).not.toContain('Request to remove report')
          expect(res.text).not.toContain('Close')
          expect(res.text).not.toContain('Send back')
          expect(res.text).not.toContain('Put on hold')
          expect(res.text).not.toContain('Mark as a duplicate')
          expect(res.text).not.toContain('Mark as not reportable')
        })
    })

    it.each(statuses)('should not show any options to HQ viewer when report has status $code', ({ code: status }) => {
      setupAppForUser(mockHqViewer)
      mockedReport.status = status

      return request(app)
        .get(viewReportUrl)
        .expect(200)
        .expect(res => {
          expect(res.text).not.toContain('app-view-report__user-action-form')
          expect(res.text).not.toContain('Continue')
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
        userType: 'reporting officers',
        user: mockReportingOfficer,
        forbiddenTransitions: [
          {
            userAction: 'requestReview',
            forbiddenStatuses: [
              'AWAITING_REVIEW',
              'UPDATED',
              'ON_HOLD',
              'WAS_CLOSED',
              'DUPLICATE',
              'NOT_REPORTABLE',
              'CLOSED',
            ],
          },
          {
            userAction: 'requestRemoval',
            forbiddenStatuses: [
              'AWAITING_REVIEW',
              'UPDATED',
              'ON_HOLD',
              'WAS_CLOSED',
              'DUPLICATE',
              'NOT_REPORTABLE',
              'CLOSED',
            ],
          },
          { userAction: 'recall', forbiddenStatuses: ['DRAFT', 'NEEDS_UPDATING', 'REOPENED', 'ON_HOLD'] },
          { userAction: 'requestCorrection', forbiddenStatuses: 'all' },
          { userAction: 'close', forbiddenStatuses: 'all' },
          { userAction: 'markDuplicate', forbiddenStatuses: 'all' },
          { userAction: 'markNotReportable', forbiddenStatuses: 'all' },
          { userAction: 'hold', forbiddenStatuses: 'all' },
        ],
      },
      {
        userType: 'data wardens',
        user: mockDataWarden,
        forbiddenTransitions: [
          { userAction: 'requestReview', forbiddenStatuses: 'all' },
          { userAction: 'requestRemoval', forbiddenStatuses: 'all' },
          {
            userAction: 'requestCorrection',
            forbiddenStatuses: ['DRAFT', 'NEEDS_UPDATING', 'REOPENED', 'DUPLICATE', 'NOT_REPORTABLE', 'CLOSED'],
          },
          { userAction: 'recall', forbiddenStatuses: ['DRAFT', 'AWAITING_REVIEW', 'UPDATED', 'ON_HOLD', 'WAS_CLOSED'] },
          {
            userAction: 'close',
            forbiddenStatuses: ['DRAFT', 'NEEDS_UPDATING', 'REOPENED', 'DUPLICATE', 'NOT_REPORTABLE', 'CLOSED'],
          },
          {
            userAction: 'markDuplicate',
            forbiddenStatuses: ['DRAFT', 'NEEDS_UPDATING', 'REOPENED', 'DUPLICATE', 'NOT_REPORTABLE', 'CLOSED'],
          },
          {
            userAction: 'markNotReportable',
            forbiddenStatuses: ['DRAFT', 'NEEDS_UPDATING', 'REOPENED', 'DUPLICATE', 'NOT_REPORTABLE', 'CLOSED'],
          },
          {
            userAction: 'hold',
            forbiddenStatuses: [
              'DRAFT',
              'NEEDS_UPDATING',
              'REOPENED',
              'WAS_CLOSED',
              'DUPLICATE',
              'NOT_REPORTABLE',
              'CLOSED',
            ],
          },
        ],
      },
      { userType: 'HQ viewers', user: mockHqViewer, forbiddenTransitions: 'all' },
    ]
    describe.each(forbiddenTransitionScenarios)('when $userType', ({ userType, user, forbiddenTransitions }) => {
      beforeEach(() => {
        setupAppForUser(user)
        makeReportInvalid()
      })

      function expectNotAllowedErrorMessages(status: Status, payload: object): request.Test {
        mockedReport.status = status
        incidentReportingApi.changeReportStatus.mockRejectedValue(new Error('should not be called'))

        return request(app)
          .post(viewReportUrl)
          .send(payload)
          .expect(200)
          .expect(res => {
            expect(res.text).toContain('There is a problem')
            const noActionsPermitted =
              (userType === 'reporting officers' && status === 'ON_HOLD') ||
              (userType === 'data wardens' && status === 'DRAFT') ||
              userType === 'HQ viewers' ||
              status === 'POST_INCIDENT_UPDATE'
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
              .filter(({ code: userAction }) => !['view', 'edit'].includes(userAction))
              .map(({ code: userAction }) => ({ userAction, forbiddenStatuses: 'all' as const }))
          : forbiddenTransitions,
      )('try to perform $userAction', ({ userAction, forbiddenStatuses }) => {
        it.each(forbiddenStatuses === 'all' ? statuses.map(status => status.code) : forbiddenStatuses)(
          'should not be allowed for a report with status %s',
          status => expectNotAllowedErrorMessages(status, { userAction }),
        )
      })
    })

    const actionsRequiringValidReports = ['requestReview', 'close']
    // TODO: this will probably turn into a flag on the report so closing will not need the checks

    interface TransitionScenarios {
      userType: string
      user: Express.User
      currentStatus: Status
      userAction: UserAction
      comment: 'not required' | 'required'
      newStatus: Status
      redirectedPage: 'dashboard' | 'view-report'
    }
    const transitionScenarios: TransitionScenarios[] = [
      // cannot add comment & redirect to dashboard
      {
        userType: 'reporting officers',
        user: mockReportingOfficer,
        currentStatus: 'DRAFT',
        userAction: 'requestReview',
        comment: 'not required',
        newStatus: 'AWAITING_REVIEW',
        redirectedPage: 'dashboard',
      },
      {
        userType: 'data wardens',
        user: mockDataWarden,
        currentStatus: 'AWAITING_REVIEW',
        userAction: 'close',
        comment: 'not required',
        newStatus: 'CLOSED',
        redirectedPage: 'dashboard',
      },
      {
        userType: 'data wardens',
        user: mockDataWarden,
        currentStatus: 'ON_HOLD',
        userAction: 'close',
        comment: 'not required',
        newStatus: 'CLOSED',
        redirectedPage: 'dashboard',
      },
      {
        userType: 'data wardens',
        user: mockDataWarden,
        currentStatus: 'UPDATED',
        userAction: 'close',
        comment: 'not required',
        newStatus: 'CLOSED',
        redirectedPage: 'dashboard',
      },
      {
        userType: 'data wardens',
        user: mockDataWarden,
        currentStatus: 'WAS_CLOSED',
        userAction: 'close',
        comment: 'not required',
        newStatus: 'CLOSED',
        redirectedPage: 'dashboard',
      },
      // cannot add comment & refresh report page
      {
        userType: 'reporting officers',
        user: mockReportingOfficer,
        currentStatus: 'AWAITING_REVIEW',
        userAction: 'recall',
        comment: 'not required',
        newStatus: 'DRAFT',
        redirectedPage: 'view-report',
      },
      {
        userType: 'reporting officers',
        user: mockReportingOfficer,
        currentStatus: 'UPDATED',
        userAction: 'recall',
        comment: 'not required',
        newStatus: 'NEEDS_UPDATING',
        redirectedPage: 'view-report',
      },
      {
        userType: 'reporting officers',
        user: mockReportingOfficer,
        currentStatus: 'WAS_CLOSED',
        userAction: 'recall',
        comment: 'not required',
        newStatus: 'REOPENED',
        redirectedPage: 'view-report',
      },
      {
        userType: 'data wardens',
        user: mockDataWarden,
        currentStatus: 'NEEDS_UPDATING',
        userAction: 'recall',
        comment: 'not required',
        newStatus: 'UPDATED',
        redirectedPage: 'view-report',
      },
      {
        userType: 'data wardens',
        user: mockDataWarden,
        currentStatus: 'CLOSED',
        userAction: 'recall',
        comment: 'not required',
        newStatus: 'UPDATED',
        redirectedPage: 'view-report',
      },
      {
        userType: 'data wardens',
        user: mockDataWarden,
        currentStatus: 'DUPLICATE',
        userAction: 'recall',
        comment: 'not required',
        newStatus: 'UPDATED',
        redirectedPage: 'view-report',
      },
      {
        userType: 'data wardens',
        user: mockDataWarden,
        currentStatus: 'NOT_REPORTABLE',
        userAction: 'recall',
        comment: 'not required',
        newStatus: 'UPDATED',
        redirectedPage: 'view-report',
      },
      {
        userType: 'data wardens',
        user: mockDataWarden,
        currentStatus: 'REOPENED',
        userAction: 'recall',
        comment: 'not required',
        newStatus: 'WAS_CLOSED',
        redirectedPage: 'view-report',
      },
      // comment required & redirect to dashboard
      {
        userType: 'reporting officers',
        user: mockReportingOfficer,
        currentStatus: 'NEEDS_UPDATING',
        userAction: 'requestReview',
        comment: 'required',
        newStatus: 'UPDATED',
        redirectedPage: 'dashboard',
      },
      {
        userType: 'reporting officers',
        user: mockReportingOfficer,
        currentStatus: 'REOPENED',
        userAction: 'requestReview',
        comment: 'required',
        newStatus: 'WAS_CLOSED',
        redirectedPage: 'dashboard',
      },
      {
        userType: 'data wardens',
        user: mockDataWarden,
        currentStatus: 'AWAITING_REVIEW',
        userAction: 'requestCorrection',
        comment: 'required',
        newStatus: 'NEEDS_UPDATING',
        redirectedPage: 'dashboard',
      },
      {
        userType: 'data wardens',
        user: mockDataWarden,
        currentStatus: 'AWAITING_REVIEW',
        userAction: 'hold',
        comment: 'required',
        newStatus: 'ON_HOLD',
        redirectedPage: 'dashboard',
      },
      {
        userType: 'data wardens',
        user: mockDataWarden,
        currentStatus: 'AWAITING_REVIEW',
        userAction: 'markNotReportable',
        comment: 'not required',
        newStatus: 'NOT_REPORTABLE',
        redirectedPage: 'dashboard',
      },
      {
        userType: 'data wardens',
        user: mockDataWarden,
        currentStatus: 'ON_HOLD',
        userAction: 'requestCorrection',
        comment: 'required',
        newStatus: 'NEEDS_UPDATING',
        redirectedPage: 'dashboard',
      },
      {
        userType: 'data wardens',
        user: mockDataWarden,
        currentStatus: 'ON_HOLD',
        userAction: 'markNotReportable',
        comment: 'not required',
        newStatus: 'NOT_REPORTABLE',
        redirectedPage: 'dashboard',
      },
      {
        userType: 'data wardens',
        user: mockDataWarden,
        currentStatus: 'UPDATED',
        userAction: 'requestCorrection',
        comment: 'required',
        newStatus: 'NEEDS_UPDATING',
        redirectedPage: 'dashboard',
      },
      {
        userType: 'data wardens',
        user: mockDataWarden,
        currentStatus: 'UPDATED',
        userAction: 'hold',
        comment: 'required',
        newStatus: 'ON_HOLD',
        redirectedPage: 'dashboard',
      },
      {
        userType: 'data wardens',
        user: mockDataWarden,
        currentStatus: 'UPDATED',
        userAction: 'markNotReportable',
        comment: 'not required',
        newStatus: 'NOT_REPORTABLE',
        redirectedPage: 'dashboard',
      },
      {
        userType: 'data wardens',
        user: mockDataWarden,
        currentStatus: 'WAS_CLOSED',
        userAction: 'requestCorrection',
        comment: 'required',
        newStatus: 'REOPENED',
        redirectedPage: 'dashboard',
      },
      {
        userType: 'data wardens',
        user: mockDataWarden,
        currentStatus: 'WAS_CLOSED',
        userAction: 'markNotReportable',
        comment: 'not required',
        newStatus: 'NOT_REPORTABLE',
        redirectedPage: 'dashboard',
      },
    ]
    describe.each(transitionScenarios)(
      'when $userType try to perform $userAction on report with status $currentStatus when a comment is $comment',
      ({ user, currentStatus, userAction, comment, newStatus, redirectedPage }) => {
        let expectedRedirect: string

        beforeEach(() => {
          setupAppForUser(user)
          mockedReport.status = currentStatus
          expectedRedirect = redirectedPage === 'dashboard' ? '/reports' : `/reports/${mockedReport.id}`
        })

        const validPayload: { userAction: UserAction } & { [C in `${UserAction}Comment`]?: string } = { userAction }
        if (comment === 'required') {
          validPayload[`${userAction}Comment`] = 'My comment on this action'
        }

        it(`should succeed changing the status to ${newStatus} if the report is valid`, () => {
          makeReportValid()
          incidentReportingApi.changeReportStatus.mockResolvedValueOnce(mockedReport) // NB: response is ignored

          return request(app)
            .post(viewReportUrl)
            .send(validPayload)
            .expect(302)
            .expect(res => {
              expect(res.redirect).toBe(true)
              expect(res.header.location).toEqual(expectedRedirect)
              if (userAction === 'requestReview') {
                expect(incidentReportingApi.updateReport).toHaveBeenCalledWith(mockedReport.id, {
                  title: 'Assault: Arnold A1111AA, Benjamin A2222BB (Moorland (HMP & YOI))',
                })
              } else {
                expect(incidentReportingApi.updateReport).not.toHaveBeenCalled()
              }
              expect(incidentReportingApi.changeReportStatus).toHaveBeenCalledWith(mockedReport.id, { newStatus })
            })
        })

        if (actionsRequiringValidReports.includes(userAction)) {
          it('should not be allowed if report is invalid', () => {
            makeReportInvalid()
            incidentReportingApi.changeReportStatus.mockRejectedValue(new Error('should not be called'))

            return request(app)
              .post(viewReportUrl)
              .send(validPayload)
              .expect(200)
              .expect(res => {
                expect(res.text).toContain('There is a problem')
                expect(res.text).toContain('Fill in missing details')
                expect(incidentReportingApi.updateReport).not.toHaveBeenCalled()
                expect(incidentReportingApi.changeReportStatus).not.toHaveBeenCalled()
              })
          })
        } else {
          it(`should succeed changing the status to ${newStatus} even if the report is invalid`, () => {
            makeReportInvalid()
            incidentReportingApi.changeReportStatus.mockResolvedValueOnce(mockedReport) // NB: response is ignored

            return request(app)
              .post(viewReportUrl)
              .send(validPayload)
              .expect(302)
              .expect(res => {
                expect(res.redirect).toBe(true)
                expect(res.header.location).toEqual(expectedRedirect)
                expect(incidentReportingApi.changeReportStatus).toHaveBeenCalledWith(mockedReport.id, { newStatus })
              })
          })
        }

        if (comment === 'required') {
          it('should not be allowed if comment is missing', () => {
            makeReportValid()
            incidentReportingApi.changeReportStatus.mockRejectedValue(new Error('should not be called'))

            return request(app)
              .post(viewReportUrl)
              .send({
                ...validPayload,
                [`${userAction}Comment`]: '',
              })
              .expect(200)
              .expect(res => {
                expect(res.text).toContain('There is a problem')
                if (userAction === 'requestReview') {
                  expect(res.text).toContain('Enter what has changed in the report')
                } else if (userAction === 'markNotReportable') {
                  expect(res.text).toContain('Describe why incident is not reportable')
                } else {
                  expect(res.text).toContain('Please enter a comment')
                }
                expect(incidentReportingApi.updateReport).not.toHaveBeenCalled()
                expect(incidentReportingApi.changeReportStatus).not.toHaveBeenCalled()
              })
          })
        }

        it('should show an error if API rejects request to change status', () => {
          makeReportValid()
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

    describe.each(['AWAITING_REVIEW', 'ON_HOLD', 'UPDATED', 'WAS_CLOSED'] as const)(
      'when data wardens try to perform markDuplicate (which requires original reference) on report with status %s',
      status => {
        beforeEach(() => {
          setupAppForUser(mockDataWarden)
          mockedReport.status = status
        })

        const validPayload = {
          userAction: 'markDuplicate',
          originalReportReference: '1234',
          markDuplicateComment: 'My comment on this action',
        }
        const mockedDuplicateReport = convertBasicReportDates(
          mockReport({ reportReference: '1234', reportDateAndTime: now }),
        )

        it.each(['valid', 'invalid'] as const)(
          'should succeed changing the status to DUPLICATE if the report is %s',
          validity => {
            if (validity === 'valid') {
              makeReportValid()
            } else {
              makeReportInvalid()
            }
            incidentReportingApi.getReportByReference.mockResolvedValueOnce(mockedDuplicateReport)
            incidentReportingApi.changeReportStatus.mockResolvedValueOnce(mockedReport) // NB: response is ignored

            return request(app)
              .post(viewReportUrl)
              .send(validPayload)
              .expect(302)
              .expect(res => {
                expect(res.redirect).toBe(true)
                expect(res.header.location).toEqual('/reports')
                expect(incidentReportingApi.changeReportStatus).toHaveBeenCalledWith(mockedReport.id, {
                  newStatus: 'DUPLICATE',
                })
              })
          },
        )

        it('should still succeed if comment is left empty', () => {
          makeReportValid()
          incidentReportingApi.getReportByReference.mockResolvedValueOnce(mockedDuplicateReport)
          incidentReportingApi.changeReportStatus.mockResolvedValueOnce(mockedReport) // NB: response is ignored

          return request(app)
            .post(viewReportUrl)
            .send({
              ...validPayload,
              markDuplicateComment: '',
            })
            .expect(302)
            .expect(res => {
              expect(res.redirect).toBe(true)
              expect(res.header.location).toEqual('/reports')
              expect(incidentReportingApi.changeReportStatus).toHaveBeenCalledWith(mockedReport.id, {
                newStatus: 'DUPLICATE',
              })
            })
        })

        it('should show an error if original reference of duplicate report is left empty', () => {
          makeReportValid()
          incidentReportingApi.getReportByReference.mockRejectedValueOnce(new Error('should not be called'))
          incidentReportingApi.changeReportStatus.mockRejectedValue(new Error('should not be called'))

          return request(app)
            .post(viewReportUrl)
            .send({
              ...validPayload,
              originalReportReference: '',
            })
            .expect(200)
            .expect(res => {
              expect(res.text).toContain('There is a problem')
              expect(res.text).toContain('Enter a valid incident report number')
              expect(incidentReportingApi.getReportByReference).not.toHaveBeenCalled()
              expect(incidentReportingApi.changeReportStatus).not.toHaveBeenCalled()
            })
        })

        it('should show an error if original reference of duplicate report is the same', () => {
          makeReportValid()
          incidentReportingApi.getReportByReference.mockRejectedValueOnce(new Error('should not be called'))
          incidentReportingApi.changeReportStatus.mockRejectedValue(new Error('should not be called'))

          return request(app)
            .post(viewReportUrl)
            .send({
              ...validPayload,
              originalReportReference: '6543',
            })
            .expect(200)
            .expect(res => {
              expect(res.text).toContain('There is a problem')
              expect(res.text).toContain('Enter a different report number')
              expect(incidentReportingApi.getReportByReference).not.toHaveBeenCalled()
              expect(incidentReportingApi.changeReportStatus).not.toHaveBeenCalled()
            })
        })

        it('should show an error if original reference of duplicate report cannot be found', () => {
          makeReportValid()
          const error = mockThrownError(mockErrorResponse({ status: 404, message: 'Report not found' }), 404)
          incidentReportingApi.getReportByReference.mockRejectedValueOnce(error)
          incidentReportingApi.changeReportStatus.mockRejectedValue(new Error('should not be called'))

          return request(app)
            .post(viewReportUrl)
            .send(validPayload)
            .expect(200)
            .expect(res => {
              expect(res.text).toContain('There is a problem')
              expect(res.text).toContain('Enter a valid incident report number')
              expect(incidentReportingApi.changeReportStatus).not.toHaveBeenCalled()
            })
        })

        it('should show an error if original reference of duplicate report cannot be looked up', () => {
          makeReportValid()
          const error = mockThrownError(mockErrorResponse({ status: 500, message: 'External problem' }), 500)
          incidentReportingApi.getReportByReference.mockRejectedValueOnce(error)
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
              expect(incidentReportingApi.changeReportStatus).not.toHaveBeenCalled()
            })
        })

        it('should show an error if API rejects request to change status', () => {
          makeReportValid()
          incidentReportingApi.getReportByReference.mockResolvedValueOnce(mockedDuplicateReport)
          const error = mockThrownError(mockErrorResponse({ message: 'Comment is required' }))
          incidentReportingApi.changeReportStatus.mockRejectedValueOnce(error)

          return request(app)
            .post(viewReportUrl)
            .send(validPayload)
            .expect(200)
            .expect(res => {
              expect(res.text).toContain('There is a problem')
              expect(res.text).toContain('Sorry, there was a problem with your request')
              expect(res.text).not.toContain('Internal Server Error')
              expect(res.text).not.toContain('External problem')
            })
        })
      },
    )

    interface RedirectScenarios {
      currentStatus: Status
      userAction: UserAction
      redirectedPage: string
    }
    const redirectScenarios: RedirectScenarios[] = [
      { currentStatus: 'DRAFT', userAction: 'requestRemoval', redirectedPage: 'request-remove' },
      { currentStatus: 'NEEDS_UPDATING', userAction: 'requestRemoval', redirectedPage: 'request-remove' },
      { currentStatus: 'REOPENED', userAction: 'requestRemoval', redirectedPage: 'request-remove' },
      { currentStatus: 'CLOSED', userAction: 'recall', redirectedPage: 'reopen' },
      { currentStatus: 'DUPLICATE', userAction: 'recall', redirectedPage: 'reopen' },
      { currentStatus: 'NOT_REPORTABLE', userAction: 'recall', redirectedPage: 'reopen' },
    ]
    describe.each(redirectScenarios)(
      'when reporting officers try to perform $userAction on report with status $currentStatus',
      ({ currentStatus, userAction, redirectedPage }) => {
        beforeEach(() => {
          setupAppForUser(mockReportingOfficer)
          mockedReport.status = currentStatus
        })

        it('should succeed with no status change', () => {
          incidentReportingApi.changeReportStatus.mockRejectedValue(new Error('should not be called'))

          return request(app)
            .post(viewReportUrl)
            .send({ userAction })
            .expect(302)
            .expect(res => {
              expect(res.redirect).toBe(true)
              expect(res.header.location).toEqual(`/reports/${mockedReport.id}/${redirectedPage}`)
              expect(incidentReportingApi.changeReportStatus).not.toHaveBeenCalled()
            })
        })
      },
    )

    describe('unauthorised users', () => {
      beforeEach(() => {
        setupAppForUser(mockUnauthorisedUser)
        makeReportValid()
      })

      describe.each(userActions.filter(({ code: userAction }) => !['view', 'edit'].includes(userAction)))(
        'cannot take action $code',
        ({ code: userAction }) => {
          it.each(statuses)('on a report with status $code', ({ code: status }) => {
            mockedReport.status = status
            incidentReportingApi.changeReportStatus.mockRejectedValue(new Error('should not be called'))

            const maybeValidPayload = { userAction } // doesn’t matter that it’s invalid since expectation is a specific error
            return request(app)
              .post(viewReportUrl)
              .send(maybeValidPayload)
              .expect(302)
              .expect(res => {
                expect(res.redirect).toBe(true)
                expect(res.header.location).toEqual('/sign-out')
                expect(incidentReportingApi.changeReportStatus).not.toHaveBeenCalled()
              })
          })
        },
      )
    })
  })
})
