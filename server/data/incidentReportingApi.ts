// eslint-disable-next-line max-classes-per-file
import config from '../config'
import { convertEventWithBasicReportsDates, toDateString } from './incidentReportingApiUtils'
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

export type EventWithBasicReports = {
  id: string
  eventReference: string
  eventDateAndTime: Date
  prisonId: string
  title: string
  description: string
  createdAt: Date
  modifiedAt: Date
  modifiedBy: string
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
  assignedTo: string
  createdAt: Date
  modifiedAt: Date
  modifiedBy: string
  createdInNomis: boolean
}

// TODO: Add enums?
export type ReportType = string
// TODO: Add enums?
export type ReportStatus = string

export type GetEventsParams = {
  prisonId: string
  eventDateFrom: Date // Inclusive
  eventDateUntil: Date // Inclusive
} & PaginationSortingParams

export type PaginationSortingParams = {
  page: number
  size: number
  // TODO: Add enums?
  sort: string[]
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

    console.debug(query)

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
}
