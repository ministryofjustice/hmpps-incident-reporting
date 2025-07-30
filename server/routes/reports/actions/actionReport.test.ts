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
import { convertBasicReportDates, convertReportWithDetailsDates } from '../../../data/incidentReportingApiUtils'
import * as reportValidity from '../../../data/reportValidity'
import { mockErrorResponse, mockReport } from '../../../data/testData/incidentReporting'
import { mockSharedUser } from '../../../data/testData/manageUsers'
import { leeds, moorland } from '../../../data/testData/prisonApi'
import { mockThrownError } from '../../../data/testData/thrownErrors'
import { mockDataWarden, mockReportingOfficer, mockHqViewer, mockUnauthorisedUser } from '../../../data/testData/users'
import * as correctionRequestPlaceholder from './correctionRequestPlaceholder'

jest.mock('../../../data/incidentReportingApi')
jest.mock('../../../data/prisonApi')
jest.mock('../../../data/reportValidity')
jest.mock('../../../services/userService')
jest.mock('./correctionRequestPlaceholder')

let incidentReportingApi: jest.Mocked<IncidentReportingApi>
let incidentReportingRelatedObjects: jest.Mocked<
  RelatedObjects<CorrectionRequest, AddCorrectionRequestRequest, UpdateCorrectionRequestRequest>
>
let userService: jest.Mocked<UserService>
let prisonApi: jest.Mocked<PrisonApi>

const { placeholderForCorrectionRequest } = correctionRequestPlaceholder as jest.Mocked<
  typeof import('./correctionRequestPlaceholder')
>

