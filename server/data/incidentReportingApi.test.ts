import nock from 'nock'

import config from '../config'
import type { SanitisedError } from '../sanitisedError'
import type { ErrorResponse, CreateReportRequest, UpdateReportRequest } from './incidentReportingApi'
import { ErrorCode, IncidentReportingApi, isErrorResponse } from './incidentReportingApi'
import { mockCorrectionRequest, mockErrorResponse, mockEvent, mockReport } from './testData/incidentReporting'
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
    const badRequest = mockErrorResponse({
      message: 'Inactive incident type OLD_FINDS4',
      errorCode: ErrorCode.ValidationFailure,
    })

    it('should recognise error responses from the api', async () => {
      expect(isErrorResponse(badRequest)).toBe(true)
    })

    it.each([
      { method: 'getEvents', url: '/incident-events', testCase: () => apiClient.getEvents() },
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
      { method: 'getReports', url: '/incident-reports', testCase: () => apiClient.getReports() },
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
      {
        method: 'createReport',
        url: '/incident-reports',
        urlMethod: 'post',
        testCase: () =>
          apiClient.createReport({
            createNewEvent: true,
            type: 'FINDS',
            title: 'Chewing gum',
            description: 'Chewing gum found in cell',
            incidentDateAndTime: now,
            prisonId: 'MDI',
          }),
      },
      {
        method: 'updateReport',
        url: `/incident-reports/${basicReport.id}`,
        urlMethod: 'patch',
        testCase: () => apiClient.updateReport(basicReport.id, { description: 'Police informed' }),
      },
      {
        method: 'changeReportStatus',
        url: `/incident-reports/${reportWithDetails.id}/status`,
        urlMethod: 'patch',
        testCase: () => apiClient.changeReportStatus(reportWithDetails.id, { newStatus: 'IN_ANALYSIS' }),
      },
      {
        method: 'changeReportType',
        url: `/incident-reports/${reportWithDetails.id}/type`,
        urlMethod: 'patch',
        testCase: () => apiClient.changeReportType(reportWithDetails.id, { newType: 'MISCELLANEOUS' }),
      },
      {
        method: 'deleteReport',
        url: `/incident-reports/${reportWithDetails.id}`,
        urlMethod: 'delete',
        testCase: () => apiClient.deleteReport(reportWithDetails.id),
      },
      {
        method: 'staffInvolved.listForReport',
        url: `/incident-reports/${reportWithDetails.id}/staff-involved`,
        testCase: () => apiClient.staffInvolved.listForReport(reportWithDetails.id),
      },
      {
        method: 'staffInvolved.addToReport',
        url: `/incident-reports/${reportWithDetails.id}/staff-involved`,
        urlMethod: 'post',
        testCase: () =>
          apiClient.staffInvolved.addToReport(reportWithDetails.id, {
            staffRole: 'ACTIVELY_INVOLVED',
            staffUsername: 'staff-1',
          }),
      },
      {
        method: 'staffInvolved.updateForReport',
        url: `/incident-reports/${reportWithDetails.id}/staff-involved/1`,
        urlMethod: 'patch',
        testCase: () =>
          apiClient.staffInvolved.updateForReport(reportWithDetails.id, 1, {
            staffRole: 'ACTIVELY_INVOLVED',
            staffUsername: 'staff-1',
          }),
      },
      {
        method: 'staffInvolved.deleteFromReport',
        url: `/incident-reports/${reportWithDetails.id}/staff-involved/1`,
        urlMethod: 'delete',
        testCase: () => apiClient.staffInvolved.deleteFromReport(reportWithDetails.id, 1),
      },
      {
        method: 'prisonersInvolved.listForReport',
        url: `/incident-reports/${reportWithDetails.id}/prisoners-involved`,
        testCase: () => apiClient.prisonersInvolved.listForReport(reportWithDetails.id),
      },
      {
        method: 'prisonersInvolved.addToReport',
        url: `/incident-reports/${reportWithDetails.id}/prisoners-involved`,
        urlMethod: 'post',
        testCase: () =>
          apiClient.prisonersInvolved.addToReport(reportWithDetails.id, {
            prisonerNumber: 'A1111AA',
            prisonerRole: 'ACTIVE_INVOLVEMENT',
          }),
      },
      {
        method: 'prisonersInvolved.updateForReport',
        url: `/incident-reports/${reportWithDetails.id}/prisoners-involved/1`,
        urlMethod: 'patch',
        testCase: () =>
          apiClient.prisonersInvolved.updateForReport(reportWithDetails.id, 1, {
            prisonerNumber: 'A1111AA',
            prisonerRole: 'ACTIVE_INVOLVEMENT',
          }),
      },
      {
        method: 'prisonersInvolved.deleteFromReport',
        url: `/incident-reports/${reportWithDetails.id}/prisoners-involved/1`,
        urlMethod: 'delete',
        testCase: () => apiClient.prisonersInvolved.deleteFromReport(reportWithDetails.id, 1),
      },
      {
        method: 'correctionRequests.listForReport',
        url: `/incident-reports/${reportWithDetails.id}/correction-requests`,
        testCase: () => apiClient.correctionRequests.listForReport(reportWithDetails.id),
      },
      {
        method: 'correctionRequests.addToReport',
        url: `/incident-reports/${reportWithDetails.id}/correction-requests`,
        urlMethod: 'post',
        testCase: () =>
          apiClient.correctionRequests.addToReport(reportWithDetails.id, {
            descriptionOfChange: 'MISTAKE',
            reason: 'Name misspelled',
          }),
      },
      {
        method: 'correctionRequests.updateForReport',
        url: `/incident-reports/${reportWithDetails.id}/correction-requests/1`,
        urlMethod: 'patch',
        testCase: () =>
          apiClient.correctionRequests.updateForReport(reportWithDetails.id, 1, {
            descriptionOfChange: 'MISTAKE',
            reason: 'Name misspelled',
          }),
      },
      {
        method: 'correctionRequests.deleteFromReport',
        url: `/incident-reports/${reportWithDetails.id}/correction-requests/1`,
        urlMethod: 'delete',
        testCase: () => apiClient.correctionRequests.deleteFromReport(reportWithDetails.id, 1),
      },
    ])('should throw when calling $method on error responses from the api', async ({ url, urlMethod, testCase }) => {
      fakeApiClient
        .intercept(url, urlMethod ?? 'get')
        .query(true)
        .reply(400, badRequest)

      const expectedSantisedError: SanitisedError<ErrorResponse> = {
        status: 400,
        name: expect.any(String),
        stack: expect.any(String),
        message: expect.any(String),
        data: {
          status: 400,
          errorCode: 100,
          userMessage: 'Inactive incident type OLD_FINDS4',
          developerMessage: 'Inactive incident type OLD_FINDS4',
        },
      }

      await expect(testCase).rejects.toMatchObject(expectedSantisedError)
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
      {
        method: 'updateReport',
        url: `/incident-reports/${basicReport.id}`,
        urlMethod: 'patch',
        testCase: () => apiClient.updateReport(basicReport.id, { description: 'Police informed' }),
      },
    ])('should work for $method returning a basic report', async ({ testCase, url, urlMethod }) => {
      fakeApiClient.intercept(url, urlMethod ?? 'get').reply(200, basicReport)
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
      {
        method: 'createReport',
        url: '/incident-reports',
        urlMethod: 'post',
        testCase: () =>
          apiClient.createReport({
            createNewEvent: true,
            type: 'FINDS',
            title: 'Chewing gum',
            description: 'Chewing gum found in cell',
            incidentDateAndTime: now,
            prisonId: 'MDI',
          }),
      },
      {
        method: 'changeReportStatus',
        url: `/incident-reports/${reportWithDetails.id}/status`,
        urlMethod: 'patch',
        testCase: () => apiClient.changeReportStatus(reportWithDetails.id, { newStatus: 'IN_ANALYSIS' }),
      },
      {
        method: 'changeReportType',
        url: `/incident-reports/${reportWithDetails.id}/type`,
        urlMethod: 'patch',
        testCase: () => apiClient.changeReportType(reportWithDetails.id, { newType: 'MISCELLANEOUS' }),
      },
      {
        method: 'deleteReport',
        url: `/incident-reports/${reportWithDetails.id}`,
        urlMethod: 'delete',
        testCase: () => apiClient.deleteReport(reportWithDetails.id),
      },
    ])('should work for $method returning a report with details', async ({ testCase, url, urlMethod }) => {
      fakeApiClient
        .intercept(url, urlMethod ?? 'get')
        .query(true)
        .reply(200, reportWithDetails)
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

    it.each([
      {
        method: 'createReport',
        url: '/incident-reports',
        urlMethod: 'post',
        testCase: () =>
          apiClient.createReport({
            createNewEvent: true,
            type: 'FINDS',
            title: 'Chewing gum',
            description: 'Chewing gum found in cell',
            incidentDateAndTime: now,
            prisonId: 'MDI',
          }),
      },
      {
        method: 'updateReport',
        url: `/incident-reports/${basicReport.id}`,
        urlMethod: 'patch',
        testCase: () => apiClient.updateReport(basicReport.id, { incidentDateAndTime: now }),
      },
    ])('should work on input request data for $method', async ({ testCase, url, urlMethod }) => {
      fakeApiClient.intercept(url, urlMethod).reply((_uri, requestBody) => {
        const request = requestBody as DatesAsStrings<CreateReportRequest | UpdateReportRequest>
        if (request.incidentDateAndTime?.includes('2023-12-05T12:34:56')) {
          return [200, reportWithDetails]
        }
        return [400, { status: 400, userMessage: 'Invalid input date', developerMessage: '' } satisfies ErrorResponse]
      })
      await testCase()
    })

    it.each([
      {
        method: 'correctionRequests.listForReport',
        url: `/incident-reports/${reportWithDetails.id}/correction-requests`,
        testCase: () => apiClient.correctionRequests.listForReport(reportWithDetails.id),
      },
      {
        method: 'correctionRequests.addToReport',
        url: `/incident-reports/${reportWithDetails.id}/correction-requests`,
        urlMethod: 'post',
        testCase: () =>
          apiClient.correctionRequests.addToReport(reportWithDetails.id, {
            descriptionOfChange: 'MISTAKE',
            reason: 'Name misspelled',
          }),
      },
      {
        method: 'correctionRequests.updateForReport',
        url: `/incident-reports/${reportWithDetails.id}/correction-requests/1`,
        urlMethod: 'patch',
        testCase: () =>
          apiClient.correctionRequests.updateForReport(reportWithDetails.id, 1, {
            descriptionOfChange: 'MISTAKE',
            reason: 'Name misspelled',
          }),
      },
      {
        method: 'correctionRequests.deleteFromReport',
        url: `/incident-reports/${reportWithDetails.id}/correction-requests/1`,
        urlMethod: 'delete',
        testCase: () => apiClient.correctionRequests.deleteFromReport(reportWithDetails.id, 1),
      },
    ])('should work for $method returning a list of correction requests', async ({ url, urlMethod, testCase }) => {
      fakeApiClient
        .intercept(url, urlMethod ?? 'get')
        .query(true)
        .reply(200, [mockCorrectionRequest(0, now), mockCorrectionRequest(1, now)])
      const response = await testCase()
      const shouldBeDates = response.map(item => item.correctionRequestedAt)
      shouldBeDates.forEach(value => expect(value).toBeInstanceOf(Date))
    })
  })
})
