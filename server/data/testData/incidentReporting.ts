import { v7 as uuidFromDate } from 'uuid'

import type { Event, ReportBasic } from '../incidentReportingApi'

export function mockEvent({
  eventReference,
  eventDateAndTime,
  prisonId = 'MDI',
  reportingUsername = 'USER1',
}: {
  eventReference: string
  eventDateAndTime: Date
  prisonId?: string
  reportingUsername?: string
}): DatesAsStrings<Event> {
  return {
    id: uuidFromDate({ msecs: eventDateAndTime }),
    eventReference,
    eventDateAndTime: eventDateAndTime.toISOString(),
    prisonId,
    title: 'An event occurred',
    description: 'Details of the event',
    createdAt: eventDateAndTime.toISOString(),
    modifiedAt: eventDateAndTime.toISOString(),
    modifiedBy: reportingUsername,
  }
}

export function mockBasicReport({
  reportReference,
  reportDateAndTime,
  prisonId = 'MDI',
  createdInNomis = false,
  status = 'DRAFT',
  type = 'FINDS',
  reportingUsername = 'USER1',
}: {
  reportReference: string
  reportDateAndTime: Date
  prisonId?: string
  createdInNomis?: boolean
  status?: string
  type?: string
  reportingUsername?: string
}): DatesAsStrings<ReportBasic> {
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
