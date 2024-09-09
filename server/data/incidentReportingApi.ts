// eslint-disable-next-line max-classes-per-file
import config from '../config'
import format from '../utils/format'
import {
  convertBasicReportDates,
  convertCorrectionRequestDates,
  convertEventWithBasicReportsDates,
  convertQuestionDates,
  convertReportWithDetailsDates,
} from './incidentReportingApiUtils'
import RestClient from './restClient'

/**
 * Structure representing an error response from the incident reporting api
 *
 * Defined in uk.gov.justice.digital.hmpps.incidentreporting.resource.ErrorResponse class
 * see https://github.com/ministryofjustice/hmpps-incident-reporting-api
 */
export interface ErrorResponse {
  status: number
  errorCode?: ErrorCode
  userMessage: string
  developerMessage: string
  moreInfo?: string
}

export function isErrorResponse(obj: unknown): obj is ErrorResponse {
  // TODO: would be nice to make userMessage & developerMessage non-nullable in the api
  return typeof obj === 'object' && 'status' in obj && typeof obj.status === 'number' && 'userMessage' in obj
}

/**
 * Unique codes to discriminate errors returned from the incident reporting api
 *
 * Defined in uuk.gov.justice.digital.hmpps.incidentreporting.resource.ErrorCode enumeration
 * see https://github.com/ministryofjustice/hmpps-incident-reporting-api
 */
export enum ErrorCode {
  ValidationFailure = 100,
  EventNotFound = 201,
  ReportNotFound = 301,
  ReportAlreadyExists = 302,
}

export const defaultPageSize = 20

export interface Page<T> {
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

export type PaginatedEventsWithBasicReports = Page<EventWithBasicReports>
export type PaginatedBasicReports = Page<ReportBasic>

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

// TODO: Add enums or load from api constants endpoint?
export type ReportType = string
// TODO: Add enums or load from api constants endpoint?
export type ReportStatus = string
export type ReportSource = 'DPS' | 'NOMIS'
// TODO: Add enums or load from api constants endpoint?
export type StaffRole = string
// TODO: Add enums or load from api constants endpoint?
export type PrisonerRole = string
// TODO: Add enums or load from api constants endpoint?
export type PrisonerInvolvementOutcome = string
// TODO: Add enums or load from api constants endpoint?
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
  involvingStaffUsername: string
  involvingPrisonerNumber: string
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
  responseDate: Date | null
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

export type CreateReportRequest = {
  type: string
  incidentDateAndTime: Date
  prisonId: string
  title: string
  description: string
  createNewEvent: boolean
  linkedEventReference?: string
}

export type UpdateReportRequest = {
  incidentDateAndTime?: Date
  prisonId?: string
  title?: string
  description?: string
  updateEvent?: boolean
}

export type ChangeStatusRequest = { newStatus: ReportStatus }
export type ChangeTypeRequest = { newType: ReportType }

export type AddQuestionWithResponsesRequest = {
  code: string
  question: string
  responses: AddQuestionResponseRequest[]
  additionalInformation?: string
}

type AddQuestionResponseRequest = {
  response: string
  responseDate?: Date
  additionalInformation?: string
}

export class IncidentReportingApi extends RestClient {
  constructor(systemToken: string) {
    super('HMPPS Incident Reporting API', config.apis.hmppsIncidentReportingApi, systemToken)
  }

  async getEvents(
    { prisonId, eventDateFrom, eventDateUntil, page, size, sort }: Partial<GetEventsParams> = {
      prisonId: null,
      eventDateFrom: null,
      eventDateUntil: null,
      page: 0,
      size: defaultPageSize,
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
      query.eventDateFrom = format.isoDate(eventDateFrom)
    }
    if (eventDateUntil) {
      query.eventDateUntil = format.isoDate(eventDateUntil)
    }

    const response = await this.get<DatesAsStrings<PaginatedEventsWithBasicReports>>({
      path: '/incident-events',
      query,
    })
    return {
      ...response,
      content: response.content.map(convertEventWithBasicReportsDates),
    }
  }

  async getEventById(id: string): Promise<EventWithBasicReports> {
    const event = await this.get<DatesAsStrings<EventWithBasicReports>>({
      path: `/incident-events/${encodeURIComponent(id)}`,
    })
    return convertEventWithBasicReportsDates(event)
  }

  async getEventByReference(reference: string): Promise<EventWithBasicReports> {
    const event = await this.get<DatesAsStrings<EventWithBasicReports>>({
      path: `/incident-events/reference/${encodeURIComponent(reference)}`,
    })
    return convertEventWithBasicReportsDates(event)
  }

