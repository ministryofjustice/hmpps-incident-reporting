import type { Express } from 'express'
import request, { type Test } from 'supertest'

import { appWithAllRoutes } from '../../../testutils/appSetup'
import { now } from '../../../../testutils/fakeClock'
import { type Status, statuses } from '../../../../reportConfiguration/constants'
import type { UserAction } from '../../../../middleware/permissions'
import { IncidentReportingApi, type ReportWithDetails } from '../../../../data/incidentReportingApi'
import { convertReportWithDetailsDates } from '../../../../data/incidentReportingApiUtils'
import { mockErrorResponse, mockReport } from '../../../../data/testData/incidentReporting'
import { mockThrownError } from '../../../../data/testData/thrownErrors'
import {
  mockDataWarden,
  mockReportingOfficer,
  mockHqViewer,
  mockUnauthorisedUser,
} from '../../../../data/testData/users'

jest.mock('../../../../data/incidentReportingApi')

let incidentReportingApi: jest.Mocked<IncidentReportingApi>

beforeEach(() => {
  incidentReportingApi = IncidentReportingApi.prototype as jest.Mocked<IncidentReportingApi>
})

afterEach(() => {
  jest.resetAllMocks()
})

let app: Express

function setupAppForUser(user: Express.User): void {
  app = appWithAllRoutes({ userSupplier: () => user })
}

const validPayload = { userAction: 'RECALL' satisfies UserAction } as const

