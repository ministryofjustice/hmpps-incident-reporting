import type {
  CorrectionRequest,
  DescriptionAddendum,
  HistoricReport,
  HistoricStatus,
  HistoricType,
  Question,
  ReportBasic,
  ReportWithDetails,
  Response,
} from './incidentReportingApi'

export function reportHasDetails(report: ReportBasic | ReportWithDetails): report is ReportWithDetails {
  return 'historyOfStatuses' in report
}

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
    descriptionAddendums: report.descriptionAddendums.map(convertDescriptionAddendumDates),
    questions: report.questions.map(convertQuestionDates),
    history: report.history.map(convertHistoricReportDates),
    historyOfStatuses: report.historyOfStatuses.map(convertHistoricStatusDates),
    incidentTypeHistory: report.incidentTypeHistory.map(convertHistoricTypeDates),
    correctionRequests: report.correctionRequests.map(convertCorrectionRequestDates),
  }
}

export function convertReportDates(report: DatesAsStrings<ReportWithDetails>): ReportWithDetails
export function convertReportDates(report: DatesAsStrings<ReportBasic>): ReportBasic
export function convertReportDates(
  report: DatesAsStrings<ReportBasic | ReportWithDetails>,
): ReportBasic | ReportWithDetails
export function convertReportDates(
  report: DatesAsStrings<ReportBasic | ReportWithDetails>,
): ReportBasic | ReportWithDetails {
  if ('historyOfStatuses' in report) {
    return convertReportWithDetailsDates(report)
  }
  return convertBasicReportDates(report)
}

export function convertDescriptionAddendumDates(addendum: DatesAsStrings<DescriptionAddendum>): DescriptionAddendum {
  return {
    ...addendum,
    createdAt: new Date(addendum.createdAt),
  }
}

export function convertQuestionDates(question: DatesAsStrings<Question>): Question {
  return {
    ...question,
    responses: question.responses.map(convertResponseDates),
  }
}

function convertResponseDates(response: DatesAsStrings<Response>): Response {
  return {
    ...response,
    responseDate: response.responseDate && new Date(response.responseDate),
    recordedAt: new Date(response.recordedAt),
  }
}

function convertHistoricReportDates(historicReport: DatesAsStrings<HistoricReport>): HistoricReport {
  return {
    ...historicReport,
    changedAt: new Date(historicReport.changedAt),
    questions: historicReport.questions.map(convertQuestionDates),
  }
}

function convertHistoricStatusDates(historicStatus: DatesAsStrings<HistoricStatus>): HistoricStatus {
  return {
    ...historicStatus,
    changedAt: new Date(historicStatus.changedAt),
  }
}

function convertHistoricTypeDates(historicType: DatesAsStrings<HistoricType>): HistoricType {
  return {
    ...historicType,
    changedAt: new Date(historicType.changedAt),
  }
}

export function convertCorrectionRequestDates(correctionRequest: DatesAsStrings<CorrectionRequest>): CorrectionRequest {
  return {
    ...correctionRequest,
    correctionRequestedAt: new Date(correctionRequest.correctionRequestedAt),
  }
}
