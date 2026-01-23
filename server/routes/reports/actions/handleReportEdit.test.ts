import type { Express, Response } from 'express'

import { IncidentReportingApi, type ReportBasic } from '../../../data/incidentReportingApi'
import { convertReportDates } from '../../../data/incidentReportingApiUtils'
import { mockReport } from '../../../data/testData/incidentReporting'
import { mockPecsRegions } from '../../../data/testData/pecsRegions'
import { mockDataWarden, mockReportingOfficer } from '../../../data/testData/users'
import { Permissions } from '../../../middleware/permissions'
import { now } from '../../../testutils/fakeClock'
import { handleReportEdit } from './handleReportEdit'

jest.mock('../../../data/incidentReportingApi')

const incidentReportingApi = IncidentReportingApi.prototype as jest.Mocked<IncidentReportingApi>

afterEach(() => {
  jest.resetAllMocks()
})

function mockResponse(user: Express.User, report: ReportBasic): Response {
  const permissions = new Permissions(user)
  return {
    locals: {
      apis: { incidentReportingApi },
      report,
      possibleTransitions: permissions.possibleTransitions(report),
      permissions,
    },
  } as unknown as Response
}

describe('Report editing side effects', () => {
  describe('Prison reports', () => {
    const mockedReport = convertReportDates(
      mockReport({
        reportReference: '6543',
        reportDateAndTime: now,
      }),
    )

    describe.each([
      {
        userType: 'reporting officer',
        user: mockReportingOfficer,
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
        userType: 'data warden',
        user: mockDataWarden,
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
    ] as const)('when a $userType edits a report (assuming they are even allowed to)', ({ user, statuses }) => {
      it.each(statuses)('should not cause status to change from %s', async status => {
        mockedReport.status = status
        const res = mockResponse(user, mockedReport)
        await handleReportEdit(res)
        expect(incidentReportingApi.changeReportStatus).not.toHaveBeenCalled()
      })
    })
  })

  describe('PECS reports', () => {
    const mockedReport = convertReportDates(
      mockReport({
        reportReference: '6543',
        reportDateAndTime: now,
        location: 'NORTH',
      }),
    )

    beforeAll(() => {
      mockPecsRegions()
    })

    describe('when a data warden edits a report (assuming they are even allowed to)', () => {
      it.each([
        'DRAFT',
        'REOPENED',
        // technically, not allowed to edit below
        'DUPLICATE',
        'NOT_REPORTABLE',
        'CLOSED',
        // technically, PECS reports should not exist in these statuses
        'AWAITING_REVIEW',
        'NEEDS_UPDATING',
        'UPDATED',
        'ON_HOLD',
        'WAS_CLOSED',
      ] as const)('should not cause status to change from %s', async status => {
        mockedReport.status = status
        const res = mockResponse(mockDataWarden, mockedReport)
        await handleReportEdit(res)
        expect(incidentReportingApi.changeReportStatus).not.toHaveBeenCalled()
      })
    })
  })
})
