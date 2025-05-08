import nock from 'nock'
import { SanitisedError } from '@ministryofjustice/hmpps-rest-client'

import config from '../config'
import { ErrorCode } from '../reportConfiguration/constants'
import { now } from '../testutils/fakeClock'
import {
  ErrorResponse,
  CreateReportRequest,
  UpdateReportRequest,
  AddOrUpdateQuestionWithResponsesRequest,
  IncidentReportingApi,
  isErrorResponse,
} from './incidentReportingApi'
import {
  mockDescriptionAddendum,
  mockCorrectionRequest,
  mockErrorResponse,
  mockEvent,
  mockQuestion,
  mockReport,
} from './testData/incidentReporting'
import { unsortedPageOf } from './testData/paginatedResponses'

jest.mock('./tokenStore/redisTokenStore')

describe('Incident reporting API client', () => {
  const accessToken = 'token'
  const eventWith1Report = mockEvent({ eventReference: '54322', reportDateAndTime: now, includeReports: 1 })
  const basicReport = mockReport({ reportReference: '6543', reportDateAndTime: now })
  const reportWithDetails = mockReport({ reportReference: '6544', reportDateAndTime: now, withDetails: true })

  let fakeApiClient: nock.Scope
  let apiClient: IncidentReportingApi

  beforeEach(() => {
    fakeApiClient = nock(config.apis.hmppsIncidentReportingApi.url)
    apiClient = new IncidentReportingApi(accessToken)
  })

  afterEach(() => {
    jest.resetAllMocks()
    nock.cleanAll()
  })

  describe('error handling', () => {
    const badRequest = mockErrorResponse({
      message: 'Inactive incident type FIND_5',
      errorCode: ErrorCode.ValidationFailure,
    })

    it('should recognise error responses from the api', async () => {
      expect(isErrorResponse(badRequest)).toBe(true)
    })

    it.each([
      { method: 'getDefinitions', url: '/definitions', testCase: () => apiClient.getManagementReportDefinitions() },
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
            type: 'FIND_6',
            title: 'Chewing gum',
            description: 'Chewing gum found in cell',
            incidentDateAndTime: now,
            location: 'MDI',
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
        testCase: () => apiClient.changeReportType(reportWithDetails.id, { newType: 'MISCELLANEOUS_1' }),
      },
      {
        method: 'deleteReport',
        url: `/incident-reports/${reportWithDetails.id}`,
        urlMethod: 'delete',
        testCase: () => apiClient.deleteReport(reportWithDetails.id),
      },
      {
        method: 'descriptionAddendums.listForReport',
        url: `/incident-reports/${reportWithDetails.id}/description-addendums`,
        testCase: () => apiClient.descriptionAddendums.listForReport(reportWithDetails.id),
      },
      {
        method: 'descriptionAddendums.addToReport',
        url: `/incident-reports/${reportWithDetails.id}/description-addendums`,
        urlMethod: 'post',
        testCase: () =>
          apiClient.descriptionAddendums.addToReport(reportWithDetails.id, {
            createdBy: 'abc12a',
            firstName: 'MARY',
            lastName: 'JOHNSON',
            text: 'Prisoner was released from hospital',
          }),
      },
      {
        method: 'descriptionAddendums.updateForReport',
        url: `/incident-reports/${reportWithDetails.id}/description-addendums/1`,
        urlMethod: 'patch',
        testCase: () =>
          apiClient.descriptionAddendums.updateForReport(reportWithDetails.id, 1, {
            text: 'Prisoner was released from healthcare',
          }),
      },
      {
        method: 'descriptionAddendums.deleteFromReport',
        url: `/incident-reports/${reportWithDetails.id}/description-addendums/1`,
        urlMethod: 'delete',
        testCase: () => apiClient.descriptionAddendums.deleteFromReport(reportWithDetails.id, 1),
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
            staffUsername: 'abc12a',
            firstName: 'MARY',
            lastName: 'JOHNSON',
            staffRole: 'ACTIVELY_INVOLVED',
          }),
      },
      {
        method: 'staffInvolved.updateForReport',
        url: `/incident-reports/${reportWithDetails.id}/staff-involved/1`,
        urlMethod: 'patch',
        testCase: () =>
          apiClient.staffInvolved.updateForReport(reportWithDetails.id, 1, {
            staffUsername: 'abc12a',
            staffRole: 'ACTIVELY_INVOLVED',
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
            firstName: 'ANDREW',
            lastName: 'ARNOLD',
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
            descriptionOfChange: 'Name misspelled',
          }),
      },
      {
        method: 'correctionRequests.updateForReport',
        url: `/incident-reports/${reportWithDetails.id}/correction-requests/1`,
        urlMethod: 'patch',
        testCase: () =>
          apiClient.correctionRequests.updateForReport(reportWithDetails.id, 1, {
            descriptionOfChange: 'Name misspelled',
          }),
      },
      {
        method: 'correctionRequests.deleteFromReport',
        url: `/incident-reports/${reportWithDetails.id}/correction-requests/1`,
        urlMethod: 'delete',
        testCase: () => apiClient.correctionRequests.deleteFromReport(reportWithDetails.id, 1),
      },
      {
        method: 'getQuestions',
        url: `/incident-reports/${basicReport.id}/questions`,
        testCase: () => apiClient.getQuestions(basicReport.id),
      },
      {
        method: 'addOrUpdateQuestionsWithResponses',
        url: `/incident-reports/${basicReport.id}/questions`,
        urlMethod: 'put',
        testCase: () =>
          apiClient.addOrUpdateQuestionsWithResponses(basicReport.id, [
            {
              code: '1',
              question: 'Was the police informed?',
              responses: [{ response: 'Yes', responseDate: now }],
            },
          ]),
      },
      {
        method: 'deleteQuestionsAndTheirResponses',
        url: `/incident-reports/${basicReport.id}/questions`,
        urlMethod: 'delete',
        testCase: () => apiClient.deleteQuestionsAndTheirResponses(basicReport.id, ['1']),
      },
      {
        method: 'constants.types',
        url: '/constants/types',
        testCase: () => apiClient.constants.types(),
      },
      {
        method: 'constants.typeFamilies',
        url: '/constants/type-families',
        testCase: () => apiClient.constants.typeFamilies(),
      },
      {
        method: 'constants.statuses',
        url: '/constants/statuses',
        testCase: () => apiClient.constants.statuses(),
      },
      {
        method: 'constants.informationSources',
        url: '/constants/information-sources',
        testCase: () => apiClient.constants.informationSources(),
      },
      {
        method: 'constants.staffInvolvementRoles',
        url: '/constants/staff-roles',
        testCase: () => apiClient.constants.staffInvolvementRoles(),
      },
      {
        method: 'constants.prisonerInvolvementRoles',
        url: '/constants/prisoner-roles',
        testCase: () => apiClient.constants.prisonerInvolvementRoles(),
      },
      {
        method: 'constants.prisonerInvolvementOutcomes',
        url: '/constants/prisoner-outcomes',
        testCase: () => apiClient.constants.prisonerInvolvementOutcomes(),
      },
      {
        method: 'constants.errorCodes',
        url: '/constants/error-codes',
        testCase: () => apiClient.constants.errorCodes(),
      },
    ])('should throw when calling $method on error responses from the api', async ({ url, urlMethod, testCase }) => {
      fakeApiClient
        .intercept(url, urlMethod ?? 'get')
        .query(true)
        .matchHeader('authorization', `Bearer ${accessToken}`)
        .reply(400, badRequest)

      const expectedSantisedError: SanitisedError<ErrorResponse> = {
        responseStatus: 400,
        name: expect.any(String),
        stack: expect.any(String),
        message: expect.any(String),
        data: {
          status: 400,
          errorCode: 100,
          userMessage: 'Inactive incident type FIND_5',
          developerMessage: 'Inactive incident type FIND_5',
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
        .matchHeader('authorization', `Bearer ${accessToken}`)
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
      fakeApiClient.get(url).matchHeader('authorization', `Bearer ${accessToken}`).reply(200, eventWith1Report)
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
        .matchHeader('authorization', `Bearer ${accessToken}`)
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
      fakeApiClient
        .intercept(url, urlMethod ?? 'get')
        .matchHeader('authorization', `Bearer ${accessToken}`)
        .reply(200, basicReport)
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
            type: 'FIND_6',
            title: 'Chewing gum',
            description: 'Chewing gum found in cell',
            incidentDateAndTime: now,
            location: 'MDI',
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
        testCase: () => apiClient.changeReportType(reportWithDetails.id, { newType: 'MISCELLANEOUS_1' }),
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
        .matchHeader('authorization', `Bearer ${accessToken}`)
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
            type: 'FIND_6',
            title: 'Chewing gum',
            description: 'Chewing gum found in cell',
            incidentDateAndTime: now,
            location: 'MDI',
          }),
        mockResponse: { status: 201, data: reportWithDetails },
        responseDateExtractor: (request: DatesAsStrings<CreateReportRequest>) => [request.incidentDateAndTime],
        expectedDateString: '2023-12-05T12:34:56',
      },
      {
        method: 'updateReport',
        url: `/incident-reports/${basicReport.id}`,
        urlMethod: 'patch',
        testCase: () => apiClient.updateReport(basicReport.id, { incidentDateAndTime: now }),
        mockResponse: { status: 200, data: basicReport },
        responseDateExtractor: (request: DatesAsStrings<UpdateReportRequest>) => [request.incidentDateAndTime],
        expectedDateString: '2023-12-05T12:34:56',
      },
      {
        method: 'addOrUpdateQuestionsWithResponses',
        url: `/incident-reports/${basicReport.id}/questions`,
        urlMethod: 'put',
        testCase: () =>
          apiClient.addOrUpdateQuestionsWithResponses(basicReport.id, [
            {
              code: '1',
              question: 'Was the police informed?',
              responses: [{ response: 'Yes', responseDate: now }],
            },
          ]),
        mockResponse: { status: 201, data: [] },
        responseDateExtractor: (requests: DatesAsStrings<AddOrUpdateQuestionWithResponsesRequest[]>) =>
          requests.flatMap(request => request.responses.map(response => response.responseDate)),
        expectedDateString: '2023-12-05',
      },
    ])(
      'should work on input request data for $method',
      async ({ testCase, url, urlMethod, mockResponse, responseDateExtractor, expectedDateString }) => {
        fakeApiClient
          .intercept(url, urlMethod)
          .matchHeader('authorization', `Bearer ${accessToken}`)
          .reply((_uri, requestBody) => {
            const request = requestBody as DatesAsStrings<
              CreateReportRequest | UpdateReportRequest | AddOrUpdateQuestionWithResponsesRequest[]
            >
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore because responseDateExtractor is appropriate for each request but TS cannot tell that
            const fieldsWithDates = responseDateExtractor(request)
            if (fieldsWithDates.every(field => field?.includes(expectedDateString))) {
              return [mockResponse.status, mockResponse.data]
            }
            return [
              400,
              { status: 400, userMessage: 'Invalid input date', developerMessage: '' } satisfies ErrorResponse,
            ]
          })
        await testCase()
      },
    )

    it.each([
      {
        method: 'descriptionAddendums.listForReport',
        url: `/incident-reports/${reportWithDetails.id}/description-addendums`,
        testCase: () => apiClient.descriptionAddendums.listForReport(reportWithDetails.id),
      },
      {
        method: 'descriptionAddendums.addToReport',
        url: `/incident-reports/${reportWithDetails.id}/description-addendums`,
        urlMethod: 'post',
        testCase: () =>
          apiClient.descriptionAddendums.addToReport(reportWithDetails.id, {
            createdBy: 'abc12a',
            firstName: 'MARY',
            lastName: 'JOHNSON',
            text: 'Prisoner was released from hospital',
          }),
      },
      {
        method: 'descriptionAddendums.updateForReport',
        url: `/incident-reports/${reportWithDetails.id}/description-addendums/1`,
        urlMethod: 'patch',
        testCase: () =>
          apiClient.descriptionAddendums.updateForReport(reportWithDetails.id, 1, {
            text: 'Prisoner was released from healthcare',
          }),
      },
      {
        method: 'descriptionAddendums.deleteFromReport',
        url: `/incident-reports/${reportWithDetails.id}/description-addendums/1`,
        urlMethod: 'delete',
        testCase: () => apiClient.descriptionAddendums.deleteFromReport(reportWithDetails.id, 1),
      },
    ])('should work for $method returning a list of description addendums', async ({ url, urlMethod, testCase }) => {
      fakeApiClient
        .intercept(url, urlMethod ?? 'get')
        .query(true)
        .matchHeader('authorization', `Bearer ${accessToken}`)
        .reply(200, [mockDescriptionAddendum(0, now), mockDescriptionAddendum(1, now)])
      const response = await testCase()
      const shouldBeDates = response.map(item => item.createdAt)
      shouldBeDates.forEach(value => expect(value).toBeInstanceOf(Date))
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
            descriptionOfChange: 'Name misspelled',
          }),
      },
      {
        method: 'correctionRequests.updateForReport',
        url: `/incident-reports/${reportWithDetails.id}/correction-requests/1`,
        urlMethod: 'patch',
        testCase: () =>
          apiClient.correctionRequests.updateForReport(reportWithDetails.id, 1, {
            descriptionOfChange: 'Name misspelled',
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
        .matchHeader('authorization', `Bearer ${accessToken}`)
        .reply(200, [mockCorrectionRequest(0, now), mockCorrectionRequest(1, now)])
      const response = await testCase()
      const shouldBeDates = response.map(item => item.correctionRequestedAt)
      shouldBeDates.forEach(value => expect(value).toBeInstanceOf(Date))
    })

    it.each([
      {
        method: 'getQuestions',
        url: `/incident-reports/${basicReport.id}/questions`,
        testCase: () => apiClient.getQuestions(basicReport.id),
      },
      {
        method: 'addOrUpdateQuestionsWithResponses',
        url: `/incident-reports/${basicReport.id}/questions`,
        urlMethod: 'put',
        testCase: () =>
          apiClient.addOrUpdateQuestionsWithResponses(basicReport.id, [
            {
              code: '1',
              question: 'Was the police informed?',
              responses: [{ response: 'Yes', responseDate: now }],
            },
          ]),
      },
      {
        method: 'deleteQuestionsAndTheirResponses',
        url: `/incident-reports/${basicReport.id}/questions`,
        urlMethod: 'delete',
        testCase: () => apiClient.deleteQuestionsAndTheirResponses(basicReport.id, ['1', '2']),
      },
    ])('should work for $method returning a list of question', async ({ url, urlMethod, testCase }) => {
      fakeApiClient
        .intercept(url, urlMethod ?? 'get')
        .query(true)
        .matchHeader('authorization', `Bearer ${accessToken}`)
        .reply(200, [mockQuestion(0, now, 1), mockQuestion(1, now, 2)])
      const response = await testCase()
      const shouldBeDates = response.flatMap(question =>
        question.responses.flatMap(item => [item.responseDate, item.recordedAt]),
      )
      shouldBeDates.forEach(value => expect(value).toBeInstanceOf(Date))
    })
  })

  describe('updates to nullable fields', () => {
    describe.each([
      {
        method: 'staffInvolved.updateForReport',
        url: `/incident-reports/${reportWithDetails.id}/staff-involved/2`,
        nullableFields: ['comment'] as const,
        testCaseAbsentFields: () =>
          apiClient.staffInvolved.updateForReport(reportWithDetails.id, 2, {
            staffRole: 'ACTIVELY_INVOLVED',
            staffUsername: 'abc12a',
          }),
        testCaseNullFields: () =>
          apiClient.staffInvolved.updateForReport(reportWithDetails.id, 2, {
            staffRole: 'ACTIVELY_INVOLVED',
            staffUsername: 'abc12a',
            comment: null,
          }),
        testCaseNonNullFields: () =>
          apiClient.staffInvolved.updateForReport(reportWithDetails.id, 2, {
            staffRole: 'ACTIVELY_INVOLVED',
            staffUsername: 'abc12a',
            comment: 'Staff member helped calm the situation',
          }),
      },
      {
        method: 'prisonersInvolved.updateForReport',
        url: `/incident-reports/${reportWithDetails.id}/prisoners-involved/2`,
        nullableFields: ['outcome', 'comment'] as const,
        testCaseAbsentFields: () =>
          apiClient.prisonersInvolved.updateForReport(reportWithDetails.id, 2, {
            prisonerNumber: 'A1111AA',
            prisonerRole: 'ACTIVE_INVOLVEMENT',
          }),
        testCaseNullFields: () =>
          apiClient.prisonersInvolved.updateForReport(reportWithDetails.id, 2, {
            prisonerNumber: 'A1111AA',
            prisonerRole: 'ACTIVE_INVOLVEMENT',
            outcome: null,
            comment: null,
          }),
        testCaseNonNullFields: () =>
          apiClient.prisonersInvolved.updateForReport(reportWithDetails.id, 2, {
            prisonerNumber: 'A1111AA',
            prisonerRole: 'ACTIVE_INVOLVEMENT',
            outcome: 'SEEN_HEALTHCARE',
            comment: 'Was hurt',
          }),
      },
    ])(
      'in $method request data',
      ({ url, nullableFields, testCaseAbsentFields, testCaseNullFields, testCaseNonNullFields }) => {
        it('should omit fields when they are absent in the request', () => {
          fakeApiClient
            .patch(url)
            .matchHeader('authorization', `Bearer ${accessToken}`)
            .reply((_uri, requestBody) => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore because nock cannot know about request data type
              if (nullableFields.some(fieldName => fieldName in requestBody)) {
                return [
                  400,
                  { status: 400, userMessage: 'Fields should be absent', developerMessage: '' } satisfies ErrorResponse,
                ]
              }
              return [200, []]
            })
          return testCaseAbsentFields()
        })

        it('should include null fields when they are present in the request', () => {
          fakeApiClient.patch(url).reply((_uri, requestBody) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore because nock cannot know about request data type
            if (nullableFields.some(fieldName => requestBody[fieldName] !== null)) {
              return [
                400,
                { status: 400, userMessage: 'Fields should be null', developerMessage: '' } satisfies ErrorResponse,
              ]
            }
            return [200, []]
          })
          return testCaseNullFields()
        })

        it('should include non-null fields when they are present in the request', () => {
          fakeApiClient.patch(url).reply((_uri, requestBody) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore because nock cannot know about request data type
            if (nullableFields.some(fieldName => typeof requestBody[fieldName] !== 'string')) {
              return [
                400,
                { status: 400, userMessage: 'Fields should be strings', developerMessage: '' } satisfies ErrorResponse,
              ]
            }
            return [200, []]
          })
          return testCaseNonNullFields()
        })
      },
    )
  })
})
