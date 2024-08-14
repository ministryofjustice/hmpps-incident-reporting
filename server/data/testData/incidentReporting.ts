import { v7 as uuidFromDate } from 'uuid'

import type { Event, EventWithBasicReports, ReportBasic } from '../incidentReportingApi'

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
        mockBasicReport({ reportReference: (10000 + i).toString(), reportDateAndTime }),
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

export function mockBasicReport({
  reportReference,
  reportDateAndTime,
  prisonId = 'MDI',
  createdInNomis = false,
  status = 'DRAFT',
  type = 'FINDS',
  reportingUsername = 'USER1',
}: MockReportConfig): DatesAsStrings<ReportBasic> {
  const incidentDateAndTime = new Date(reportDateAndTime)
  incidentDateAndTime.setHours(incidentDateAndTime.getHours() - 1)
  return {
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
}
