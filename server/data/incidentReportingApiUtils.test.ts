import { mockEvent, mockBasicReport } from './testData/incidentReporting'
import { convertEventDates, convertBasicReportDates } from './incidentReportingApiUtils'

describe('Parsing dates in incident-reporting API responses', () => {
  const reportDateAndTime = new Date(2023, 11, 5, 12, 34, 56) // 2023-12-05T12:34:56.000Z
  const eventDateAndTime = new Date(2023, 11, 5, 11, 34, 56) // 2023-12-05T11:34:56.000Z

  it('should work for an event', () => {
    const event = convertEventDates(mockEvent({ eventReference: '12345', eventDateAndTime }))
    expect(event.eventDateAndTime).toEqual(eventDateAndTime)
    expect(event.createdAt).toEqual(eventDateAndTime)
    expect(event.modifiedAt).toEqual(eventDateAndTime)
  })

  it('should work for a report with basic details', () => {
    const basicReport = convertBasicReportDates(mockBasicReport({ reportReference: '4321', reportDateAndTime }))
    expect(basicReport.incidentDateAndTime).toEqual(eventDateAndTime)
    expect(basicReport.reportedAt).toEqual(reportDateAndTime)
    expect(basicReport.createdAt).toEqual(reportDateAndTime)
    expect(basicReport.modifiedAt).toEqual(reportDateAndTime)
  })
})
