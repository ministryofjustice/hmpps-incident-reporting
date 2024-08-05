import type { Event, EventWithBasicReports, ReportBasic, ReportWithDetails } from './incidentReportingApi'

export function convertBasicReportDates(report: DatesAsStrings<ReportBasic>): ReportBasic {
  return {
    ...report,
    incidentDateAndTime: new Date(report.incidentDateAndTime),
    reportedAt: new Date(report.reportedAt),
    createdAt: new Date(report.createdAt),
    modifiedAt: new Date(report.modifiedAt),
  }
}

export function convertReportWithDetailsDates(report: DatesAsStrings<ReportWithDetails>): ReportWithDetails {
  return {
    ...report,
    ...convertBasicReportDates(report),
    event: convertEventDates(report.event),
  }
}

export function convertEventDates(event: DatesAsStrings<Event>): Event {
  return {
    ...event,
    eventDateAndTime: new Date(event.eventDateAndTime),
    createdAt: new Date(event.createdAt),
    modifiedAt: new Date(event.modifiedAt),
  }
}

export function convertEventWithBasicReportsDates(event: DatesAsStrings<EventWithBasicReports>): EventWithBasicReports {
  return {
    ...event,
    ...convertEventDates(event),
    reports: event.reports.map(convertBasicReportDates),
  }
}
