// eslint-disable-next-line max-classes-per-file
import config from '../config'
import { convertEventWithBasicReportsDates } from './incidentReportingApiUtils'
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
  // TODO: Add enums?
  type: string
  incidentDateAndTime: Date
  prisonId: string
  title: string
  description: string
  reportedBy: string
  reportedAt: Date
  // TODO: Add enums?
  status: string
  assignedTo: string
  createdAt: Date
  modifiedAt: Date
  modifiedBy: string
  createdInNomis: boolean
}

export class IncidentReportingApi extends RestClient {
  constructor(systemToken: string) {
    super('HMPPS Incident Reporting API', config.apis.hmppsIncidentReportingApi, systemToken)
  }

  getEvents(): Promise<PaginatedEventsWithBasicReports> {
    return this.get<DatesAsStrings<PaginatedEventsWithBasicReports>>({ path: '/incident-events' }).then(response => {
      return {
        ...response,
        content: response.content.map(convertEventWithBasicReportsDates),
      }
    })
  }
}
