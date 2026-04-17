import type { SuperAgentRequest } from 'superagent'

import { stubFor } from './wiremock'
import type {
  GetReportsParams,
  PaginatedBasicReports,
  ReportBasic,
  ReportWithDetails,
  CreateReportRequest,
  UpdateReportRequest,
  ChangeStatusRequest,
  ChangeTypeRequest,
  Question,
} from '../../server/data/incidentReportingApi'
import { RelatedObjectUrlSlug, defaultPageSize } from '../../server/data/incidentReportingApi'

export default {
  stubIncidentReportingApiGetReports: ({
    request = {},
    reports = [],
  }: {
    request?: Partial<DatesAsStrings<GetReportsParams>>
    reports?: ReportBasic[]
  } = {}): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPath: '/incidentReportingApi/incident-reports',
        queryParameters: Object.fromEntries(
          Object.entries(request).map(([key, value]) => [
            key,
            Array.isArray(value) ? { or: value.map(v => ({ equalTo: v })) } : { equalTo: value },
          ]),
        ),
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          content: reports,
          number: 0,
          size: defaultPageSize,
          numberOfElements: reports.length,
          totalElements: reports.length,
          totalPages: 1,
          sort: ['incidentDateAndTime,DESC'],
        } satisfies PaginatedBasicReports,
      },
    }),

  stubIncidentReportingApiGetReportById: ({ report }: { report: ReportBasic }): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPath: `/incidentReportingApi/incident-reports/${report.id}`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: report,
      },
    }),
  stubIncidentReportingApiGetReportWithDetailsById: ({ report }: { report: ReportWithDetails }): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPath: `/incidentReportingApi/incident-reports/${report.id}/with-details`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: report,
      },
    }),

  stubIncidentReportingApiGetReportByReference: ({ report }: { report: ReportBasic }): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPath: `/incidentReportingApi/incident-reports/reference/${report.reportReference}`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: report,
      },
    }),
  stubIncidentReportingApiGetReportWithDetailsByReference: ({
    report,
  }: {
    report: ReportWithDetails
  }): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPath: `/incidentReportingApi/incident-reports/reference/${report.reportReference}/with-details`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: report,
      },
    }),

  stubIncidentReportingApiCreateReport: ({
    request,
    report,
  }: {
    request: DatesAsStrings<CreateReportRequest>
    report: ReportWithDetails
  }): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'POST',
        urlPath: '/incidentReportingApi/incident-reports',
        bodyPatterns: [{ equalToJson: request }],
      },
      response: {
        status: 201,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: report,
      },
    }),

  stubIncidentReportingApiUpdateReport: ({
    request,
    report,
  }: {
    request: DatesAsStrings<UpdateReportRequest>
    report: ReportBasic
  }): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'PATCH',
        urlPath: `/incidentReportingApi/incident-reports/${report.id}`,
        bodyPatterns: [{ equalToJson: request }],
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: report,
      },
    }),

  stubIncidentReportingApiChangeReportStatus: ({
    request,
    report,
  }: {
    request: ChangeStatusRequest
    report: ReportWithDetails
  }): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'PATCH',
        urlPath: `/incidentReportingApi/incident-reports/${report.id}/status`,
        bodyPatterns: [{ equalToJson: request }],
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: report,
      },
    }),

  stubIncidentReportingApiChangeReportType: ({
    request,
    report,
  }: {
    request: ChangeTypeRequest
    report: ReportWithDetails
  }): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'PATCH',
        urlPath: `/incidentReportingApi/incident-reports/${report.id}/type`,
        bodyPatterns: [{ equalToJson: request }],
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: report,
      },
    }),

  stubIncidentReportingApiListRelatedObjects: ({
    urlSlug,
    reportId,
    response,
  }: {
    urlSlug: RelatedObjectUrlSlug
    reportId: string
    response: unknown
  }) =>
    stubFor({
      request: {
        method: 'GET',
        urlPath: `/incidentReportingApi/incident-reports/${reportId}/${urlSlug}`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: response,
      },
    }),
  stubIncidentReportingApiCreateRelatedObject: ({
    urlSlug,
    reportId,
    request,
    response,
  }: {
    urlSlug: RelatedObjectUrlSlug
    reportId: string
    request: unknown
    response: unknown
  }) =>
    stubFor({
      request: {
        method: 'POST',
        urlPath: `/incidentReportingApi/incident-reports/${reportId}/${urlSlug}`,
        bodyPatterns: [{ equalToJson: request }],
      },
      response: {
        status: 201,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: response,
      },
    }),
  stubIncidentReportingApiUpdateRelatedObject: ({
    urlSlug,
    reportId,
    index,
    request,
    response,
  }: {
    urlSlug: RelatedObjectUrlSlug
    reportId: string
    index: number
    request: unknown
    response: unknown
  }) =>
    stubFor({
      request: {
        method: 'PATCH',
        urlPath: `/incidentReportingApi/incident-reports/${reportId}/${urlSlug}/${index}`,
        bodyPatterns: [{ equalToJson: request }],
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: response,
      },
    }),
  stubIncidentReportingApiDeleteRelatedObject: ({
    urlSlug,
    reportId,
    index,
    response,
  }: {
    urlSlug: RelatedObjectUrlSlug
    reportId: string
    index: number
    response: unknown
  }) =>
    stubFor({
      request: {
        method: 'DELETE',
        urlPath: `/incidentReportingApi/incident-reports/${reportId}/${urlSlug}/${index}`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: response,
      },
    }),

  stubIncidentReportingApiPutQuestions: ({
    reportId,
    request,
    response,
  }: {
    reportId: string
    request: unknown
    response: Question[]
  }): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'PUT',
        urlPath: `/incidentReportingApi/incident-reports/${reportId}/questions`,
        bodyPatterns: [{ equalToJson: request }],
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: response,
      },
    }),

  stubIncidentReportingData: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPath: '/incidentReportingApi/reports/incident-report/summary',
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: [
          {
            id: '01958507-025f-7907-933e-eae7256e6739',
            report_reference: '10000042',
            type: 'SELF_HARM_1',
            type_description: 'Self-harm',
            status: 'AWAITING_REVIEW',
            status_description: 'Awaiting review',
            incident_date_and_time: '10/03/2025 01:03',
            reported_at: '11/03/2025',
            reported_by: 'TEST_USER',
            title: 'Self-harm (Leeds (HMP))',
            description: 'This is a description about a self-harm.',
            location: 'LEI',
            modified_at: '11/03/2025 11:49',
          },
          {
            id: '01954804-6e0a-766c-8233-d8f6d826fcfd',
            report_reference: '10000033',
            type: 'ASSAULT_5',
            type_description: 'Assault',
            status: 'DRAFT',
            status_description: 'Draft',
            incident_date_and_time: '21/02/2025 01:00',
            reported_at: '27/02/2025',
            reported_by: 'ANOTHER_USER',
            title: 'Assault (Brixton (HMP))',
            description: 'An assault on a prisoner.',
            location: 'BXI',
            modified_at: '28/02/2025 10:58',
          },
        ],
      },
    }),

  stubIncidentReportingDataCount: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPath: '/incidentReportingApi/reports/incident-report/summary/count',
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          count: 2,
        },
      },
    }),

  stubIncidentReportingApiPing: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPath: '/incidentReportingApi/health/ping',
      },
      response: {
        status: 200,
      },
    }),
}
