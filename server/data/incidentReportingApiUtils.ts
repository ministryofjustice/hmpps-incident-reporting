import type { EventWithBasicReports, ReportBasic } from './incidentReportingApi'

export function convertBasicReportDates(report: DatesAsStrings<ReportBasic>): ReportBasic {
  return {
    ...report,
    incidentDateAndTime: new Date(report.incidentDateAndTime),
    reportedAt: new Date(report.reportedAt),
    createdAt: new Date(report.createdAt),
    modifiedAt: new Date(report.modifiedAt),
  }
}

export function convertEventWithBasicReportsDates(event: DatesAsStrings<EventWithBasicReports>): EventWithBasicReports {
  return {
    ...event,
    eventDateAndTime: new Date(event.eventDateAndTime),
    createdAt: new Date(event.createdAt),
    modifiedAt: new Date(event.modifiedAt),
    reports: event.reports.map(convertBasicReportDates),
  }
}

export function toDateString(date: Date): string {
  return date.toISOString().split('T')[0]
}
