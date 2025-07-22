import request from 'supertest'

import { PrisonApi } from '../../../data/prisonApi'
import { appWithAllRoutes } from '../../testutils/appSetup'
import { now } from '../../../testutils/fakeClock'
import UserService from '../../../services/userService'
import { type Status } from '../../../reportConfiguration/constants'
import { IncidentReportingApi, ReportWithDetails } from '../../../data/incidentReportingApi'
import { convertBasicReportDates, convertReportWithDetailsDates } from '../../../data/incidentReportingApiUtils'
import { mockReport } from '../../../data/testData/incidentReporting'

import { mockSharedUser } from '../../../data/testData/manageUsers'
import { leeds, moorland } from '../../../data/testData/prisonApi'
import { mockDataWarden, mockReportingOfficer } from '../../../data/testData/users'
import { makeSimpleQuestion } from '../../../data/testData/incidentReportingJest'

jest.mock('../../../data/prisonApi')
jest.mock('../../../data/incidentReportingApi')
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

describe('Report action form options', () => {
  let mockedReport: ReportWithDetails
  let viewReportUrl: string

  beforeEach(() => {
    mockedReport = convertReportWithDetailsDates(
      mockReport({
        reportReference: '6543',
        reportDateAndTime: now,
        type: 'ASSAULT_5',
        status: 'DRAFT',
        withDetails: true,
      }),
    )
    incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(mockedReport)
    viewReportUrl = `/reports/${mockedReport.id}`
  })

  it.each([
    {
      userType: 'Reporting officer',
      user: mockReportingOfficer,
      reportStatus: 'DRAFT',
      formOptions: ['Submit', 'Request to remove report'],
    },
    {
      userType: 'Reporting officer',
      user: mockReportingOfficer,
      reportStatus: 'NEEDS_UPDATING',
      formOptions: ['Resubmit', 'Describe what has changed in the report', 'Request to remove report'],
    },
    {
      userType: 'Reporting officer',
      user: mockReportingOfficer,
      reportStatus: 'REOPENED',
      formOptions: ['Resubmit', 'Describe what has changed in the report', 'Request to remove report'],
    },
    {
      userType: 'Reporting officer',
      user: mockReportingOfficer,
      reportStatus: 'AWAITING_REVIEW',
      formOptions: ['Change report'],
    },
    {
      userType: 'Reporting officer',
      user: mockReportingOfficer,
      reportStatus: 'UPDATED',
      formOptions: ['Change report'],
    },
    {
      userType: 'Reporting officer',
      user: mockReportingOfficer,
      reportStatus: 'WAS_CLOSED',
      formOptions: ['Change report'],
    },
    {
      userType: 'Reporting officer',
      user: mockReportingOfficer,
      reportStatus: 'CLOSED',
      formOptions: ['Reopen and change report'],
    },
    {
      userType: 'Reporting officer',
      user: mockReportingOfficer,
      reportStatus: 'DUPLICATE',
      formOptions: ['Reopen and change report'],
    },
    {
      userType: 'Reporting officer',
      user: mockReportingOfficer,
      reportStatus: 'NOT_REPORTABLE',
      formOptions: ['Reopen and change report'],
    },
    {
      userType: 'Data warden',
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
      userType: 'Data warden',
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
      userType: 'Data warden',
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
      userType: 'Data warden',
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
      userType: 'Data warden',
      user: mockDataWarden,
      reportStatus: 'NEEDS_UPDATING',
      formOptions: ['Change report status'],
    },
    { userType: 'Data warden', user: mockDataWarden, reportStatus: 'REOPENED', formOptions: ['Change report status'] },
    { userType: 'Data warden', user: mockDataWarden, reportStatus: 'CLOSED', formOptions: ['Change report status'] },
    { userType: 'Data warden', user: mockDataWarden, reportStatus: 'DUPLICATE', formOptions: ['Change report status'] },
    {
      userType: 'Data warden',
      user: mockDataWarden,
      reportStatus: 'NOT_REPORTABLE',
      formOptions: ['Change report status'],
    },
  ])(
    'The correct form options should display when $userType is viewing a report with the status: $reportStatus',
    ({ user, reportStatus, formOptions }) => {
      mockedReport.status = reportStatus as Status

      return request(appWithAllRoutes({ services: { userService }, userSupplier: () => user }))
        .get(viewReportUrl)
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          formOptions.forEach(option => expect(res.text).toContain(option))
        })
    },
  )

  it('Reporting office should not see any form options and see notification banner when report is on hold', () => {
    mockedReport.status = 'ON_HOLD'

    return request(appWithAllRoutes({ services: { userService }, userSupplier: () => mockReportingOfficer }))
      .get(viewReportUrl)
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('On hold')
        expect(res.text).toContain(
          'A data warden has placed this report on hold, if you need to make an update contact (email address)',
        )
        expect(res.text).not.toContain('Submit')
        expect(res.text).not.toContain('Resubmit')
        expect(res.text).not.toContain('Request to remove report')
      })
  })

  it('Data warden should not see any form options when report is in draft', () => {
    return request(appWithAllRoutes({ services: { userService }, userSupplier: () => mockDataWarden }))
      .get(viewReportUrl)
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(res => {
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
})

describe('Correct status submission or redirect for each form action', () => {
  let mockedReport: ReportWithDetails
  let viewReportUrl: string

  beforeEach(() => {
    mockedReport = convertReportWithDetailsDates(
      mockReport({
        reportReference: '6543',
        reportDateAndTime: now,
        type: 'ASSAULT_5',
        status: 'DRAFT',
        withDetails: true,
      }),
    )
    mockedReport.questions = [
      makeSimpleQuestion('61279', 'WHAT WAS THE MAIN MANAGEMENT OUTCOME OF THE INCIDENT', ['IEP REGRESSION', '213063']),
      makeSimpleQuestion('61280', 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES', ['NO', '213067']),
      makeSimpleQuestion('61281', 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT', ['NO', '213069']),
      makeSimpleQuestion('61282', 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED', ['NO', '213071']),
      makeSimpleQuestion('61283', 'IS THE LOCATION OF THE INCDENT KNOWN', ['NO', '213073']),
      makeSimpleQuestion('61285', 'WAS THIS A SEXUAL ASSAULT', ['NO', '213112']),
      makeSimpleQuestion('61286', 'DID THE ASSAULT OCCUR DURING A FIGHT', ['NO', '213114']),
      makeSimpleQuestion('61287', 'WHAT TYPE OF ASSAULT WAS IT', ['PRISONER ON STAFF', '213116']),
      makeSimpleQuestion('61289', 'DESCRIBE THE TYPE OF STAFF', ['OPERATIONAL STAFF - OTHER', '213122']),
      makeSimpleQuestion('61290', 'WAS SPITTING USED IN THIS INCIDENT', ['NO', '213125']),
      makeSimpleQuestion('61294', 'WERE ANY WEAPONS USED', ['NO', '213136']),
      makeSimpleQuestion('61296', 'WERE ANY INJURIES RECEIVED DURING THIS INCIDENT', ['NO', '213150']),
      makeSimpleQuestion('61306', 'ARE THERE ANY STAFF NOW OFF DUTY AS A RESULT OF THIS INCIDENT', ['NO', '213200']),
      makeSimpleQuestion('61307', 'ARE ANY STAFF ON SICK LEAVE AS A RESULT OF THIS INCIDENT', ['NO', '213202']),
      makeSimpleQuestion('61308', 'DID THE ASSAULT OCCUR IN PUBLIC VIEW', ['YES', '213203']),
      makeSimpleQuestion('61309', 'IS THERE ANY AUDIO OR VISUAL FOOTAGE OF THE ASSAULT', ['NO', '213205']),
      makeSimpleQuestion('61311', 'WAS THERE AN APPARENT REASON FOR THE ASSAULT', ['NO', '213213']),
    ]
    incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(mockedReport)
    viewReportUrl = `/reports/${mockedReport.id}`
  })

  describe('Transitions with no additional comment and page redirects to reports page', () => {
    it.each([
      {
        userType: 'Reporting officer',
        user: mockReportingOfficer,
        currentStatus: 'DRAFT',
        userAction: 'requestReview',
        newStatus: 'AWAITING_REVIEW',
      },
      {
        userType: 'Data warden',
        user: mockDataWarden,
        currentStatus: 'AWAITING_REVIEW',
        userAction: 'close',
        newStatus: 'CLOSED',
      },
      {
        userType: 'Data warden',
        user: mockDataWarden,
        currentStatus: 'ON_HOLD',
        userAction: 'close',
        newStatus: 'CLOSED',
      },
      {
        userType: 'Data warden',
        user: mockDataWarden,
        currentStatus: 'UPDATED',
        userAction: 'close',
        newStatus: 'CLOSED',
      },
      {
        userType: 'Data warden',
        user: mockDataWarden,
        currentStatus: 'WAS_CLOSED',
        userAction: 'close',
        newStatus: 'CLOSED',
      },
    ] as const)(
      '$userType submitting action $userAction for a report with status: $currentStatus should change status to $newStatus',
      ({ user, currentStatus, userAction, newStatus }) => {
        mockedReport.status = currentStatus

        incidentReportingApi.changeReportStatus.mockResolvedValueOnce(mockedReport) // NB: response is ignored

        return request(appWithAllRoutes({ services: { userService }, userSupplier: () => user }))
          .post(viewReportUrl)
          .send({ userAction })
          .redirects(1)
          .expect(200)
          .expect(res => {
            expect(res.text).toContain('app-dashboard')
            expect(incidentReportingApi.changeReportStatus).toHaveBeenCalledWith(mockedReport.id, { newStatus })
          })
      },
    )
  })

  describe('Transitions with no additional comment and page does not redirect', () => {
    it.each([
      {
        userType: 'Reporting officer',
        user: mockReportingOfficer,
        currentStatus: 'AWAITING_REVIEW',
        userAction: 'recall',
        newStatus: 'DRAFT',
      },
      {
        userType: 'Reporting officer',
        user: mockReportingOfficer,
        currentStatus: 'UPDATED',
        userAction: 'recall',
        newStatus: 'NEEDS_UPDATING',
      },
      {
        userType: 'Reporting officer',
        user: mockReportingOfficer,
        currentStatus: 'WAS_CLOSED',
        userAction: 'recall',
        newStatus: 'REOPENED',
      },
      {
        userType: 'Data warden',
        user: mockDataWarden,
        currentStatus: 'NEEDS_UPDATING',
        userAction: 'recall',
        newStatus: 'UPDATED',
      },
      {
        userType: 'Data warden',
        user: mockDataWarden,
        currentStatus: 'CLOSED',
        userAction: 'recall',
        newStatus: 'UPDATED',
      },
      {
        userType: 'Data warden',
        user: mockDataWarden,
        currentStatus: 'DUPLICATE',
        userAction: 'recall',
        newStatus: 'UPDATED',
      },
      {
        userType: 'Data warden',
        user: mockDataWarden,
        currentStatus: 'NOT_REPORTABLE',
        userAction: 'recall',
        newStatus: 'UPDATED',
      },
      {
        userType: 'Data warden',
        user: mockDataWarden,
        currentStatus: 'REOPENED',
        userAction: 'recall',
        newStatus: 'WAS_CLOSED',
      },
    ])(
      '$userType submitting action $userAction (not requiring a comment) for a report with status: $currentStatus should change status to $newStatus',
      ({ user, currentStatus, userAction, newStatus }) => {
        mockedReport.status = currentStatus as Status

        incidentReportingApi.changeReportStatus.mockResolvedValueOnce(mockedReport) // NB: response is ignored

        return request(appWithAllRoutes({ services: { userService }, userSupplier: () => user }))
          .post(viewReportUrl)
          .send({ userAction })
          .redirects(0)
          .expect(302)
          .expect(res => {
            expect(res.redirect).toBe(true)
            expect(res.header.location).toEqual(`/reports/${mockedReport.id}`)
            expect(incidentReportingApi.changeReportStatus).toHaveBeenCalledWith(mockedReport.id, { newStatus })
          })
      },
    )
  })

  describe('Transitions with an additional comment and page redirects to reports page ', () => {
    it.each([
      {
        userType: 'Reporting officer',
        user: mockReportingOfficer,
        currentStatus: 'NEEDS_UPDATING',
        userAction: 'requestReview',
        userComment: 'Additional info',
        newStatus: 'UPDATED',
      },
      {
        userType: 'Reporting officer',
        user: mockReportingOfficer,
        currentStatus: 'REOPENED',
        userAction: 'requestReview',
        userComment: 'Additional info',
        newStatus: 'WAS_CLOSED',
      },
      {
        userType: 'Data warden',
        user: mockDataWarden,
        currentStatus: 'AWAITING_REVIEW',
        userAction: 'requestCorrection',
        userComment: 'Additional info',
        newStatus: 'NEEDS_UPDATING',
      },
      {
        userType: 'Data warden',
        user: mockDataWarden,
        currentStatus: 'AWAITING_REVIEW',
        userAction: 'hold',
        userComment: 'Additional info',
        newStatus: 'ON_HOLD',
      },
      {
        userType: 'Data warden',
        user: mockDataWarden,
        currentStatus: 'AWAITING_REVIEW',
        userAction: 'markNotReportable',
        userComment: 'Additional info',
        newStatus: 'NOT_REPORTABLE',
      },
      {
        userType: 'Data warden',
        user: mockDataWarden,
        currentStatus: 'ON_HOLD',
        userAction: 'requestCorrection',
        userComment: 'Additional info',
        newStatus: 'NEEDS_UPDATING',
      },
      {
        userType: 'Data warden',
        user: mockDataWarden,
        currentStatus: 'ON_HOLD',
        userAction: 'markNotReportable',
        userComment: 'Additional info',
        newStatus: 'NOT_REPORTABLE',
      },
      {
        userType: 'Data warden',
        user: mockDataWarden,
        currentStatus: 'UPDATED',
        userAction: 'requestCorrection',
        userComment: 'Additional info',
        newStatus: 'NEEDS_UPDATING',
      },
      {
        userType: 'Data warden',
        user: mockDataWarden,
        currentStatus: 'UPDATED',
        userAction: 'hold',
        userComment: 'Additional info',
        newStatus: 'ON_HOLD',
      },
      {
        userType: 'Data warden',
        user: mockDataWarden,
        currentStatus: 'UPDATED',
        userAction: 'markNotReportable',
        userComment: 'Additional info',
        newStatus: 'NOT_REPORTABLE',
      },
      {
        userType: 'Data warden',
        user: mockDataWarden,
        currentStatus: 'WAS_CLOSED',
        userAction: 'requestCorrection',
        userComment: 'Additional info',
        newStatus: 'REOPENED',
      },
      {
        userType: 'Data warden',
        user: mockDataWarden,
        currentStatus: 'WAS_CLOSED',
        userAction: 'markNotReportable',
        userComment: 'Additional info',
        newStatus: 'NOT_REPORTABLE',
      },
    ])(
      '$userType submitting action $userAction for a report with status: $currentStatus should change status to $newStatus',
      ({ user, currentStatus, userAction, userComment, newStatus }) => {
        mockedReport.status = currentStatus as Status

        incidentReportingApi.changeReportStatus.mockResolvedValueOnce(mockedReport) // NB: response is ignored

        return request(appWithAllRoutes({ services: { userService }, userSupplier: () => user }))
          .post(viewReportUrl)
          .send({ userAction, [`${userAction}Comment`]: userComment })
          .redirects(1)
          .expect(200)
          .expect(res => {
            expect(res.text).toContain('app-dashboard')
            expect(incidentReportingApi.changeReportStatus).toHaveBeenCalledWith(mockedReport.id, { newStatus })
          })
      },
    )
  })

  describe('Mark as a duplicate', () => {
    it.each([
      {
        userType: 'Data warden',
        user: mockDataWarden,
        currentStatus: 'AWAITING_REVIEW',
        userAction: 'markDuplicate',
        originalReportReference: '1234',
        userComment: 'Additional info',
        newStatus: 'DUPLICATE',
      },
      {
        userType: 'Data warden',
        user: mockDataWarden,
        currentStatus: 'ON_HOLD',
        userAction: 'markDuplicate',
        originalReportReference: '1234',
        userComment: 'Additional info',
        newStatus: 'DUPLICATE',
      },
      {
        userType: 'Data warden',
        user: mockDataWarden,
        currentStatus: 'UPDATED',
        userAction: 'markDuplicate',
        originalReportReference: '1234',
        userComment: 'Additional info',
        newStatus: 'DUPLICATE',
      },
      {
        userType: 'Data warden',
        user: mockDataWarden,
        currentStatus: 'WAS_CLOSED',
        userAction: 'markDuplicate',
        originalReportReference: '1234',
        userComment: 'Additional info',
        newStatus: 'DUPLICATE',
      },
    ])(
      '$userType submitting action $userAction for a report with status: $currentStatus should change status to $newStatus',
      ({ user, currentStatus, userAction, originalReportReference, userComment, newStatus }) => {
        mockedReport.status = currentStatus as Status

        incidentReportingApi.changeReportStatus.mockResolvedValueOnce(mockedReport) // NB: response is ignored

        const mockedDuplicateReport = convertBasicReportDates(
          mockReport({ reportReference: '1234', reportDateAndTime: now }),
        )
        incidentReportingApi.getReportByReference.mockResolvedValueOnce(mockedDuplicateReport)

        return request(appWithAllRoutes({ services: { userService }, userSupplier: () => user }))
          .post(viewReportUrl)
          .send({ userAction, originalReportReference, [`${userAction}Comment`]: userComment })
          .redirects(1)
          .expect(200)
          .expect(res => {
            expect(res.text).toContain('app-dashboard')
            expect(incidentReportingApi.changeReportStatus).toHaveBeenCalledWith(mockedReport.id, { newStatus })
          })
      },
    )
  })

  describe('Transitions where reporting officer is redirected to another page', () => {
    it.each([
      { currentStatus: 'DRAFT', userAction: 'requestRemoval', redirectedPage: 'app-remove-report-request' },
      { currentStatus: 'NEEDS_UPDATING', userAction: 'requestRemoval', redirectedPage: 'app-remove-report-request' },
      { currentStatus: 'REOPENED', userAction: 'requestRemoval', redirectedPage: 'app-remove-report-request' },
      { currentStatus: 'CLOSED', userAction: 'recall', redirectedPage: 'app-reopen-report' },
      { currentStatus: 'DUPLICATE', userAction: 'recall', redirectedPage: 'app-reopen-report' },
      { currentStatus: 'NOT_REPORTABLE', userAction: 'recall', redirectedPage: 'app-reopen-report' },
    ] as const)(
      '$userType submitting action $userAction for a report with status: $currentStatus should change status to $newStatus',
      ({ currentStatus, userAction, redirectedPage }) => {
        mockedReport.status = currentStatus

        incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(mockedReport)
        incidentReportingApi.getReportById.mockResolvedValueOnce(mockedReport)

        return request(appWithAllRoutes({ services: { userService }, userSupplier: () => mockReportingOfficer }))
          .post(viewReportUrl)
          .send({ userAction })
          .redirects(1)
          .expect(200)
          .expect(res => {
            expect(res.text).toContain(redirectedPage)
          })
      },
    )
  })
})
