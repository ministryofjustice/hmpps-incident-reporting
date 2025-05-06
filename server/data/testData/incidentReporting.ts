import { v7 as uuidFromDate } from 'uuid'

import format from '../../utils/format'
import { buildArray } from '../../utils/utils'
import type { ErrorCode, Status, Type } from '../../reportConfiguration/constants'
import { getTypeDetails } from '../../reportConfiguration/constants'
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
import { andrew, barry } from './offenderSearch'
import { staffBarry, staffMary } from './prisonApi'

interface MockEventConfig {
  eventReference: string
  reportDateAndTime: Date
  location?: string
  reportingUsername?: string
}

export function mockEvent(conf: MockEventConfig & { includeReports?: 0 }): DatesAsStrings<Event>
export function mockEvent(conf: MockEventConfig & { includeReports: number }): DatesAsStrings<EventWithBasicReports>
export function mockEvent({
  eventReference,
  reportDateAndTime,
  location = 'MDI',
  reportingUsername = 'user1',
  includeReports = 0,
}: MockEventConfig & { includeReports?: number }): DatesAsStrings<Event | EventWithBasicReports> {
  const incidentDateAndTime = new Date(reportDateAndTime)
  incidentDateAndTime.setHours(incidentDateAndTime.getHours() - 1)
  incidentDateAndTime.setSeconds(0)
  incidentDateAndTime.setMilliseconds(0)

  const event: DatesAsStrings<Event> = {
    id: uuidFromDate({ msecs: reportDateAndTime.getTime() }),
    eventReference,
    eventDateAndTime: format.isoDateTime(incidentDateAndTime),
    location,
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
  location?: string
  createdInNomis?: boolean
  status?: Status
  type?: Type
  reportingUsername?: string
  withAddendums?: boolean
}

export function mockReport(conf: MockReportConfig & { withDetails?: false }): DatesAsStrings<ReportBasic>
export function mockReport(conf: MockReportConfig & { withDetails: true }): DatesAsStrings<ReportWithDetails>
export function mockReport(
  conf: MockReportConfig & { withDetails: boolean },
): DatesAsStrings<ReportBasic | ReportWithDetails>
export function mockReport({
  reportReference,
  reportDateAndTime,
  location = 'MDI',
  createdInNomis = false,
  status = 'DRAFT',
  type = 'FIND_6',
  reportingUsername = 'user1',
  withDetails = false,
  withAddendums = false,
}: MockReportConfig & { withDetails?: boolean }): DatesAsStrings<ReportBasic | ReportWithDetails> {
  const incidentDateAndTime = new Date(reportDateAndTime)
  incidentDateAndTime.setHours(incidentDateAndTime.getHours() - 1)
  incidentDateAndTime.setSeconds(0)
  incidentDateAndTime.setMilliseconds(0)

  const basicReport: DatesAsStrings<ReportBasic> = {
    id: uuidFromDate({ msecs: reportDateAndTime.getTime() }),
    reportReference,
    type,
    incidentDateAndTime: format.isoDateTime(incidentDateAndTime),
    location,
    title: `${getTypeDetails(type).description} (${location})`,
    description: `A new incident created in the new service of type ${type}`,
    reportedBy: reportingUsername,
    reportedAt: format.isoDateTime(reportDateAndTime),
    status,
    assignedTo: reportingUsername,
    createdAt: format.isoDateTime(reportDateAndTime),
    modifiedAt: format.isoDateTime(reportDateAndTime),
    modifiedBy: reportingUsername,
    createdInNomis,
    lastModifiedInNomis: createdInNomis,
  }

  if (withDetails) {
    return {
      ...basicReport,
      descriptionAddendums: withAddendums
        ? [
            {
              createdBy: 'user1',
              createdAt: format.isoDateTime(reportDateAndTime),
              firstName: 'John',
              lastName: 'Smith',
              text: 'Addendum #1',
            },
            {
              createdBy: 'user2',
              createdAt: format.isoDateTime(reportDateAndTime),
              firstName: 'Jane',
              lastName: 'Doe',
              text: 'Addendum #2',
            },
          ]
        : [],
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
      staffInvolvementDone: true,
      prisonerInvolvementDone: true,
      questions: buildArray(2, questionIndex => mockQuestion(questionIndex, reportDateAndTime, 2)),
      history: buildArray(2, () => ({
        type: 'MISCELLANEOUS_1',
        changedAt: format.isoDateTime(reportDateAndTime),
        changedBy: 'some-user-2',
        questions: buildArray(2, questionIndex => ({
          code: (questionIndex + 1).toString(),
          question: `Historic question #${questionIndex + 1}`,
          additionalInformation: '',
          responses: buildArray(2, responseIndex => ({
            response: `Historic response #${responseIndex + 1}`,
            responseDate: format.isoDate(reportDateAndTime),
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
        staffUsername: staffMary.username,
        firstName: staffMary.firstName,
        lastName: staffMary.lastName,
        staffRole: 'ACTIVELY_INVOLVED',
        comment: 'Comment about Mary',
      }
    case 1:
      return {
        staffUsername: staffBarry.username,
        firstName: staffBarry.firstName,
        lastName: staffBarry.lastName,
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
        prisonerNumber: andrew.prisonerNumber,
        firstName: andrew.firstName,
        lastName: andrew.lastName,
        prisonerRole: 'ACTIVE_INVOLVEMENT',
        outcome: 'LOCAL_INVESTIGATION',
        comment: `Comment about ${andrew.prisonerNumber}`,
      }
    case 1:
      return {
        prisonerNumber: barry.prisonerNumber,
        firstName: barry.firstName,
        lastName: barry.lastName,
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
        descriptionOfChange: 'Please amend question 2',
        correctionRequestedBy: 'USER2',
        correctionRequestedAt: format.isoDateTime(correctionRequestedAt),
      }
    case 1:
      return {
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
    code: (questionIndex + 1).toString(),
    question: `Question #${questionIndex + 1}`,
    additionalInformation: `Explanation #${questionIndex + 1}`,
    responses: buildArray(numberOfResponses, responseIndex => ({
      response: `Response #${responseIndex + 1}`,
      responseDate: format.isoDate(responseDate),
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
