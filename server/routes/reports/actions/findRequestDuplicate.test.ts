import { now } from '../../../testutils/fakeClock'
import type { ReportWithDetails } from '../../../data/incidentReportingApi'
import { convertReportDates } from '../../../data/incidentReportingApiUtils'
import { mockReport } from '../../../data/testData/incidentReporting'
import { statuses } from '../../../reportConfiguration/constants'
import { findRequestDuplicate } from './findRequestDuplicate'

describe('Finding recent duplicate requests', () => {
  let report: ReportWithDetails

  beforeEach(() => {
    report = convertReportDates(
      mockReport({
        reportReference: '6544',
        reportDateAndTime: now,
        withDetails: true,
      }),
    )
  })

  it('should return null when there are no correction requests', () => {
    report.status = 'AWAITING_REVIEW'
    report.correctionRequests = []

    const duplicateRequest = findRequestDuplicate(report)
    expect(duplicateRequest).toBeNull()
  })

  it('should return a duplicate request if it was the only action that just took the report into the submitted work list', () => {
    report.status = 'AWAITING_REVIEW'
    report.correctionRequests = [
      {
        descriptionOfChange: '(Report is a duplicate of 1235)',
        userAction: 'REQUEST_DUPLICATE',
        userType: 'REPORTING_OFFICER',
        originalReportReference: '1235',
        correctionRequestedBy: 'user1',
        correctionRequestedAt: now,
      },
    ]

    const duplicateRequest = findRequestDuplicate(report)
    expect(duplicateRequest).toHaveProperty('originalReportReference', '1235')
  })

  it('should return a duplicate request if it was the last action that took the report into the submitted work list', () => {
    report.status = 'UPDATED'
    report.correctionRequests = [
      {
        descriptionOfChange: 'This seems to be a duplicate of incident 1235',
        userAction: 'REQUEST_CORRECTION',
        userType: 'DATA_WARDEN',
        correctionRequestedBy: 'user1',
        correctionRequestedAt: now,
      },
      {
        descriptionOfChange: '(Report is a duplicate of 1235)',
        userAction: 'REQUEST_DUPLICATE',
        userType: 'REPORTING_OFFICER',
        originalReportReference: '1235',
        correctionRequestedBy: 'user1',
        correctionRequestedAt: now,
      },
    ]

    const duplicateRequest = findRequestDuplicate(report)
    expect(duplicateRequest).toHaveProperty('originalReportReference', '1235')
  })

  it('should return a duplicate request if it was the last action that took the report into the submitted work list, even if it was put on hold afterwards', () => {
    report.status = 'ON_HOLD'
    report.correctionRequests = [
      {
        descriptionOfChange: '(Report is a duplicate of 1235)',
        userAction: 'REQUEST_DUPLICATE',
        userType: 'REPORTING_OFFICER',
        originalReportReference: '1235',
        correctionRequestedBy: 'user1',
        correctionRequestedAt: now,
      },
      {
        descriptionOfChange: 'Checking up on some details…',
        userAction: 'HOLD',
        userType: 'DATA_WARDEN',
        correctionRequestedBy: 'user1',
        correctionRequestedAt: now,
      },
    ]

    const duplicateRequest = findRequestDuplicate(report)
    expect(duplicateRequest).toHaveProperty('originalReportReference', '1235')
  })

  it('should return null if report had left the submitted work list since the last duplicate request', () => {
    report.status = 'UPDATED'
    report.correctionRequests = [
      {
        descriptionOfChange: '(Report is a duplicate of 1235)',
        userAction: 'REQUEST_DUPLICATE',
        userType: 'REPORTING_OFFICER',
        originalReportReference: '1235',
        correctionRequestedBy: 'user1',
        correctionRequestedAt: now,
      },
      {
        descriptionOfChange: 'This does NOT seem to be a duplicate of incident 1235',
        userAction: 'REQUEST_CORRECTION',
        userType: 'DATA_WARDEN',
        correctionRequestedBy: 'user1',
        correctionRequestedAt: now,
      },
      {
        descriptionOfChange: 'I agree, all questions are now completed',
        userAction: 'REQUEST_REVIEW',
        userType: 'REPORTING_OFFICER',
        correctionRequestedBy: 'user1',
        correctionRequestedAt: now,
      },
    ]

    const duplicateRequest = findRequestDuplicate(report)
    expect(duplicateRequest).toBeNull()
  })

  it.each(
    statuses
      .map(({ code: status }) => status)
      .filter(status => !['AWAITING_REVIEW', 'UPDATED', 'ON_HOLD', 'WAS_CLOSED'].includes(status)),
  )('should return null if report has status %s, not in the submitted work list', status => {
    report.status = status
    report.correctionRequests = [
      // unrealistic scenario: in most cases, this cannot be the last correction request
      {
        descriptionOfChange: '(Report is a duplicate of 1235)',
        userAction: 'REQUEST_DUPLICATE',
        userType: 'REPORTING_OFFICER',
        originalReportReference: '1235',
        correctionRequestedBy: 'user1',
        correctionRequestedAt: now,
      },
    ]

    const duplicateRequest = findRequestDuplicate(report)
    expect(duplicateRequest).toBeNull()
  })
})
