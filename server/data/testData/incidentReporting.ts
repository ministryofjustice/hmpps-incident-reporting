import { v7 as uuidFromDate } from 'uuid'

import type { Event, EventWithBasicReports, ReportBasic, ReportWithDetails } from '../incidentReportingApi'

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
  reportingUsername = 'USER1',
  includeReports = 0,
}: MockEventConfig & { includeReports?: number }): DatesAsStrings<Event | EventWithBasicReports> {
  const incidentDateAndTime = new Date(reportDateAndTime)
  incidentDateAndTime.setHours(incidentDateAndTime.getHours() - 1)

  const event: DatesAsStrings<Event> = {
    id: uuidFromDate({ msecs: reportDateAndTime }),
    eventReference,
    eventDateAndTime: incidentDateAndTime.toISOString(),
    prisonId,
    title: 'An event occurred',
    description: 'Details of the event',
    createdAt: reportDateAndTime.toISOString(),
    modifiedAt: reportDateAndTime.toISOString(),
    modifiedBy: reportingUsername,
  }

  if (includeReports > 0) {
    return {
      ...event,
      reports: Array(includeReports).map((_, i) =>
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
  status?: string
  type?: string
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
  reportingUsername = 'USER1',
  withDetails = false,
}: MockReportConfig & { withDetails?: boolean }): DatesAsStrings<ReportBasic | ReportWithDetails> {
  const incidentDateAndTime = new Date(reportDateAndTime)
  incidentDateAndTime.setHours(incidentDateAndTime.getHours() - 1)

  const basicReport: DatesAsStrings<ReportBasic> = {
    id: uuidFromDate({ msecs: reportDateAndTime }),
    reportReference,
    type,
    incidentDateAndTime: incidentDateAndTime.toISOString(),
    prisonId,
    title: `Incident Report ${reportReference}`,
    description: `A new incident created in the new service of type ${type}`,
    reportedBy: reportingUsername,
    reportedAt: reportDateAndTime.toISOString(),
    status,
    assignedTo: reportingUsername,
    createdAt: reportDateAndTime.toISOString(),
    modifiedAt: reportDateAndTime.toISOString(),
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
          changedAt: reportDateAndTime.toISOString(),
          changedBy: reportingUsername,
        },
      ],
      staffInvolved: [
        {
          staffUsername: 'staff-1',
          staffRole: 'ACTIVELY_INVOLVED',
          comment: 'Comment about staff-1',
        },
        {
          staffUsername: 'staff-2',
          staffRole: 'PRESENT_AT_SCENE',
          comment: null,
        },
      ],
      prisonersInvolved: [
        {
          prisonerNumber: 'A1111AA',
          prisonerRole: 'ACTIVE_INVOLVEMENT',
          outcome: 'LOCAL_INVESTIGATION',
          comment: 'Comment about A1111AA',
        },
        {
          prisonerNumber: 'A2222BB',
          prisonerRole: 'SUSPECTED_INVOLVED',
          outcome: null,
          comment: null,
        },
      ],
      correctionRequests: [
        {
          reason: 'NOT_SPECIFIED',
          descriptionOfChange: 'Please amend question 2',
          correctionRequestedBy: 'USER2',
          correctionRequestedAt: reportDateAndTime.toISOString(),
        },
      ],
      questions: Array(2).map((_q, questionIndex) => ({
        code: `QID-${(questionIndex + 1).toString().padStart(12, '0')}`,
        question: `Question #${questionIndex + 1}`,
        additionalInformation: `Explanation #${questionIndex + 1}`,
        responses: Array(2).map((_r, responseIndex) => ({
          response: `Response #${responseIndex + 1}`,
          responseDate: reportDateAndTime.toISOString(),
          recordedBy: 'some-user',
          recordedAt: reportDateAndTime.toISOString(),
          additionalInformation: `comment #${responseIndex + 1}`,
        })),
      })),
      history: Array(2).map(() => ({
        type: 'MISCELLANEOUS',
        changedAt: reportDateAndTime.toISOString(),
        changedBy: 'some-user-2',
        questions: Array(2).map((_q, questionIndex) => ({
          code: `QID-${(questionIndex + 1).toString().padStart(12, '0')}`,
          question: `Historic question #${questionIndex + 1}`,
          additionalInformation: '',
          responses: Array(2).map((_r, responseIndex) => ({
            response: `Historic response #${responseIndex + 1}`,
            responseDate: reportDateAndTime.toISOString(),
            additionalInformation: `Historic comment #${responseIndex + 1}`,
            recordedBy: 'some-user-2',
            recordedAt: reportDateAndTime.toISOString(),
          })),
        })),
      })),
    } satisfies DatesAsStrings<ReportWithDetails>
  }

  return basicReport
}
