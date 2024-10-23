import { v7 as uuidFromDate } from 'uuid'

import format from '../../utils/format'
import { buildArray } from '../../utils/utils'
import type { ErrorCode, Status, Type } from '../../reportConfiguration/constants'
import type {
  ErrorResponse,
  Event,
  EventWithBasicReports,
  ReportBasic,
  ReportWithDetails,
  StaffInvolvement,
  PrisonerInvolvement,
  CorrectionRequest,
  Question,
} from '../incidentReportingApi'

interface MockEventConfig {
  eventReference: string
  reportDateAndTime: Date
  prisonId?: string
  reportingUsername?: string
}

export function mockEvent(conf: MockEventConfig & { includeReports?: 0 }): DatesAsStrings<Event>
export function mockEvent(conf: MockEventConfig & { includeReports: number }): DatesAsStrings<EventWithBasicReports>
export function mockEvent({
  eventReference,
  reportDateAndTime,
  prisonId = 'MDI',
  reportingUsername = 'user1',
  includeReports = 0,
}: MockEventConfig & { includeReports?: number }): DatesAsStrings<Event | EventWithBasicReports> {
  const incidentDateAndTime = new Date(reportDateAndTime)
  incidentDateAndTime.setHours(incidentDateAndTime.getHours() - 1)

  const event: DatesAsStrings<Event> = {
    id: uuidFromDate({ msecs: reportDateAndTime }),
    eventReference,
    eventDateAndTime: format.isoDateTime(incidentDateAndTime),
    prisonId,
    title: 'An event occurred',
    description: 'Details of the event',
    createdAt: format.isoDateTime(reportDateAndTime),
    modifiedAt: format.isoDateTime(reportDateAndTime),
    modifiedBy: reportingUsername,
  }

  if (includeReports > 0) {
    return {
      ...event,
      reports: buildArray(includeReports, i =>
        mockReport({ reportReference: (10000 + i).toString(), reportDateAndTime }),
      ),
    } satisfies DatesAsStrings<EventWithBasicReports>
  }

  return event
}

interface MockReportConfig {
  reportReference: string
  reportDateAndTime: Date
  prisonId?: string
  createdInNomis?: boolean
  status?: Status
  type?: Type
  reportingUsername?: string
}

export function mockReport(conf: MockReportConfig & { withDetails?: false }): DatesAsStrings<ReportBasic>
export function mockReport(conf: MockReportConfig & { withDetails: true }): DatesAsStrings<ReportWithDetails>
export function mockReport({
  reportReference,
  reportDateAndTime,
  prisonId = 'MDI',
  createdInNomis = false,
  status = 'DRAFT',
  type = 'FINDS',
  reportingUsername = 'user1',
  withDetails = false,
}: MockReportConfig & { withDetails?: boolean }): DatesAsStrings<ReportBasic | ReportWithDetails> {
  const incidentDateAndTime = new Date(reportDateAndTime)
  incidentDateAndTime.setHours(incidentDateAndTime.getHours() - 1)

  const basicReport: DatesAsStrings<ReportBasic> = {
    id: uuidFromDate({ msecs: reportDateAndTime }),
    reportReference,
    type,
    incidentDateAndTime: format.isoDateTime(incidentDateAndTime),
    prisonId,
    title: `Incident Report ${reportReference}`,
    description: `A new incident created in the new service of type ${type}`,
    reportedBy: reportingUsername,
    reportedAt: format.isoDateTime(reportDateAndTime),
    status,
    assignedTo: reportingUsername,
    createdAt: format.isoDateTime(reportDateAndTime),
    modifiedAt: format.isoDateTime(reportDateAndTime),
    modifiedBy: reportingUsername,
    createdInNomis,
  }

  if (withDetails) {
    return {
      ...basicReport,
      event: mockEvent({ eventReference: reportReference, reportDateAndTime }),
      historyOfStatuses: [
        {
          status,
          changedAt: format.isoDateTime(reportDateAndTime),
          changedBy: reportingUsername,
        },
      ],
      staffInvolved: [mockStaffInvolvement(0), mockStaffInvolvement(1)],
      prisonersInvolved: [mockPrisonerInvolvement(0), mockPrisonerInvolvement(1)],
      correctionRequests: [mockCorrectionRequest(0, reportDateAndTime)],
      questions: buildArray(2, questionIndex => mockQuestion(questionIndex, reportDateAndTime, 2)),
      history: buildArray(2, () => ({
        type: 'MISCELLANEOUS',
        changedAt: format.isoDateTime(reportDateAndTime),
        changedBy: 'some-user-2',
        questions: buildArray(2, questionIndex => ({
          code: `QID-${(questionIndex + 1).toString().padStart(12, '0')}`,
          question: `Historic question #${questionIndex + 1}`,
          additionalInformation: '',
          responses: buildArray(2, responseIndex => ({
            response: `Historic response #${responseIndex + 1}`,
            responseDate: format.isoDateTime(reportDateAndTime),
            additionalInformation: `Historic comment #${responseIndex + 1}`,
            recordedBy: 'some-user-2',
            recordedAt: format.isoDateTime(reportDateAndTime),
          })),
        })),
      })),
    } satisfies DatesAsStrings<ReportWithDetails>
  }

  return basicReport
}

