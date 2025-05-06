import { now } from '../testutils/fakeClock'
import type {
  CorrectionRequest,
  DescriptionAddendum,
  Event,
  HistoricStatus,
  Question,
  ReportBasic,
  Response,
} from './incidentReportingApi'
import { mockEvent, mockReport } from './testData/incidentReporting'
import {
  convertEventDates,
  convertEventWithBasicReportsDates,
  convertBasicReportDates,
  convertReportDates,
  convertReportWithDetailsDates,
  reportHasDetails,
} from './incidentReportingApiUtils'

describe('Incident-reporting API utilities', () => {
  it('should distinguish basic reports from those with details', () => {
    const basicReport = convertReportDates(
      mockReport({ reportReference: '4321', reportDateAndTime: now, withDetails: false }),
    )
    expect(reportHasDetails(basicReport)).toBe(false)

    const reportWithDetails = convertReportDates(
      mockReport({ reportReference: '4321', reportDateAndTime: now, withDetails: true }),
    )
    expect(reportHasDetails(reportWithDetails)).toBe(true)
  })

  describe('Parsing dates in responses', () => {
    // now, when incident was reported: 2023-12-05T12:34:56.000Z
    const reportDateAndTime = now
    // now, when incident was reported: 2023-12-05T00:00:00.000Z
    const reportDate = new Date(2023, 11, 5)
    // actual incident happened 1 hour before: 2023-12-05T11:34:00.000Z (NB: seconds are truncated to mimic designs)
    const incidentDateAndTime = new Date(2023, 11, 5, 11, 34, 0)

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

    function expectCorrectDatesInDescriptionAddendum(addendum: DescriptionAddendum) {
      expect(addendum.createdAt).toEqual(reportDateAndTime)
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
      expect(response).toHaveProperty('responseDate')
      if (response.responseDate) {
        expect(response.responseDate).toEqual(reportDate)
      } else {
        expect(response.responseDate).toBeNull()
      }
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

    it('should work for a report with full details', () => {
      const reportWithDetails = convertReportWithDetailsDates(
        mockReport({ reportReference: '4321', reportDateAndTime, withDetails: true, withAddendums: true }),
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
      expect(reportWithDetails.descriptionAddendums).toHaveLength(2)
      reportWithDetails.descriptionAddendums.forEach(expectCorrectDatesInDescriptionAddendum)
    })
  })
})