beforeEach(() => {
  incidentReportingApi = IncidentReportingApi.prototype as jest.Mocked<IncidentReportingApi>
  incidentReportingRelatedObjects = RelatedObjects.prototype as jest.Mocked<
    RelatedObjects<CorrectionRequest, AddCorrectionRequestRequest, UpdateCorrectionRequestRequest>
  >
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore need to mock a getter method
  incidentReportingApi.correctionRequests = incidentReportingRelatedObjects

  userService = UserService.prototype as jest.Mocked<UserService>
  userService.getUsers.mockResolvedValueOnce({
    [mockSharedUser.username]: mockSharedUser,
  })

  const prisons = {
    LEI: leeds,
    MDI: moorland,
  }
  prisonApi = PrisonApi.prototype as jest.Mocked<PrisonApi>
  prisonApi.getPrisons.mockResolvedValue(prisons)

  placeholderForCorrectionRequest.mockReturnValue('PLACEHOLDER')
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
        formOptions: ['Submit', 'Remove it as it’s a duplicate or not reportable'],
      },
      {
        userType: 'reporting officers',
        user: mockReportingOfficer,
        reportStatus: 'NEEDS_UPDATING',
        formOptions: [
          'Resubmit it with updated information',
          'Explain what you have changed in the report',
          'Remove it as it’s a duplicate or not reportable',
        ],
      },
      {
        userType: 'reporting officers',
        user: mockReportingOfficer,
        reportStatus: 'REOPENED',
        formOptions: [
          'Resubmit it with updated information',
          'Explain what you have changed in the report',
          'Remove it as it’s a duplicate or not reportable',
        ],
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
          'Explain why you’re sending the report back',
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
          'Explain why you’re sending the report back',
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
          'Explain why you’re sending the report back',
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
            userAction: 'REQUEST_REVIEW',
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
            userAction: 'REQUEST_REMOVAL',
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
          { userAction: 'RECALL', forbiddenStatuses: ['DRAFT', 'NEEDS_UPDATING', 'REOPENED', 'ON_HOLD'] },
          { userAction: 'REQUEST_CORRECTION', forbiddenStatuses: 'all' },
          { userAction: 'CLOSE', forbiddenStatuses: 'all' },
          { userAction: 'MARK_DUPLICATE', forbiddenStatuses: 'all' },
          { userAction: 'MARK_NOT_REPORTABLE', forbiddenStatuses: 'all' },
          { userAction: 'HOLD', forbiddenStatuses: 'all' },
        ],
      },
      {
        userType: 'data wardens',
        user: mockDataWarden,
        forbiddenTransitions: [
          { userAction: 'REQUEST_REVIEW', forbiddenStatuses: 'all' },
          { userAction: 'REQUEST_REMOVAL', forbiddenStatuses: 'all' },
          {
            userAction: 'REQUEST_CORRECTION',
            forbiddenStatuses: ['DRAFT', 'NEEDS_UPDATING', 'REOPENED', 'DUPLICATE', 'NOT_REPORTABLE', 'CLOSED'],
          },
          { userAction: 'RECALL', forbiddenStatuses: ['DRAFT', 'AWAITING_REVIEW', 'UPDATED', 'ON_HOLD', 'WAS_CLOSED'] },
          {
            userAction: 'CLOSE',
            forbiddenStatuses: ['DRAFT', 'NEEDS_UPDATING', 'REOPENED', 'DUPLICATE', 'NOT_REPORTABLE', 'CLOSED'],
          },
          {
            userAction: 'MARK_DUPLICATE',
            forbiddenStatuses: ['DRAFT', 'NEEDS_UPDATING', 'REOPENED', 'DUPLICATE', 'NOT_REPORTABLE', 'CLOSED'],
          },
          {
            userAction: 'MARK_NOT_REPORTABLE',
            forbiddenStatuses: ['DRAFT', 'NEEDS_UPDATING', 'REOPENED', 'DUPLICATE', 'NOT_REPORTABLE', 'CLOSED'],
          },
          {
            userAction: 'HOLD',
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
        incidentReportingRelatedObjects.addToReport.mockRejectedValueOnce(new Error('should not be called'))
        incidentReportingApi.changeReportStatus.mockRejectedValueOnce(new Error('should not be called'))

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

    const actionsRequiringValidReports = ['REQUEST_REVIEW', 'CLOSE']
    // TODO: this will probably turn into a flag on the report so closing will not need the checks

    interface TransitionScenarios {
      userType: string
      user: Express.User
      currentStatus: Status
      userAction: UserAction
      comment: 'not allowed' | 'optional' | 'required'
      needsOriginalReportReference?: boolean
      postsCorrectionRequest?: AddCorrectionRequestRequest
      newStatus: Status
      redirectedPage: 'dashboard' | 'view-report'
    }
    const transitionScenarios: TransitionScenarios[] = [
      // cannot add comment & redirect to dashboard
      {
        userType: 'reporting officers',
        user: mockReportingOfficer,
        currentStatus: 'DRAFT',
        userAction: 'REQUEST_REVIEW',
        comment: 'not allowed',
        newStatus: 'AWAITING_REVIEW',
        redirectedPage: 'dashboard',
      },
      {
        userType: 'data wardens',
        user: mockDataWarden,
        currentStatus: 'AWAITING_REVIEW',
        userAction: 'CLOSE',
        comment: 'not allowed',
        newStatus: 'CLOSED',
        redirectedPage: 'dashboard',
      },
      {
        userType: 'data wardens',
        user: mockDataWarden,
        currentStatus: 'ON_HOLD',
        userAction: 'CLOSE',
        comment: 'not allowed',
        newStatus: 'CLOSED',
        redirectedPage: 'dashboard',
      },
      {
        userType: 'data wardens',
        user: mockDataWarden,
        currentStatus: 'UPDATED',
        userAction: 'CLOSE',
        comment: 'not allowed',
        newStatus: 'CLOSED',
        redirectedPage: 'dashboard',
      },
      {
        userType: 'data wardens',
        user: mockDataWarden,
        currentStatus: 'WAS_CLOSED',
        userAction: 'CLOSE',
        comment: 'not allowed',
        newStatus: 'CLOSED',
        redirectedPage: 'dashboard',
      },
      // cannot add comment & refresh report page
      {
        userType: 'reporting officers',
        user: mockReportingOfficer,
        currentStatus: 'AWAITING_REVIEW',
        userAction: 'RECALL',
        comment: 'not allowed',
        newStatus: 'DRAFT',
        redirectedPage: 'view-report',
      },
      {
        userType: 'reporting officers',
        user: mockReportingOfficer,
        currentStatus: 'UPDATED',
        userAction: 'RECALL',
        comment: 'not allowed',
        newStatus: 'NEEDS_UPDATING',
        redirectedPage: 'view-report',
      },
      {
        userType: 'reporting officers',
        user: mockReportingOfficer,
        currentStatus: 'WAS_CLOSED',
        userAction: 'RECALL',
        comment: 'not allowed',
        newStatus: 'REOPENED',
        redirectedPage: 'view-report',
      },
      {
        userType: 'data wardens',
        user: mockDataWarden,
        currentStatus: 'NEEDS_UPDATING',
        userAction: 'RECALL',
        comment: 'not allowed',
        newStatus: 'UPDATED',
        redirectedPage: 'view-report',
      },
      {
        userType: 'data wardens',
        user: mockDataWarden,
        currentStatus: 'CLOSED',
        userAction: 'RECALL',
        comment: 'not allowed',
        newStatus: 'UPDATED',
        redirectedPage: 'view-report',
      },
      {
        userType: 'data wardens',
        user: mockDataWarden,
        currentStatus: 'DUPLICATE',
        userAction: 'RECALL',
        comment: 'not allowed',
        newStatus: 'UPDATED',
        redirectedPage: 'view-report',
      },
      {
        userType: 'data wardens',
        user: mockDataWarden,
        currentStatus: 'NOT_REPORTABLE',
        userAction: 'RECALL',
        comment: 'not allowed',
        newStatus: 'UPDATED',
        redirectedPage: 'view-report',
      },
      {
        userType: 'data wardens',
        user: mockDataWarden,
        currentStatus: 'REOPENED',
        userAction: 'RECALL',
        comment: 'not allowed',
        newStatus: 'WAS_CLOSED',
        redirectedPage: 'view-report',
      },
      // comment may be required & redirect to dashboard
      {
        userType: 'reporting officers',
        user: mockReportingOfficer,
        currentStatus: 'NEEDS_UPDATING',
        userAction: 'REQUEST_REVIEW',
        comment: 'required',
        postsCorrectionRequest: {
          userType: 'REPORTING_OFFICER',
          userAction: 'REQUEST_REVIEW',
          descriptionOfChange: 'My comment on this action',
        },
        newStatus: 'UPDATED',
        redirectedPage: 'dashboard',
      },
      {
        userType: 'reporting officers',
        user: mockReportingOfficer,
        currentStatus: 'REOPENED',
        userAction: 'REQUEST_REVIEW',
        comment: 'required',
        postsCorrectionRequest: {
          userType: 'REPORTING_OFFICER',
          userAction: 'REQUEST_REVIEW',
          descriptionOfChange: 'My comment on this action',
        },
        newStatus: 'WAS_CLOSED',
        redirectedPage: 'dashboard',
      },
      {
        userType: 'data wardens',
        user: mockDataWarden,
        currentStatus: 'AWAITING_REVIEW',
        userAction: 'REQUEST_CORRECTION',
        comment: 'required',
        postsCorrectionRequest: {
          userType: 'DATA_WARDEN',
          userAction: 'REQUEST_CORRECTION',
          descriptionOfChange: 'My comment on this action',
        },
        newStatus: 'NEEDS_UPDATING',
        redirectedPage: 'dashboard',
      },
      {
        userType: 'data wardens',
        user: mockDataWarden,
        currentStatus: 'AWAITING_REVIEW',
        userAction: 'HOLD',
        comment: 'required',
        postsCorrectionRequest: {
          userType: 'DATA_WARDEN',
          userAction: 'HOLD',
          descriptionOfChange: 'My comment on this action',
        },
        newStatus: 'ON_HOLD',
        redirectedPage: 'dashboard',
      },
      {
        userType: 'data wardens',
        user: mockDataWarden,
        currentStatus: 'AWAITING_REVIEW',
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
        userType: 'data wardens',
        user: mockDataWarden,
        currentStatus: 'ON_HOLD',
        userAction: 'REQUEST_CORRECTION',
        comment: 'required',
        postsCorrectionRequest: {
          userType: 'DATA_WARDEN',
          userAction: 'REQUEST_CORRECTION',
          descriptionOfChange: 'My comment on this action',
        },
        newStatus: 'NEEDS_UPDATING',
        redirectedPage: 'dashboard',
      },
      {
        userType: 'data wardens',
        user: mockDataWarden,
        currentStatus: 'ON_HOLD',
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
        userType: 'data wardens',
        user: mockDataWarden,
        currentStatus: 'UPDATED',
        userAction: 'REQUEST_CORRECTION',
        comment: 'required',
        postsCorrectionRequest: {
          userType: 'DATA_WARDEN',
          userAction: 'REQUEST_CORRECTION',
          descriptionOfChange: 'My comment on this action',
        },
        newStatus: 'NEEDS_UPDATING',
        redirectedPage: 'dashboard',
      },
      {
        userType: 'data wardens',
        user: mockDataWarden,
        currentStatus: 'UPDATED',
        userAction: 'HOLD',
        comment: 'required',
        postsCorrectionRequest: {
          userType: 'DATA_WARDEN',
          userAction: 'HOLD',
          descriptionOfChange: 'My comment on this action',
        },
        newStatus: 'ON_HOLD',
        redirectedPage: 'dashboard',
      },
      {
        userType: 'data wardens',
        user: mockDataWarden,
        currentStatus: 'UPDATED',
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
        userType: 'data wardens',
        user: mockDataWarden,
        currentStatus: 'WAS_CLOSED',
        userAction: 'REQUEST_CORRECTION',
        comment: 'required',
        postsCorrectionRequest: {
          userType: 'DATA_WARDEN',
          userAction: 'REQUEST_CORRECTION',
          descriptionOfChange: 'My comment on this action',
        },
        newStatus: 'REOPENED',
        redirectedPage: 'dashboard',
      },
      {
        userType: 'data wardens',
        user: mockDataWarden,
        currentStatus: 'WAS_CLOSED',
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
      // original report reference is needed
      {
        userType: 'data wardens',
        user: mockDataWarden,
        currentStatus: 'AWAITING_REVIEW',
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
      {
        userType: 'data wardens',
        user: mockDataWarden,
        currentStatus: 'ON_HOLD',
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
      {
        userType: 'data wardens',
        user: mockDataWarden,
        currentStatus: 'UPDATED',
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
      {
        userType: 'data wardens',
        user: mockDataWarden,
        currentStatus: 'WAS_CLOSED',
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
      'when $userType try to perform $userAction on report with status $currentStatus when a comment is $comment',
      ({
        user,
        currentStatus,
        userAction,
        comment,
        needsOriginalReportReference,
        postsCorrectionRequest,
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
          setupAppForUser(user)
          mockedReport.status = currentStatus
          expectedRedirect = redirectedPage === 'dashboard' ? '/reports' : `/reports/${mockedReport.id}`

          incidentReportingApi.getReportByReference.mockRejectedValueOnce(new Error('should not be called'))
        })

        const mockedDuplicateReport = convertBasicReportDates(
          mockReport({ reportReference: '1234', reportDateAndTime: now }),
        )
        function makeOriginalReportReferenceExistIfNeeded() {
          if (needsOriginalReportReference) {
            incidentReportingApi.getReportByReference.mockReset()
            incidentReportingApi.getReportByReference.mockResolvedValueOnce(mockedDuplicateReport)
          }
        }

        it(`should succeed changing the status to ${newStatus} if the report is valid`, () => {
          makeReportValid()
          makeOriginalReportReferenceExistIfNeeded()
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
              if (userAction === 'REQUEST_REVIEW') {
                expect(incidentReportingApi.updateReport).toHaveBeenCalledWith(mockedReport.id, {
                  title: 'Assault: Arnold A1111AA, Benjamin A2222BB (Moorland (HMP & YOI))',
                })
              } else {
                expect(incidentReportingApi.updateReport).not.toHaveBeenCalled()
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
          it('should not be allowed if report is invalid', () => {
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

        if (comment === 'required') {
          it('should not be allowed if comment is missing', () => {
            makeReportValid()
            makeOriginalReportReferenceExistIfNeeded()
            incidentReportingRelatedObjects.addToReport.mockRejectedValue(new Error('should not be called'))
            incidentReportingApi.changeReportStatus.mockRejectedValue(new Error('should not be called'))

            return request(app)
              .post(viewReportUrl)
              .send({
                ...validPayload,
                [`${userAction}_COMMENT`]: '',
              } satisfies Payload)
              .expect(200)
              .expect(res => {
                expect(res.text).toContain('There is a problem')
                if (userAction === 'REQUEST_REVIEW') {
                  expect(res.text).toContain('Enter what has changed in the report')
                  expect(res.text).not.toContain('Please enter a comment')
                } else if (userAction === 'REQUEST_CORRECTION') {
                  expect(res.text).toContain('Add information to explain why you’re sending the report back')
                  expect(res.text).not.toContain('Please enter a comment')
                } else if (userAction === 'HOLD') {
                  expect(res.text).toContain('Add information to explain why you’re putting the report on hold')
                  expect(res.text).not.toContain('Please enter a comment')
                } else if (userAction === 'MARK_NOT_REPORTABLE') {
                  expect(res.text).toContain('Describe why incident is not reportable')
                  expect(res.text).not.toContain('Please enter a comment')
                } else {
                  // fallback; doesn’t currently appear
                  expect(res.text).toContain('Please enter a comment')
                }
                expect(incidentReportingApi.updateReport).not.toHaveBeenCalled()
                expect(incidentReportingRelatedObjects.addToReport).not.toHaveBeenCalled()
                expect(incidentReportingApi.changeReportStatus).not.toHaveBeenCalled()
              })
          })
        } else if (comment === 'optional') {
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

    interface RedirectScenarios {
      currentStatus: Status
      userAction: UserAction
      redirectedPage: string
    }
    const redirectScenarios: RedirectScenarios[] = [
      { currentStatus: 'DRAFT', userAction: 'REQUEST_REMOVAL', redirectedPage: 'request-remove' },
      { currentStatus: 'NEEDS_UPDATING', userAction: 'REQUEST_REMOVAL', redirectedPage: 'request-remove' },
      { currentStatus: 'REOPENED', userAction: 'REQUEST_REMOVAL', redirectedPage: 'request-remove' },
      { currentStatus: 'CLOSED', userAction: 'RECALL', redirectedPage: 'reopen' },
      { currentStatus: 'DUPLICATE', userAction: 'RECALL', redirectedPage: 'reopen' },
      { currentStatus: 'NOT_REPORTABLE', userAction: 'RECALL', redirectedPage: 'reopen' },
    ]
    describe.each(redirectScenarios)(
      'when reporting officers try to perform $userAction on report with status $currentStatus',
      ({ currentStatus, userAction, redirectedPage }) => {
        beforeEach(() => {
          setupAppForUser(mockReportingOfficer)
          mockedReport.status = currentStatus
        })

        it('should succeed with no status change', () => {
          incidentReportingRelatedObjects.addToReport.mockRejectedValue(new Error('should not be called'))
          incidentReportingApi.changeReportStatus.mockRejectedValue(new Error('should not be called'))

          return request(app)
            .post(viewReportUrl)
            .send({ userAction })
            .expect(302)
            .expect(res => {
              expect(res.redirect).toBe(true)
              expect(res.header.location).toEqual(`/reports/${mockedReport.id}/${redirectedPage}`)
              expect(incidentReportingRelatedObjects.addToReport).not.toHaveBeenCalled()
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
