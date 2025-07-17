import request from 'supertest'

import { PrisonApi } from '../../../../data/prisonApi'
import { appWithAllRoutes } from '../../../testutils/appSetup'
import { now } from '../../../../testutils/fakeClock'
import UserService from '../../../../services/userService'
import { type Status } from '../../../../reportConfiguration/constants'
import { IncidentReportingApi, ReportWithDetails } from '../../../../data/incidentReportingApi'
import { convertBasicReportDates, convertReportWithDetailsDates } from '../../../../data/incidentReportingApiUtils'
import { mockReport } from '../../../../data/testData/incidentReporting'

import { mockSharedUser } from '../../../../data/testData/manageUsers'
import { leeds, moorland } from '../../../../data/testData/prisonApi'
import { mockReportingOfficer } from '../../../../data/testData/users'

jest.mock('../../../../data/prisonApi')
jest.mock('../../../../data/incidentReportingApi')
jest.mock('../../../../services/userService')

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

describe('Request to remove report is submitted successfully and saves correct new status', () => {
  let mockedReport: ReportWithDetails
  let requestRemoveReportUrl: string

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
    incidentReportingApi.getReportWithDetailsById.mockReset()
    incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(mockedReport)
    requestRemoveReportUrl = `/reports/${mockedReport.id}/remove-report`
  })

  it.each([
    {
      currentStatus: 'DRAFT',
      removalType: 'not reportable',
      payload: { removeReportMethod: 'notReportable', notReportableComment: 'Why it is not' },
      newStatus: 'AWAITING_REVIEW',
    },
    {
      currentStatus: 'DRAFT',
      removalType: 'duplicate',
      payload: { removeReportMethod: 'duplicate', incidentReportNumber: '1234', duplicateComment: 'Why it is' },
      newStatus: 'AWAITING_REVIEW',
    },
    {
      currentStatus: 'NEEDS_UPDATING',
      removalType: 'not reportable',
      payload: { removeReportMethod: 'notReportable', notReportableComment: 'Why it is not' },
      newStatus: 'UPDATED',
    },
    {
      currentStatus: 'NEEDS_UPDATING',
      removalType: 'duplicate',
      payload: { removeReportMethod: 'duplicate', incidentReportNumber: '1234', duplicateComment: 'Why it is' },
      newStatus: 'UPDATED',
    },
    {
      currentStatus: 'REOPENED',
      removalType: 'not reportable',
      payload: { removeReportMethod: 'notReportable', notReportableComment: 'Why it is not' },
      newStatus: 'WAS_CLOSED',
    },
    {
      currentStatus: 'REOPENED',
      removalType: 'duplicate',
      payload: { removeReportMethod: 'duplicate', incidentReportNumber: '1234', duplicateComment: 'Why it is' },
      newStatus: 'WAS_CLOSED',
    },
  ])(
    'RO requesting removal of type $removalType changes status: $currentStatus to $newStatus',
    ({ currentStatus, payload, newStatus }) => {
      mockedReport.status = currentStatus as Status

      incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(mockedReport)
      incidentReportingApi.changeReportStatus.mockResolvedValueOnce(mockedReport) // NB: response is ignored

      if (payload.removeReportMethod === 'duplicate') {
        const mockedDuplicateReport = convertBasicReportDates(
          mockReport({ reportReference: '1234', reportDateAndTime: now }),
        )
        incidentReportingApi.getReportByReference.mockResolvedValueOnce(mockedDuplicateReport)
      }

      return request(appWithAllRoutes({ services: { userService }, userSupplier: () => mockReportingOfficer }))
        .post(requestRemoveReportUrl)
        .send(payload)
        .redirects(1)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('app-dashboard')
          expect(incidentReportingApi.changeReportStatus).toHaveBeenCalledWith(mockedReport.id, { newStatus })
        })
    },
  )
})
