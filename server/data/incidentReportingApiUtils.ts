import type {
  CorrectionRequest,
  Event,
  EventWithBasicReports,
  HistoricStatus,
  ReportBasic,
  ReportWithDetails,
} from './incidentReportingApi'

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
    historyOfStatuses: report.historyOfStatuses.map(convertHistoricStatusDates),
    correctionRequests: report.correctionRequests.map(convertCorrectionRequestDates),
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

export function convertHistoricStatusDates(historicStatus: DatesAsStrings<HistoricStatus>): HistoricStatus {
  return {
    ...historicStatus,
    changedAt: new Date(historicStatus.changedAt),
  }
}

export function convertCorrectionRequestDates(correctionRequest: DatesAsStrings<CorrectionRequest>): CorrectionRequest {
  return {
    ...correctionRequest,
    correctionRequestedAt: new Date(correctionRequest.correctionRequestedAt),
  }
}