export function mockStaffInvolvement(index: number): DatesAsStrings<StaffInvolvement> {
  switch (index) {
    case 0:
      return {
        staffUsername: 'staff-1',
        staffRole: 'ACTIVELY_INVOLVED',
        comment: 'Comment about staff-1',
      }
    case 1:
      return {
        staffUsername: 'staff-2',
        staffRole: 'PRESENT_AT_SCENE',
        comment: null,
      }
    default:
      throw new Error('not implemented')
  }
}

export function mockPrisonerInvolvement(index: number): DatesAsStrings<PrisonerInvolvement> {
  switch (index) {
    case 0:
      return {
        prisonerNumber: 'A1111AA',
        prisonerRole: 'ACTIVE_INVOLVEMENT',
        outcome: 'LOCAL_INVESTIGATION',
        comment: 'Comment about A1111AA',
      }
    case 1:
      return {
        prisonerNumber: 'A2222BB',
        prisonerRole: 'SUSPECTED_INVOLVED',
        outcome: null,
        comment: null,
      }
    default:
      throw new Error('not implemented')
  }
}

export function mockCorrectionRequest(index: number, correctionRequestedAt: Date): DatesAsStrings<CorrectionRequest> {
  switch (index) {
    case 0:
      return {
        reason: 'NOT_SPECIFIED',
        descriptionOfChange: 'Please amend question 2',
        correctionRequestedBy: 'USER2',
        correctionRequestedAt: format.isoDateTime(correctionRequestedAt),
      }
    case 1:
      return {
        reason: 'MISTAKE',
        descriptionOfChange: 'Name misspelled',
        correctionRequestedBy: 'USER2',
        correctionRequestedAt: format.isoDateTime(correctionRequestedAt),
      }
    default:
      throw new Error('not implemented')
  }
}

export function mockQuestion(
  questionIndex: number,
  responseDate: Date,
  numberOfResponses = 0,
): DatesAsStrings<Question> {
  return {
    code: `QID-${(questionIndex + 1).toString().padStart(12, '0')}`,
    question: `Question #${questionIndex + 1}`,
    additionalInformation: `Explanation #${questionIndex + 1}`,
    responses: buildArray(numberOfResponses, responseIndex => ({
      response: `Response #${responseIndex + 1}`,
      responseDate: format.isoDateTime(responseDate),
      recordedBy: 'some-user',
      recordedAt: format.isoDateTime(responseDate),
      additionalInformation: `comment #${responseIndex + 1}`,
    })),
  }
}

/**
 * Build an object that is returned by the api (as JSON) in case of errors.
 * Used only in testing.
 */
export function mockErrorResponse({
  message,
  status = 400,
  errorCode,
}: {
  message: string
  status?: number
  errorCode?: ErrorCode
}): ErrorResponse {
  return {
    status,
    developerMessage: message,
    userMessage: message, // in practice, the messages differ but are not shown directly to users anyway
    errorCode,
  }
}
