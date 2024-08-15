import nock from 'nock'

import config from '../config'
import { ErrorCode, IncidentReportingApi, isErrorResponse } from './incidentReportingApi'
import { mockErrorResponse, mockEvent, mockReport } from './testData/incidentReporting'
import { unsortedPageOf } from './testData/paginatedResponses'

jest.mock('./tokenStore/redisTokenStore')

describe('Incident reporting API client', () => {
  // 2023-12-05T12:34:56.000Z
  const now = new Date(2023, 11, 5, 12, 34, 56)

  const eventWith1Report = mockEvent({ eventReference: '54322', reportDateAndTime: now, includeReports: 1 })
  const basicReport = mockReport({ reportReference: '6543', reportDateAndTime: now })
  const reportWithDetails = mockReport({ reportReference: '6544', reportDateAndTime: now, withDetails: true })

  let fakeApiClient: nock.Scope
  let apiClient: IncidentReportingApi

  beforeEach(() => {
    fakeApiClient = nock(config.apis.hmppsIncidentReportingApi.url)
    apiClient = new IncidentReportingApi('token')
  })

  afterEach(() => {
    jest.resetAllMocks()
    nock.cleanAll()
  })

  describe('error handling', () => {
    it('should recognise error responses from the api', async () => {
      const badRequest = mockErrorResponse({
        message: 'Inactive incident type OLD_FINDS4',
        errorCode: ErrorCode.ValidationFailure,
      })
      expect(isErrorResponse(badRequest)).toBe(true)
    })
  })

  describe('conversion of date fields', () => {
    it('should work for getEvents returning a list of events with reports', async () => {
      fakeApiClient
        .get('/incident-events')
        .query(true)
        .reply(200, unsortedPageOf([eventWith1Report]))
      const response = await apiClient.getEvents()
      const shouldBeDates = response.content.flatMap(item => [
        item.eventDateAndTime,
        item.createdAt,
        item.modifiedAt,
        item.reports[0].incidentDateAndTime,
        item.reports[0].reportedAt,
        item.reports[0].createdAt,
        item.reports[0].modifiedAt,
      ])
      shouldBeDates.forEach(value => expect(value).toBeInstanceOf(Date))
    })

    it.each([
      {
        method: 'getEventById',
        url: `/incident-events/${eventWith1Report.id}`,
        testCase: () => apiClient.getEventById(eventWith1Report.id),
      },
      {
        method: 'getEventByReference',
        url: `/incident-events/reference/${eventWith1Report.eventReference}`,
        testCase: () => apiClient.getEventByReference(eventWith1Report.eventReference),
      },
    ])('should work for $method returning an event with reports', async ({ testCase, url }) => {
      fakeApiClient.get(url).reply(200, eventWith1Report)
      const response = await testCase()
      const shouldBeDates = [
        response.eventDateAndTime,
        response.createdAt,
        response.modifiedAt,
        response.reports[0].incidentDateAndTime,
        response.reports[0].reportedAt,
        response.reports[0].createdAt,
        response.reports[0].modifiedAt,
      ]
      shouldBeDates.forEach(value => expect(value).toBeInstanceOf(Date))
    })

    it('should work for getReports returning a list of basic reports', async () => {
      fakeApiClient
        .get('/incident-reports')
        .query(true)
        .reply(200, unsortedPageOf([basicReport]))
      const response = await apiClient.getReports()
      const shouldBeDates = response.content.flatMap(item => [
        item.incidentDateAndTime,
        item.reportedAt,
        item.createdAt,
        item.modifiedAt,
      ])
      shouldBeDates.forEach(value => expect(value).toBeInstanceOf(Date))
    })

    it.each([
      {
        method: 'getReportById',
        url: `/incident-reports/${basicReport.id}`,
        testCase: () => apiClient.getReportById(basicReport.id),
      },
      {
        method: 'getReportByReference',
        url: `/incident-reports/reference/${basicReport.reportReference}`,
        testCase: () => apiClient.getReportByReference(basicReport.reportReference),
      },
    ])('should work for $method returning a basic report', async ({ testCase, url }) => {
      fakeApiClient.get(url).reply(200, basicReport)
      const response = await testCase()
      const shouldBeDates = [response.incidentDateAndTime, response.reportedAt, response.createdAt, response.modifiedAt]
      shouldBeDates.forEach(value => expect(value).toBeInstanceOf(Date))
    })

    it.each([
      {
        method: 'getReportWithDetailsById',
        url: `/incident-reports/${reportWithDetails.id}/with-details`,
        testCase: () => apiClient.getReportWithDetailsById(reportWithDetails.id),
      },
      {
        method: 'getReportWithDetailsByReference',
        url: `/incident-reports/reference/${reportWithDetails.reportReference}/with-details`,
        testCase: () => apiClient.getReportWithDetailsByReference(reportWithDetails.reportReference),
      },
    ])('should work for $method returning a basic report', async ({ testCase, url }) => {
      fakeApiClient.get(url).reply(200, reportWithDetails)
      const response = await testCase()
      const shouldBeDates = [
        response.incidentDateAndTime,
        response.reportedAt,
        response.createdAt,
        response.modifiedAt,
        response.event.eventDateAndTime,
        response.event.createdAt,
        response.event.modifiedAt,
        // NB: other children are checked in incidentReportingApiUtils.test.ts
      ]
      shouldBeDates.forEach(value => expect(value).toBeInstanceOf(Date))
    })
  })
})