  async getReports(
    {
      prisonId,
      source,
      status,
      type,
      incidentDateFrom,
      incidentDateUntil,
      reportedDateFrom,
      reportedDateUntil,
      involvingStaffUsername,
      involvingPrisonerNumber,
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
      involvingStaffUsername: null,
      involvingPrisonerNumber: null,
      page: 0,
      size: defaultPageSize,
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
      query.incidentDateFrom = format.isoDate(incidentDateFrom)
    }
    if (incidentDateUntil) {
      query.incidentDateUntil = format.isoDate(incidentDateUntil)
    }
    if (reportedDateFrom) {
      query.reportedDateFrom = format.isoDate(reportedDateFrom)
    }
    if (reportedDateUntil) {
      query.reportedDateUntil = format.isoDate(reportedDateUntil)
    }
    if (involvingStaffUsername) {
      query.involvingStaffUsername = involvingStaffUsername
    }
    if (involvingPrisonerNumber) {
      query.involvingPrisonerNumber = involvingPrisonerNumber
    }

    const response = await this.get<DatesAsStrings<PaginatedBasicReports>>({
      path: '/incident-reports',
      query,
    })
    return {
      ...response,
      content: response.content.map(convertBasicReportDates),
    }
  }

  async getReportById(id: string): Promise<ReportBasic> {
    const report = await this.get<DatesAsStrings<ReportBasic>>({
      path: `/incident-reports/${encodeURIComponent(id)}`,
    })
    return convertBasicReportDates(report)
  }

  async getReportByReference(reference: string): Promise<ReportBasic> {
    const report = await this.get<DatesAsStrings<ReportBasic>>({
      path: `/incident-reports/reference/${encodeURIComponent(reference)}`,
    })
    return convertBasicReportDates(report)
  }

  async getReportWithDetailsById(id: string): Promise<ReportWithDetails> {
    const report = await this.get<DatesAsStrings<ReportWithDetails>>({
      path: `/incident-reports/${encodeURIComponent(id)}/with-details`,
    })
    return convertReportWithDetailsDates(report)
  }

  async getReportWithDetailsByReference(reference: string): Promise<ReportWithDetails> {
    const report = await this.get<DatesAsStrings<ReportWithDetails>>({
      path: `/incident-reports/reference/${encodeURIComponent(reference)}/with-details`,
    })
    return convertReportWithDetailsDates(report)
  }

  async createReport(data: CreateReportRequest): Promise<ReportWithDetails> {
    const dataWithDatesAsStrings: DatesAsStrings<CreateReportRequest> = {
      ...data,
      incidentDateAndTime: data.incidentDateAndTime.toISOString(),
    }
    const report = await this.post<DatesAsStrings<ReportWithDetails>>({
      path: '/incident-reports',
      data: dataWithDatesAsStrings,
    })
    return convertReportWithDetailsDates(report)
  }

  async updateReport(id: string, data: UpdateReportRequest): Promise<ReportBasic> {
    const dataWithDatesAsStrings: DatesAsStrings<UpdateReportRequest> = {
      ...data,
      incidentDateAndTime: data.incidentDateAndTime?.toISOString(),
    }
    const report = await this.patch<DatesAsStrings<ReportBasic>>({
      path: `/incident-reports/${encodeURIComponent(id)}`,
      data: dataWithDatesAsStrings,
    })
    return convertBasicReportDates(report)
  }

  async changeReportStatus(id: string, data: ChangeStatusRequest): Promise<ReportWithDetails> {
    const report = await this.patch<DatesAsStrings<ReportWithDetails>>({
      path: `/incident-reports/${encodeURIComponent(id)}/status`,
      data,
    })
    return convertReportWithDetailsDates(report)
  }

  async changeReportType(id: string, data: ChangeTypeRequest): Promise<ReportWithDetails> {
    const report = await this.patch<DatesAsStrings<ReportWithDetails>>({
      path: `/incident-reports/${encodeURIComponent(id)}/type`,
      data,
    })
    return convertReportWithDetailsDates(report)
  }

  async deleteReport(id: string, deleteOrphanedEvents: boolean = true): Promise<ReportWithDetails> {
    const report = await this.delete<DatesAsStrings<ReportWithDetails>>({
      path: `/incident-reports/${encodeURIComponent(id)}`,
      query: { deleteOrphanedEvents },
    })
    return convertReportWithDetailsDates(report)
  }

  get staffInvolved(): RelatedObjects<StaffInvolvement, AddStaffInvolvementRequest, UpdateStaffInvolvementRequest> {
    return new RelatedObjects(this, 'staff-involved')
  }

