// eslint-disable-next-line max-classes-per-file
import config from '../config'
import { toDateString } from '../utils/utils'
import {
  convertBasicReportDates,
  convertEventWithBasicReportsDates,
  convertReportWithDetailsDates,
} from './incidentReportingApiUtils'
import RestClient from './restClient'

/**
 * Structure representing an error response from the incentives api
 */
export class ErrorResponse {
  status: number

  errorCode?: number

  userMessage?: string

  developerMessage?: string

  moreInfo?: string

  static isErrorResponse(obj: object): obj is ErrorResponse {
    // TODO: would be nice to make userMessage & developerMessage non-nullable in the api
    return obj && 'status' in obj && typeof obj.status === 'number'
  }
}

export type Paginated<T> = {
  content: T[]
  number: number
  size: number
  numberOfElements: number
  totalPages: number
  sort: string[]
}

export type PaginatedEventsWithBasicReports = Paginated<EventWithBasicReports>
export type PaginatedBasicReports = Paginated<ReportBasic>

export type Event = {
  id: string
  eventReference: string
  eventDateAndTime: Date
  prisonId: string
  title: string
  description: string
  createdAt: Date
  modifiedAt: Date
  modifiedBy: string
}

export type EventWithBasicReports = Event & {
  reports: ReportBasic[]
}

export type ReportBasic = {
  id: string
  reportReference: string
  type: ReportType
  incidentDateAndTime: Date
  prisonId: string
  title: string
  description: string
  reportedBy: string
  reportedAt: Date
  status: ReportStatus
  assignedTo: string | null
  createdAt: Date
  modifiedAt: Date
  modifiedBy: string
  createdInNomis: boolean
}

export type ReportWithDetails = ReportBasic & {
  event: Event
  // TODO: questions
  // TODO: history
  historyOfStatuses: HistoricStatus[]
  // TODO: staffInvolved
  // TODO: prisonersInvolved
  // TODO: correctionRequests
}

// TODO: Add enums?
export type ReportType = string
// TODO: Add enums?
export type ReportStatus = string
export type ReportSource = 'DPS' | 'NOMIS'

export type GetEventsParams = {
  prisonId: string
  eventDateFrom: Date // Inclusive
  eventDateUntil: Date // Inclusive
} & PaginationSortingParams

export type GetReportsParams = {
  prisonId: string
  source: ReportSource
  status: ReportStatus
  type: ReportType
  incidentDateFrom: Date // Inclusive
  incidentDateUntil: Date // Inclusive
  reportedDateFrom: Date // Inclusive
  reportedDateUntil: Date // Inclusive
} & PaginationSortingParams

export type PaginationSortingParams = {
  page: number
  size: number
  // TODO: Add enums?
  sort: string[]
}

export type HistoricStatus = {
  status: ReportStatus
  changedAt: Date
  changedBy: string
}

export class IncidentReportingApi extends RestClient {
  constructor(systemToken: string) {
    super('HMPPS Incident Reporting API', config.apis.hmppsIncidentReportingApi, systemToken)
  }

  getEvents(
    { prisonId, eventDateFrom, eventDateUntil, page, size, sort }: Partial<GetEventsParams> = {
      prisonId: null,
      eventDateFrom: null,
      eventDateUntil: null,
      page: 0,
      size: 20,
      sort: ['eventDateAndTime,DESC'],
    },
  ): Promise<PaginatedEventsWithBasicReports> {
    const query: Partial<DatesAsStrings<GetEventsParams>> = {
      page,
      size,
      sort,
    }
    if (prisonId) {
      query.prisonId = prisonId
    }
    if (eventDateFrom) {
      query.eventDateFrom = toDateString(eventDateFrom)
    }
    if (eventDateUntil) {
      query.eventDateUntil = toDateString(eventDateUntil)
    }

    return this.get<DatesAsStrings<PaginatedEventsWithBasicReports>>({
      path: '/incident-events',
      query,
    }).then(response => {
      return {
        ...response,
        content: response.content.map(convertEventWithBasicReportsDates),
      }
    })
  }

  getEventById(id: string): Promise<EventWithBasicReports> {
    return this.get<DatesAsStrings<EventWithBasicReports>>({
      path: `/incident-events/${id}`,
    }).then(convertEventWithBasicReportsDates)
  }

  getEventByReference(reference: string): Promise<EventWithBasicReports> {
    return this.get<DatesAsStrings<EventWithBasicReports>>({
      path: `/incident-events/reference/${reference}`,
    }).then(convertEventWithBasicReportsDates)
  }

  getReports(
    {
      prisonId,
      source,
      status,
      type,
      incidentDateFrom,
      incidentDateUntil,
      reportedDateFrom,
      reportedDateUntil,
      page,
      size,
      sort,
    }: Partial<GetReportsParams> = {
      prisonId: null,
      source: null,
      status: null,
      type: null,
      incidentDateFrom: null,
      incidentDateUntil: null,
      reportedDateFrom: null,
      reportedDateUntil: null,
      page: 0,
      size: 20,
      sort: ['incidentDateAndTime,DESC'],
    },
  ): Promise<PaginatedBasicReports> {
    const query: Partial<DatesAsStrings<GetReportsParams>> = {
      page,
      size,
      sort,
    }
    if (prisonId) {
      query.prisonId = prisonId
    }
    if (source) {
      query.source = source
    }
    if (status) {
      query.status = status
    }
    if (type) {
      query.type = type
    }
    if (incidentDateFrom) {
      query.incidentDateFrom = toDateString(incidentDateFrom)
    }
    if (incidentDateUntil) {
      query.incidentDateUntil = toDateString(incidentDateUntil)
    }
    if (reportedDateFrom) {
      query.reportedDateFrom = toDateString(reportedDateFrom)
    }
    if (reportedDateUntil) {
      query.reportedDateUntil = toDateString(reportedDateUntil)
    }

    return this.get<DatesAsStrings<PaginatedBasicReports>>({
      path: '/incident-reports',
      query,
    }).then(response => {
      return {
        ...response,
        content: response.content.map(convertBasicReportDates),
      }
    })
  }

  getReportById(id: string): Promise<ReportBasic> {
    return this.get<DatesAsStrings<ReportBasic>>({
      path: `/incident-reports/${id}`,
    }).then(convertBasicReportDates)
  }

  getReportByReference(reference: string): Promise<ReportBasic> {
    return this.get<DatesAsStrings<ReportBasic>>({
      path: `/incident-reports/reference/${reference}`,
    }).then(convertBasicReportDates)
  }

  getReportWithDetailsById(id: string): Promise<ReportWithDetails> {
    return this.get<DatesAsStrings<ReportWithDetails>>({
      path: `/incident-reports/${id}/with-details`,
    }).then(convertReportWithDetailsDates)
  }

  getReportWithDetailsByReference(reference: string): Promise<ReportWithDetails> {
    return this.get<DatesAsStrings<ReportWithDetails>>({
      path: `/incident-reports/reference/${reference}/with-details`,
    }).then(convertReportWithDetailsDates)
  }
}
