import type { Express } from 'express'
import request, { type Test } from 'supertest'

import { appWithAllRoutes } from '../../../testutils/appSetup'
import { now } from '../../../../testutils/fakeClock'
import { statuses } from '../../../../reportConfiguration/constants'
import { IncidentReportingApi, type ReportBasic } from '../../../../data/incidentReportingApi'
import { convertBasicReportDates } from '../../../../data/incidentReportingApiUtils'
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

const validPayloadWhenDuplicate = {
  reason: 'duplicate' as const,
  originalReportReference: '1234',
  duplicateComment: 'A colleague already reported it this morning',
}
const validPayloadWhenNotReportable = {
  reason: 'notReportable' as const,
  notReportableComment: 'This minor type of incident does not need recording according to policy',
}

describe('Requesting removal of a report', () => {
  let mockedReport: ReportBasic
  let requestRemoveReportUrl: string

  beforeEach(() => {
    mockedReport = convertBasicReportDates(
      mockReport({
        reportReference: '6543',
        reportDateAndTime: now,
        type: 'ASSAULT_5',
        withDetails: true,
      }),
    )
    incidentReportingApi.getReportById.mockResolvedValueOnce(mockedReport)
    requestRemoveReportUrl = `/reports/${mockedReport.id}/request-remove`
  })

  function shouldNotBeAllowed(): void {
    it('should not be allowed', async () => {
      await expectSignOut(request(app).get(requestRemoveReportUrl))
      incidentReportingApi.getReportById.mockResolvedValueOnce(mockedReport)
      await expectSignOut(request(app).post(requestRemoveReportUrl).send(validPayloadWhenDuplicate))
    })
  }

  describe('by reporting officers', () => {
    beforeEach(() => {
      setupAppForUser(mockReportingOfficer)
    })

    describe.each([
      { currentStatus: 'DRAFT', newStatus: 'AWAITING_REVIEW' },
      { currentStatus: 'NEEDS_UPDATING', newStatus: 'UPDATED' },
      { currentStatus: 'REOPENED', newStatus: 'WAS_CLOSED' },
    ] as const)('if the status is $currentStatus', ({ currentStatus, newStatus }) => {
      beforeEach(() => {
        mockedReport.status = currentStatus
      })

      it('should 404 if report is not found', () => {
        const error = mockThrownError(mockErrorResponse({ status: 404, message: 'Report not found' }), 404)
        incidentReportingApi.getReportById.mockReset()
        incidentReportingApi.getReportById.mockRejectedValueOnce(error)

        return request(app)
          .get(requestRemoveReportUrl)
          .expect(404)
          .expect(res => {
            expect(res.text).toContain('Page not found')
          })
      })

      it('should present a page with choices', () => {
        return request(app)
          .get(requestRemoveReportUrl)
          .expect(200)
          .expect(res => {
            expect(res.text).toContain('app-remove-report-request')
            expect(res.text).toContain('Why do you want to remove this report?')
            expect(incidentReportingApi.changeReportStatus).not.toHaveBeenCalled()
          })
      })

      it('should show an error if reason is not chosen', () => {
        incidentReportingApi.getReportById.mockResolvedValueOnce(mockedReport) // due to redirect

        return request
          .agent(app)
          .post(requestRemoveReportUrl)
          .send({})
          .redirects(1)
          .expect(200)
          .expect(res => {
            expect(res.text).toContain('There is a problem')
            expect(res.text).toContain('Select why you want to remove this report')
            expect(res.text).not.toContain('Enter a valid incident report number')
            expect(res.text).not.toContain('Describe why incident is not reportable')
            expect(incidentReportingApi.changeReportStatus).not.toHaveBeenCalled()
          })
      })

      it(`should allow requesting removal of a duplicate report changing the status to ${newStatus}`, () => {
        const mockedDuplicateReport = convertBasicReportDates(
          mockReport({ reportReference: '1234', reportDateAndTime: now }),
        )
        incidentReportingApi.getReportByReference.mockResolvedValueOnce(mockedDuplicateReport)
        incidentReportingApi.changeReportStatus.mockResolvedValueOnce(undefined) // NB: response is ignored

        return request(app)
          .post(requestRemoveReportUrl)
          .send(validPayloadWhenDuplicate)
          .expect(302)
          .expect(res => {
            expect(res.redirect).toBe(true)
            expect(res.header.location).toEqual('/reports')
            expect(incidentReportingApi.changeReportStatus).toHaveBeenCalledWith(mockedReport.id, { newStatus })
          })
      })

      it('should still allow requesting removal of a duplicate report if comment is left empty', () => {
        const mockedDuplicateReport = convertBasicReportDates(
          mockReport({ reportReference: '1234', reportDateAndTime: now }),
        )
        incidentReportingApi.getReportByReference.mockResolvedValueOnce(mockedDuplicateReport)
        incidentReportingApi.changeReportStatus.mockResolvedValueOnce(undefined) // NB: response is ignored

        return request(app)
          .post(requestRemoveReportUrl)
          .send({
            ...validPayloadWhenDuplicate,
            duplicateComment: '',
          })
          .expect(302)
          .expect(res => {
            expect(res.redirect).toBe(true)
            expect(res.header.location).toEqual('/reports')
            expect(incidentReportingApi.changeReportStatus).toHaveBeenCalledWith(mockedReport.id, { newStatus })
          })
      })

      it('should show an error if original reference of duplicate report is left empty', () => {
        incidentReportingApi.getReportById.mockResolvedValueOnce(mockedReport) // due to redirect

        return request
          .agent(app)
          .post(requestRemoveReportUrl)
          .send({
            ...validPayloadWhenDuplicate,
            originalReportReference: '',
          })
          .redirects(1)
          .expect(200)
          .expect(res => {
            expect(res.text).toContain('There is a problem')
            expect(res.text).toContain('Enter a valid incident report number')
            expect(incidentReportingApi.changeReportStatus).not.toHaveBeenCalled()
          })
      })

      it('should show an error if original reference of duplicate report is the same', () => {
        incidentReportingApi.getReportById.mockResolvedValueOnce(mockedReport) // due to redirect

        return request
          .agent(app)
          .post(requestRemoveReportUrl)
          .send({
            ...validPayloadWhenDuplicate,
            originalReportReference: '6543',
          })
          .redirects(1)
          .expect(200)
          .expect(res => {
            expect(res.text).toContain('There is a problem')
            expect(res.text).toContain('Enter a different report number')
            expect(res.text).not.toContain('Enter a valid incident report number')
            expect(incidentReportingApi.changeReportStatus).not.toHaveBeenCalled()
          })
      })

      it('should show an error if original reference of duplicate report cannot be found', () => {
        const error = mockThrownError(mockErrorResponse({ status: 404, message: 'Report not found' }), 404)
        incidentReportingApi.getReportByReference.mockRejectedValueOnce(error)
        incidentReportingApi.getReportById.mockResolvedValueOnce(mockedReport) // due to redirect

        return request
          .agent(app)
          .post(requestRemoveReportUrl)
          .send(validPayloadWhenDuplicate)
          .redirects(1)
          .expect(200)
          .expect(res => {
            expect(res.text).toContain('There is a problem')
            expect(res.text).toContain('Enter a valid incident report number')
            expect(incidentReportingApi.changeReportStatus).not.toHaveBeenCalled()
          })
      })

      it('should show an error if original reference of duplicate report cannot be looked up', () => {
        const error = mockThrownError(mockErrorResponse({ status: 500, message: 'External problem' }), 500)
        incidentReportingApi.getReportByReference.mockRejectedValueOnce(error)
        incidentReportingApi.getReportById.mockResolvedValueOnce(mockedReport) // due to redirect

        return request
          .agent(app)
          .post(requestRemoveReportUrl)
          .send(validPayloadWhenDuplicate)
          .redirects(1)
          .expect(200)
          .expect(res => {
            expect(res.text).toContain('There is a problem')
            expect(res.text).toContain('Incident number could not be looked up')
            expect(res.text).not.toContain('Enter a valid incident report number')
            expect(res.text).not.toContain('External problem')
            expect(incidentReportingApi.changeReportStatus).not.toHaveBeenCalled()
          })
      })

      it('should show an error if API rejects request to mark as duplicate', () => {
        const error = mockThrownError(mockErrorResponse({ status: 500, message: 'External problem' }), 500)
        incidentReportingApi.changeReportStatus.mockRejectedValueOnce(error)
        incidentReportingApi.getReportById.mockResolvedValueOnce(mockedReport) // due to redirect

        return request
          .agent(app)
          .post(requestRemoveReportUrl)
          .send(validPayloadWhenDuplicate)
          .redirects(1)
          .expect(200)
          .expect(res => {
            expect(res.text).toContain('There is a problem')
            expect(res.text).toContain('Sorry, there was a problem with your request')
            expect(res.text).not.toContain('Internal Server Error')
            expect(res.text).not.toContain('External problem')
          })
      })

      it(`should allow requesting removal of a non-reportable report changing the status to ${newStatus}`, () => {
        incidentReportingApi.changeReportStatus.mockResolvedValueOnce(undefined) // NB: response is ignored

        return request(app)
          .post(requestRemoveReportUrl)
          .send(validPayloadWhenNotReportable)
          .expect(302)
          .expect(res => {
            expect(res.redirect).toBe(true)
            expect(res.header.location).toEqual('/reports')
            expect(incidentReportingApi.changeReportStatus).toHaveBeenCalledWith(mockedReport.id, { newStatus })
          })
      })

      it('should show an error if comment is left empty when requesting removal of a non-reportable report', () => {
        incidentReportingApi.getReportById.mockResolvedValueOnce(mockedReport) // due to redirect

        return request
          .agent(app)
          .post(requestRemoveReportUrl)
          .send({
            ...validPayloadWhenNotReportable,
            notReportableComment: '',
          })
          .redirects(1)
          .expect(200)
          .expect(res => {
            expect(res.text).toContain('There is a problem')
            expect(res.text).toContain('Describe why incident is not reportable')
            expect(incidentReportingApi.changeReportStatus).not.toHaveBeenCalled()
          })
      })

      it('should show an error if API rejects request to mark as not reportable', () => {
        const error = mockThrownError(mockErrorResponse({ status: 500, message: 'External problem' }), 500)
        incidentReportingApi.changeReportStatus.mockRejectedValueOnce(error)
        incidentReportingApi.getReportById.mockResolvedValueOnce(mockedReport) // due to redirect

        return request
          .agent(app)
          .post(requestRemoveReportUrl)
          .send(validPayloadWhenNotReportable)
          .redirects(1)
          .expect(200)
          .expect(res => {
            expect(res.text).toContain('There is a problem')
            expect(res.text).toContain('Sorry, there was a problem with your request')
            expect(res.text).not.toContain('Internal Server Error')
            expect(res.text).not.toContain('External problem')
          })
      })
    })

    describe.each([
      'AWAITING_REVIEW',
      'ON_HOLD',
      'UPDATED',
      'CLOSED',
      'POST_INCIDENT_UPDATE',
      'DUPLICATE',
      'NOT_REPORTABLE',
      'WAS_CLOSED',
    ] as const)('if the status is %s', status => {
      beforeEach(() => {
        mockedReport.status = status
      })

      shouldNotBeAllowed()
    })
  })

  describe.each([
    { userType: 'data wardens', user: mockDataWarden },
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
