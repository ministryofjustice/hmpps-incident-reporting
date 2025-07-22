import request from 'supertest'

import { appWithAllRoutes } from '../../../testutils/appSetup'
import { now } from '../../../../testutils/fakeClock'
import { IncidentReportingApi, type ReportWithDetails } from '../../../../data/incidentReportingApi'
import { convertBasicReportDates, convertReportWithDetailsDates } from '../../../../data/incidentReportingApiUtils'
import { mockReport } from '../../../../data/testData/incidentReporting'

import { mockReportingOfficer } from '../../../../data/testData/users'

jest.mock('../../../../data/incidentReportingApi')

let incidentReportingApi: jest.Mocked<IncidentReportingApi>

beforeEach(() => {
  incidentReportingApi = IncidentReportingApi.prototype as jest.Mocked<IncidentReportingApi>
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
    incidentReportingApi.getReportById.mockResolvedValueOnce(mockedReport)
    requestRemoveReportUrl = `/reports/${mockedReport.id}/request-remove`
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
      payload: { removeReportMethod: 'duplicate', originalReportReference: '1234', duplicateComment: 'Why it is' },
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
      payload: { removeReportMethod: 'duplicate', originalReportReference: '1234', duplicateComment: 'Why it is' },
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
      payload: { removeReportMethod: 'duplicate', originalReportReference: '1234', duplicateComment: 'Why it is' },
      newStatus: 'WAS_CLOSED',
    },
  ] as const)(
    'Reporting officer requesting removal of type $removalType changes status: $currentStatus to $newStatus',
    ({ currentStatus, payload, newStatus }) => {
      mockedReport.status = currentStatus

      incidentReportingApi.changeReportStatus.mockResolvedValueOnce(mockedReport) // NB: response is ignored

      if (payload.removeReportMethod === 'duplicate') {
        const mockedDuplicateReport = convertBasicReportDates(
          mockReport({ reportReference: '1234', reportDateAndTime: now }),
        )
        incidentReportingApi.getReportByReference.mockResolvedValueOnce(mockedDuplicateReport)
      }

      return request(appWithAllRoutes({ userSupplier: () => mockReportingOfficer }))
        .post(requestRemoveReportUrl)
        .send(payload)
        .redirects(0)
        .expect(302)
        .expect(res => {
          expect(res.redirect).toBe(true)
          expect(res.header.location).toEqual('/reports')
          expect(incidentReportingApi.changeReportStatus).toHaveBeenCalledWith(mockedReport.id, { newStatus })
        })
    },
  )
})
