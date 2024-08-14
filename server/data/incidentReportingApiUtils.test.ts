import type { CorrectionRequest, Event, HistoricStatus, Question, ReportBasic, Response } from './incidentReportingApi'
import { mockEvent, mockReport } from './testData/incidentReporting'
import {
  convertEventDates,
  convertEventWithBasicReportsDates,
  convertBasicReportDates,
  convertReportWithDetailsDates,
} from './incidentReportingApiUtils'

describe('Parsing dates in incident-reporting API responses', () => {
  // now, when incident was reported: 2023-12-05T12:34:56.000Z
  const reportDateAndTime = new Date(2023, 11, 5, 12, 34, 56)
  // actual incident happened 1 hour before: 2023-12-05T11:34:56.000Z
  const incidentDateAndTime = new Date(2023, 11, 5, 11, 34, 56)

  function expectCorrectDatesInEvent(event: Event) {
    expect(event.eventDateAndTime).toEqual(incidentDateAndTime)
    expect(event.createdAt).toEqual(reportDateAndTime)
    expect(event.modifiedAt).toEqual(reportDateAndTime)
  }

  function expectCorrectDatesInBasicReport(basicReport: ReportBasic) {
    expect(basicReport.incidentDateAndTime).toEqual(incidentDateAndTime)
    expect(basicReport.reportedAt).toEqual(reportDateAndTime)
    expect(basicReport.createdAt).toEqual(reportDateAndTime)
    expect(basicReport.modifiedAt).toEqual(reportDateAndTime)
  }

  function expectCorrectDatesInCorrectionRequest(correctionRequest: CorrectionRequest) {
    expect(correctionRequest.correctionRequestedAt).toEqual(reportDateAndTime)
  }

  function expectCorrectDatesInHistoricStatus(historicStatus: HistoricStatus) {
    expect(historicStatus.changedAt).toEqual(reportDateAndTime)
  }

  function expectCorrectDatesInQuestion(question: Question) {
    expect(question.responses).toHaveLength(2)
    question.responses.forEach(expectCorrectDatesInResponse)
  }

  function expectCorrectDatesInResponse(response: Response) {
    expect(response.recordedAt).toEqual(reportDateAndTime)
  }

  it('should work for an event', () => {
    const event = convertEventDates(mockEvent({ eventReference: '12345', reportDateAndTime }))
    expectCorrectDatesInEvent(event)
  })

  it('should work for an event containing reports with basic details', () => {
    const eventWithDetails = convertEventWithBasicReportsDates(
      mockEvent({ eventReference: '12345', reportDateAndTime, includeReports: 2 }),
    )
    expectCorrectDatesInEvent(eventWithDetails)
    expect(eventWithDetails.reports).toHaveLength(2)
    eventWithDetails.reports.forEach(expectCorrectDatesInBasicReport)
  })

  it('should work for a report with basic details', () => {
    const basicReport = convertBasicReportDates(mockReport({ reportReference: '4321', reportDateAndTime }))
    expectCorrectDatesInBasicReport(basicReport)
  })

  it('should work for a report with full detauls', () => {
    const reportWithDetails = convertReportWithDetailsDates(
      mockReport({ reportReference: '4321', reportDateAndTime, withDetails: true }),
    )
    expectCorrectDatesInBasicReport(reportWithDetails)
    expect(reportWithDetails.historyOfStatuses).toHaveLength(1)
    reportWithDetails.historyOfStatuses.forEach(expectCorrectDatesInHistoricStatus)
    expect(reportWithDetails.correctionRequests).toHaveLength(1)
    reportWithDetails.correctionRequests.forEach(expectCorrectDatesInCorrectionRequest)
    expect(reportWithDetails.questions).toHaveLength(2)
    reportWithDetails.questions.forEach(expectCorrectDatesInQuestion)
    expect(reportWithDetails.history).toHaveLength(2)
    reportWithDetails.history.forEach(history => {
      expect(history.questions).toHaveLength(2)
      history.questions.forEach(expectCorrectDatesInQuestion)
    })
  })
})