  get prisonersInvolved(): RelatedObjects<
    PrisonerInvolvement,
    AddPrisonerInvolvementRequest,
    UpdatePrisonerInvolvementRequest
  > {
    return new RelatedObjects(this, 'prisoners-involved')
  }

  get correctionRequests(): RelatedObjects<
    CorrectionRequest,
    AddCorrectionRequestRequest,
    UpdateCorrectionRequestRequest
  > {
    return new RelatedObjects(this, 'correction-requests', convertCorrectionRequestDates)
  }

  async getQuestions(reportId: string): Promise<Question[]> {
    const questions = await this.get<DatesAsStrings<Question[]>>({
      path: `/incident-reports/${encodeURIComponent(reportId)}/questions`,
    })
    return questions.map(convertQuestionDates)
  }

  async addQuestionWithResponses(
    reportId: string,
    questionWithResponses: AddQuestionWithResponsesRequest,
  ): Promise<Question[]> {
    const data: DatesAsStrings<AddQuestionWithResponsesRequest> = {
      ...questionWithResponses,
      responses: questionWithResponses.responses.map(response => ({
        ...response,
        responseDate: response.responseDate?.toISOString(),
      })),
    }
    const questions = await this.post<DatesAsStrings<Question[]>>({
      path: `/incident-reports/${encodeURIComponent(reportId)}/questions`,
      data,
    })
    return questions.map(convertQuestionDates)
  }

  async deleteLastQuestionAndItsResponses(reportId: string): Promise<Question[]> {
    const questions = await this.delete<DatesAsStrings<Question[]>>({
      path: `/incident-reports/${encodeURIComponent(reportId)}/questions`,
    })
    return questions.map(convertQuestionDates)
  }
}

type AddStaffInvolvementRequest = {
  staffUsername: string
  staffRole: StaffRole
  comment?: string
}

type UpdateStaffInvolvementRequest = {
  staffUsername?: string
  staffRole?: string
  comment?: string | null
}

type AddPrisonerInvolvementRequest = {
  prisonerNumber: string
  prisonerRole: PrisonerRole
  outcome?: PrisonerInvolvementOutcome
  comment?: string
}

type UpdatePrisonerInvolvementRequest = {
  prisonerNumber?: string
  prisonerRole?: PrisonerRole
  outcome?: PrisonerInvolvementOutcome | null
  comment?: string | null
}

type AddCorrectionRequestRequest = {
  reason: CorrectionRequestReason
  descriptionOfChange: string
}

type UpdateCorrectionRequestRequest = {
  reason?: CorrectionRequestReason
  descriptionOfChange?: string
}

class RelatedObjects<
  ResponseType,
  AddRequestType extends Record<string, unknown>,
  UpdateRequestType extends Record<string, unknown>,
> {
  constructor(
    private readonly apiClient: IncidentReportingApi,
    private readonly urlSlug: string,
    responseDateConverter?: (response: DatesAsStrings<ResponseType>) => ResponseType,
  ) {
    this.responseDateConverter =
      responseDateConverter ?? ((response: DatesAsStrings<ResponseType>) => response as ResponseType)
  }

  private readonly responseDateConverter: (response: DatesAsStrings<ResponseType>) => ResponseType

  private listUrl(reportId: string): string {
    return `/incident-reports/${encodeURIComponent(reportId)}/${this.urlSlug}`
  }

  private itemUrl(reportId: string, index: number): string {
    return `/incident-reports/${encodeURIComponent(reportId)}/${this.urlSlug}/${encodeURIComponent(index)}`
  }

  async listForReport(reportId: string): Promise<ResponseType[]> {
    const response = await this.apiClient.get<DatesAsStrings<ResponseType>[]>({
      path: this.listUrl(reportId),
    })
    return response.map(this.responseDateConverter)
  }

  async addToReport(reportId: string, data: AddRequestType): Promise<ResponseType[]> {
    const response = await this.apiClient.post<DatesAsStrings<ResponseType>[]>({
      path: this.listUrl(reportId),
      data,
    })
    return response.map(this.responseDateConverter)
  }

  async updateForReport(reportId: string, index: number, data: UpdateRequestType): Promise<ResponseType[]> {
    const response = await this.apiClient.patch<DatesAsStrings<ResponseType>[]>({
      path: this.itemUrl(reportId, index),
      data,
    })
    return response.map(this.responseDateConverter)
  }

  async deleteFromReport(reportId: string, index: number): Promise<ResponseType[]> {
    const response = await this.apiClient.delete<DatesAsStrings<ResponseType>[]>({
      path: this.itemUrl(reportId, index),
    })
    return response.map(this.responseDateConverter)
  }
}