describe('Reopening a report', () => {
  let mockedReport: ReportWithDetails
  let reopenReportUrl: string

  beforeEach(() => {
    mockedReport = convertReportWithDetailsDates(
      mockReport({
        reportReference: '6543',
        reportDateAndTime: now,
        type: 'ASSAULT_5',
        withDetails: true,
      }),
    )
    incidentReportingApi.getReportById.mockResolvedValueOnce(mockedReport)
    reopenReportUrl = `/reports/${mockedReport.id}/reopen`
  })

  function shouldBeAllowed(confirmationMessage: string, newStatus: Status): void {
    it('should 404 if report is not found', () => {
      const error = mockThrownError(mockErrorResponse({ status: 404, message: 'Report not found' }), 404)
      incidentReportingApi.getReportById.mockReset()
      incidentReportingApi.getReportById.mockRejectedValueOnce(error)

      return request(app)
        .get(reopenReportUrl)
        .expect(404)
        .expect(res => {
          expect(res.text).toContain('Page not found')
        })
    })

    it('should present a confirmation page', () => {
      return request(app)
        .get(reopenReportUrl)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('app-reopen-report')
          expect(res.text).toContain(confirmationMessage)
          expect(incidentReportingApi.changeReportStatus).not.toHaveBeenCalled()
        })
    })

    it(`should be allowed resulting in a new status of ${newStatus}`, () => {
      incidentReportingApi.changeReportStatus.mockResolvedValueOnce(undefined) // NB: response is ignored

      return request(app)
        .post(reopenReportUrl)
        .send(validPayload)
        .expect(302)
        .expect(res => {
          expect(res.redirect).toBe(true)
          expect(res.header.location).toEqual(`/reports/${mockedReport.id}`)
          expect(incidentReportingApi.changeReportStatus).toHaveBeenCalledWith(mockedReport.id, { newStatus })
        })
    })

    it('should show an error if API rejects request to change status', () => {
      const error = mockThrownError(mockErrorResponse({ message: 'Comment is required' }))
      incidentReportingApi.changeReportStatus.mockRejectedValueOnce(error)
      incidentReportingApi.getReportById.mockResolvedValueOnce(mockedReport) // due to redirect

      return request
        .agent(app)
        .post(reopenReportUrl)
        .send(validPayload)
        .redirects(1)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('There is a problem')
          expect(res.text).toContain('Sorry, there was a problem with your request')
          expect(res.text).not.toContain('Bad Request')
          expect(res.text).not.toContain('Comment is required')
        })
    })
  }

  function shouldRedirectToReportPage(): void {
    it('should redirect to report page where action can be taken', () => {
      return request(app)
        .get(reopenReportUrl)
        .expect(302)
        .expect(res => {
          expect(res.redirect).toBe(true)
          expect(res.header.location).toEqual(`/reports/${mockedReport.id}`)
          expect(incidentReportingApi.changeReportStatus).not.toHaveBeenCalled()
        })
    })
  }

  function shouldNotBeAllowed(): void {
    it('should not be allowed', async () => {
      await expectSignOut(request(app).get(reopenReportUrl))
      incidentReportingApi.getReportById.mockResolvedValueOnce(mockedReport)
      await expectSignOut(request(app).post(reopenReportUrl).send(validPayload))
    })
  }

  describe('by reporting officers', () => {
    beforeEach(() => {
      setupAppForUser(mockReportingOfficer)
    })

    describe.each([
      { currentStatus: 'CLOSED', newStatus: 'REOPENED' },
      { currentStatus: 'DUPLICATE', newStatus: 'NEEDS_UPDATING' },
      { currentStatus: 'NOT_REPORTABLE', newStatus: 'NEEDS_UPDATING' },
    ] as const)('if the status is $currentStatus', ({ currentStatus, newStatus }) => {
      beforeEach(() => {
        mockedReport.status = currentStatus
      })

      shouldBeAllowed('Once you have made changes, you’ll need to resubmit the report to be reviewed.', newStatus)
    })

    describe.each(['AWAITING_REVIEW', 'UPDATED', 'WAS_CLOSED'] as const)('if the status is %s', status => {
      beforeEach(() => {
        mockedReport.status = status
      })

      shouldRedirectToReportPage()
    })

    describe.each(['DRAFT', 'ON_HOLD', 'NEEDS_UPDATING', 'POST_INCIDENT_UPDATE', 'REOPENED'] as const)(
      'if the status is %s',
      status => {
        beforeEach(() => {
          mockedReport.status = status
        })

        shouldNotBeAllowed()
      },
    )
  })

  describe('by data wardens', () => {
    beforeEach(() => {
      setupAppForUser(mockDataWarden)
    })

    describe.each(['CLOSED', 'DUPLICATE', 'NOT_REPORTABLE'] as const)('if the status is %s', status => {
      beforeEach(() => {
        mockedReport.status = status
      })

      shouldBeAllowed('Once you have made changes, you’ll need to resubmit the report.', 'UPDATED')
    })

    describe.each(['NEEDS_UPDATING', 'REOPENED'] as const)('if the status is %s', status => {
      beforeEach(() => {
        mockedReport.status = status
      })

      shouldRedirectToReportPage()
    })

    describe.each(['DRAFT', 'AWAITING_REVIEW', 'ON_HOLD', 'UPDATED', 'POST_INCIDENT_UPDATE', 'WAS_CLOSED'] as const)(
      'if the status is %s',
      status => {
        beforeEach(() => {
          mockedReport.status = status
        })

        shouldNotBeAllowed()
      },
    )
  })

  describe.each([
    { userType: 'HQ viewers', user: mockHqViewer },
    { userType: 'unauthorised users', user: mockUnauthorisedUser },
  ])('by $userType', ({ user }) => {
    beforeEach(() => {
      setupAppForUser(user)
    })

    describe.each(statuses)('if the status is $code', ({ code: status }) => {
      beforeEach(() => {
        mockedReport.status = status
      })

      shouldNotBeAllowed()
    })
  })
})

function expectSignOut(test: Test): Test {
  return test.expect(302).expect(res => {
    expect(res.redirect).toBe(true)
    expect(res.header.location).toEqual('/sign-out')
    expect(incidentReportingApi.changeReportStatus).not.toHaveBeenCalled()
  })
}
