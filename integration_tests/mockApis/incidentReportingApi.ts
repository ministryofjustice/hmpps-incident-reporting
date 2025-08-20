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

  stubIncidentReportingDefinitions: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPath: '/incidentReportingApi/definitions',
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: [
          {
            id: 'incident-report',
            name: 'Incident report summary',
            description: 'List of all incidents filtered by dates, types, status and locations (INC0009)',
            variants: [
              {
                id: 'summary',
                name: 'Incident report summary',
                description: 'List of all incidents filtered by dates, types, status and locations',
              },
            ],
            authorised: true,
          },
        ],
      },
    }),

  stubIncidentReportSummaryDefinition: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPath: '/incidentReportingApi/definitions/incident-report/summary',
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          id: 'incident-report',
          name: 'Incident report summary',
          description: 'List of all incidents filtered by dates, types, status and locations (INC0009)',
          variant: {
            id: 'summary',
            name: 'Incident report summary',
            resourceName: 'reports/incident-report/summary',
            description: 'List of all incidents filtered by dates, types, status and locations',
            specification: {
              template: 'list',
              fields: [
                {
                  name: 'id',
                  display: 'Internal ID',
                  sortable: true,
                  defaultsort: false,
                  type: 'string',
                  mandatory: false,
                  visible: false,
                  calculated: false,
                  header: false,
                },
                {
                  name: 'report_reference',
                  display: 'Report Reference',
                  sortable: true,
                  defaultsort: false,
                  type: 'string',
                  mandatory: false,
                  visible: true,
                  calculated: false,
                  header: false,
                },
                {
                  name: 'type',
                  display: 'Type code',
                  filter: {
                    type: 'multiselect',
                    mandatory: false,
                    staticOptions: [
                      {
                        name: 'ASSAULT_5',
                        display: 'Assault',
                      },
                      {
                        name: 'SELF_HARM_1',
                        display: 'Self harm',
                      },
                    ],
                    interactive: false,
                  },
                  sortable: false,
                  defaultsort: false,
                  type: 'string',
                  mandatory: false,
                  visible: false,
                  calculated: false,
                  header: false,
                },
                {
                  name: 'type_description',
                  display: 'Incident type',
                  sortable: true,
                  defaultsort: false,
                  type: 'string',
                  mandatory: false,
                  visible: true,
                  calculated: false,
                  header: false,
                },
                {
                  name: 'status',
                  display: 'Status code',
                  filter: {
                    type: 'multiselect',
                    mandatory: false,
                    staticOptions: [
                      {
                        name: 'AWAITING_REVIEW',
                        display: 'Awaiting review',
                      },
                      {
                        name: 'CLOSED',
                        display: 'Closed',
                      },
                      {
                        name: 'DRAFT',
                        display: 'Draft',
                      },
                    ],
                    interactive: false,
                  },
                  sortable: false,
                  defaultsort: false,
                  type: 'string',
                  mandatory: false,
                  visible: false,
                  calculated: false,
                  header: false,
                },
                {
                  name: 'status_description',
                  display: 'Incident status',
                  sortable: true,
                  defaultsort: false,
                  type: 'string',
                  mandatory: false,
                  visible: true,
                  calculated: false,
                  header: false,
                },
                {
                  name: 'incident_date_and_time',
                  display: 'Occurrence at',
                  filter: {
                    type: 'daterange',
                    mandatory: false,
                    defaultValue: '2025-02-12 - 2025-03-12',
                    interactive: false,
                  },
                  sortable: true,
                  defaultsort: false,
                  type: 'date',
                  mandatory: false,
                  visible: true,
                  calculated: true,
                  header: false,
                },
                {
                  name: 'reported_at',
                  display: 'Reported on',
                  sortable: true,
                  defaultsort: false,
                  type: 'date',
                  mandatory: false,
                  visible: false,
                  calculated: true,
                  header: false,
                },
                {
                  name: 'reported_by',
                  display: 'Reported by',
                  sortable: false,
                  defaultsort: false,
                  type: 'string',
                  mandatory: false,
                  visible: true,
                  calculated: false,
                  header: false,
                },
                {
                  name: 'title',
                  display: 'Incident title',
                  sortable: false,
                  defaultsort: false,
                  type: 'string',
                  mandatory: false,
                  visible: false,
                  calculated: false,
                  header: false,
                },
                {
                  name: 'description',
                  display: 'Incident description',
                  sortable: false,
                  defaultsort: false,
                  type: 'string',
                  mandatory: false,
                  visible: true,
                  calculated: false,
                  header: false,
                },
                {
                  name: 'location',
                  display: 'Location of incident',
                  filter: {
                    type: 'multiselect',
                    mandatory: false,
                    staticOptions: [
                      {
                        name: 'BXI',
                        display: 'Brixton (HMP)',
                      },
                      {
                        name: 'LEI',
                        display: 'Leeds (HMP)',
                      },
                    ],
                    defaultValue: 'BXI,LEI',
                    interactive: false,
                  },
                  sortable: true,
                  defaultsort: false,
                  type: 'string',
                  mandatory: false,
                  visible: true,
                  calculated: false,
                  header: false,
                },
                {
                  name: 'modified_at',
                  display: 'Last Updated',
                  sortable: true,
                  defaultsort: true,
                  type: 'date',
                  mandatory: false,
                  visible: false,
                  calculated: true,
                  header: false,
                },
              ],
              sections: [],
            },
            printable: true,
            summaries: [
              {
                id: 'summaryId',
                template: 'page-header',
                fields: [
                  {
                    name: 'id',
                    type: 'string',
                    header: null,
                    mergeRows: null,
                  },
                  {
                    name: 'report_reference',
                    type: 'string',
                  },
                  {
                    name: 'type',
                    type: 'string',
                  },
                  {
                    name: 'type_description',
                    type: 'string',
                  },
                  {
                    name: 'status_description',
                    type: 'string',
                  },
                  {
                    name: 'status',
                    type: 'string',
                  },
                  {
                    name: 'incident_date_and_time',
                    type: 'date',
                  },
                  {
                    name: 'location',
                    type: 'string',
                  },
                  {
                    name: 'reported_at',
                    type: 'date',
                  },
                  {
                    name: 'reported_by',
                    type: 'string',
                  },
                  {
                    name: 'title',
                    type: 'string',
                  },
                  {
                    name: 'description',
                    type: 'string',
                  },
                  {
                    name: 'modified_at',
                    type: 'date',
                  },
                ],
              },
            ],
          },
        },
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
            type_description: 'Self harm',
            status: 'AWAITING_REVIEW',
            status_description: 'Awaiting review',
            incident_date_and_time: '10/03/2025 01:03',
            reported_at: '11/03/2025',
            reported_by: 'TEST_USER',
            title: 'Self harm (Leeds (HMP))',
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
