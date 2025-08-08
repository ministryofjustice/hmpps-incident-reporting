import type { Response } from 'express'

import { IncidentReportingApi } from '../../../data/incidentReportingApi'
import { convertReportDates } from '../../../data/incidentReportingApiUtils'
import { mockReport } from '../../../data/testData/incidentReporting'
import { now } from '../../../testutils/fakeClock'
import { handleReportEdit } from './handleReportEdit'

jest.mock('../../../data/incidentReportingApi')

const incidentReportingApi = IncidentReportingApi.prototype as jest.Mocked<IncidentReportingApi>

afterEach(() => {
  jest.resetAllMocks()
})

const mockedReport = convertReportDates(
  mockReport({
    reportReference: '6543',
    reportDateAndTime: now,
  }),
)

describe('Report editing side effects', () => {
  describe.each([
    {
      userType: 'REPORTING_OFFICER',
      statuses: [
        'DRAFT',
        'NEEDS_UPDATING',
        'REOPENED',
        // technically, not allowed to edit below
        'UPDATED',
        'ON_HOLD',
        'WAS_CLOSED',
        'DUPLICATE',
        'NOT_REPORTABLE',
        'CLOSED',
      ],
    },
    {
      userType: 'DATA_WARDEN',
      statuses: [
        // technically, not allowed to edit below
        'DRAFT',
        'NEEDS_UPDATING',
        'REOPENED',
        'AWAITING_REVIEW',
        'UPDATED',
        'ON_HOLD',
        'WAS_CLOSED',
        'DUPLICATE',
        'NOT_REPORTABLE',
        'CLOSED',
      ],
    },
  ] as const)(
    'when a $userType edits a prison report (assuming they are even allowed to)',
    ({ userType, statuses }) => {
      it.each(statuses)('should not cause status to change from %s', async status => {
        mockedReport.status = status
        const res = {
          locals: { apis: { incidentReportingApi }, permissions: { userType }, report: mockedReport },
        } as unknown as Response
        await handleReportEdit(res)
        expect(incidentReportingApi.changeReportStatus).not.toHaveBeenCalled()
      })
    },
  )

  it('should change status from AWAITING_REVIEW to DRAFT when REPORTING_OFFICER edits a prison report', async () => {
    mockedReport.status = 'AWAITING_REVIEW'
    const res = {
      locals: { apis: { incidentReportingApi }, permissions: { userType: 'REPORTING_OFFICER' }, report: mockedReport },
    } as unknown as Response
    await handleReportEdit(res)
    expect(incidentReportingApi.changeReportStatus).toHaveBeenCalledWith(mockedReport.id, { newStatus: 'DRAFT' })
  })
})
