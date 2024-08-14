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
  /** Elements in this pages */
  content: T[]
  /** Page number (0-based) */
  number: number
  /** Page size */
  size: number
  /** Number of elements in this page */
  numberOfElements: number
  /** Total number of elements in all pages */
  totalElements: number
  /** Total number of pages */
  totalPages: number
  /** Sort orders */
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
  questions: Question[]
  history: HistoricReport[]
  historyOfStatuses: HistoricStatus[]
  staffInvolved: StaffInvolvement[]
  prisonersInvolved: PrisonerInvolvement[]
  correctionRequests: CorrectionRequest[]
}

// TODO: Add enums?
export type ReportType = string
// TODO: Add enums?
export type ReportStatus = string
export type ReportSource = 'DPS' | 'NOMIS'
// TODO: Add enums?
export type StaffRole = string
// TODO: Add enums?
export type PrisonerRole = string
// TODO: Add enums?
export type PrisonerInvolvementOutcome = string
// TODO: Add enums?
export type CorrectionRequestReason = string

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

export type Question = {
  code: string
  question: string
  responses: Response[]
  additionalInformation: string | null
}

export type Response = {
  response: string
  // recordedDate: Date | null // TODO: DatesAsStrings does not work on optional dates
  additionalInformation: string | null
  recordedBy: string
  recordedAt: Date
}

export type HistoricReport = {
  type: ReportType
  changedAt: Date
  changedBy: string
  questions: Question[]
}

export type HistoricStatus = {
  status: ReportStatus
  changedAt: Date
  changedBy: string
}

export type StaffInvolvement = {
  staffUsername: string
  staffRole: StaffRole
  comment: string | null
}

export type PrisonerInvolvement = {
  prisonerNumber: string
  prisonerRole: PrisonerRole
  outcome: PrisonerInvolvementOutcome | null
  comment: string | null
}

export type CorrectionRequest = {
  reason: CorrectionRequestReason
  descriptionOfChange: string
  correctionRequestedBy: string
  correctionRequestedAt: Date
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
      path: `/incident-events/${encodeURIComponent(id)}`,
    }).then(convertEventWithBasicReportsDates)
  }

  getEventByReference(reference: string): Promise<EventWithBasicReports> {
    return this.get<DatesAsStrings<EventWithBasicReports>>({
      path: `/incident-events/reference/${encodeURIComponent(reference)}`,
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
      path: `/incident-reports/${encodeURIComponent(id)}`,
    }).then(convertBasicReportDates)
  }

  getReportByReference(reference: string): Promise<ReportBasic> {
    return this.get<DatesAsStrings<ReportBasic>>({
      path: `/incident-reports/reference/${encodeURIComponent(reference)}`,
    }).then(convertBasicReportDates)
  }

  getReportWithDetailsById(id: string): Promise<ReportWithDetails> {
    return this.get<DatesAsStrings<ReportWithDetails>>({
      path: `/incident-reports/${encodeURIComponent(id)}/with-details`,
    }).then(convertReportWithDetailsDates)
  }

  getReportWithDetailsByReference(reference: string): Promise<ReportWithDetails> {
    return this.get<DatesAsStrings<ReportWithDetails>>({
      path: `/incident-reports/reference/${encodeURIComponent(reference)}/with-details`,
    }).then(convertReportWithDetailsDates)
  }
}
