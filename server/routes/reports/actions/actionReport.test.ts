import type { Express } from 'express'
import request from 'supertest'

import { PrisonApi } from '../../../data/prisonApi'
import { appWithAllRoutes } from '../../testutils/appSetup'
import { now } from '../../../testutils/fakeClock'
import UserService from '../../../services/userService'
import { type Status } from '../../../reportConfiguration/constants'
import { IncidentReportingApi } from '../../../data/incidentReportingApi'
import { convertReportWithDetailsDates } from '../../../data/incidentReportingApiUtils'
import { mockReport } from '../../../data/testData/incidentReporting'

import { mockSharedUser } from '../../../data/testData/manageUsers'
import { leeds, moorland } from '../../../data/testData/prisonApi'
import { mockDataWarden, mockReportingOfficer } from '../../../data/testData/users'

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

describe('Action form options', () => {
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
      const mockedReport = convertReportWithDetailsDates(
        mockReport({
          reportReference: '6543',
          reportDateAndTime: now,
          withDetails: true,
          status: reportStatus as Status,
        }),
      )
      incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(mockedReport)
      const viewReportUrl = `/reports/${mockedReport.id}`

      return request(appWithAllRoutes({ services: { userService }, userSupplier: () => user }))
        .get(viewReportUrl)
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          formOptions.forEach(option => expect(res.text).toContain(option))
        })
    },
  )

  it('Reporting office should not see any form options and see notification banner', () => {
    const mockedReport = convertReportWithDetailsDates(
      mockReport({ reportReference: '6543', reportDateAndTime: now, withDetails: true, status: 'ON_HOLD' }),
    )
    incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(mockedReport)
    const viewReportUrl = `/reports/${mockedReport.id}`

    return request(appWithAllRoutes({ services: { userService }, userSupplier: () => mockReportingOfficer }))
      .get(viewReportUrl)
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('On hold')
        expect(res.text).toContain(
          'A data warden has placed this report on hold, if you need to make an update contact email address',
        )
        expect(res.text).not.toContain('Submit')
        expect(res.text).not.toContain('Resubmit')
        expect(res.text).not.toContain('Request to remove report')
      })
  })

  it('Data warden should not see any form options', () => {
    const mockedReport = convertReportWithDetailsDates(
      mockReport({ reportReference: '6543', reportDateAndTime: now, withDetails: true, status: 'ON_HOLD' }),
    )
    incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(mockedReport)
    const viewReportUrl = `/reports/${mockedReport.id}`

    return request(appWithAllRoutes({ services: { userService }, userSupplier: () => mockReportingOfficer }))
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
