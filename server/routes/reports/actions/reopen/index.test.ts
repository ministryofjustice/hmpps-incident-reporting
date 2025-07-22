import request from 'supertest'

import { appWithAllRoutes } from '../../../testutils/appSetup'
import { now } from '../../../../testutils/fakeClock'
import { IncidentReportingApi, type ReportWithDetails } from '../../../../data/incidentReportingApi'
import { convertReportWithDetailsDates } from '../../../../data/incidentReportingApiUtils'
import { mockReport } from '../../../../data/testData/incidentReporting'

import { mockReportingOfficer } from '../../../../data/testData/users'

jest.mock('../../../../data/prisonApi')
jest.mock('../../../../data/incidentReportingApi')
jest.mock('../../../../services/userService')

let incidentReportingApi: jest.Mocked<IncidentReportingApi>

beforeEach(() => {
  incidentReportingApi = IncidentReportingApi.prototype as jest.Mocked<IncidentReportingApi>
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('RO reopening a closed report', () => {
  let mockedReport: ReportWithDetails
  let reopenReportUrl: string

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
    incidentReportingApi.getReportById.mockResolvedValueOnce(mockedReport)
    reopenReportUrl = `/reports/${mockedReport.id}/reopen`
  })

  it.each([
    { currentStatus: 'CLOSED', newStatus: 'REOPENED' },
    { currentStatus: 'DUPLICATE', newStatus: 'NEEDS_UPDATING' },
    { currentStatus: 'NOT_REPORTABLE', newStatus: 'NEEDS_UPDATING' },
  ] as const)(
    'RO reopening a report with status: $currentStatus should change status to $newStatus',
    ({ currentStatus, newStatus }) => {
      mockedReport.status = currentStatus
      incidentReportingApi.changeReportStatus.mockResolvedValueOnce(undefined) // NB: response is ignored

      return request(appWithAllRoutes({ userSupplier: () => mockReportingOfficer }))
        .post(reopenReportUrl)
        .send({ userAction: 'recall' })
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
