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
} from '../../server/data/incidentReportingApi'
import { defaultPageSize } from '../../server/data/incidentReportingApi'

export default {
  stubIncidentReportingApiGetReports: ({
    request,
    reports,
  }: {
    request: Partial<DatesAsStrings<GetReportsParams>>
    reports: ReportBasic[]
  }): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPath: '/incidentReportingApi/incident-reports',
        queryParameters: request,
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
