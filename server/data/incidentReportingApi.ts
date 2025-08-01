// eslint-disable-next-line max-classes-per-file
import { asSystem, RestClient } from '@ministryofjustice/hmpps-rest-client'
import config from '../config'
import logger from '../../logger'
import format from '../utils/format'
import type {
  ErrorCode,
  InformationSource,
  PrisonerInvolvementOutcome,
  PrisonerInvolvementRole,
  StaffInvolvementRole,
  Status,
  Type,
} from '../reportConfiguration/constants'
import type { ApiUserAction, ApiUserType } from '../middleware/permissions'
import {
  convertBasicReportDates,
  convertCorrectionRequestDates,
  convertDescriptionAddendumDates,
  convertQuestionDates,
  convertReportWithDetailsDates,
} from './incidentReportingApiUtils'

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

export type PaginatedBasicReports = Page<ReportBasic>

export type ReportBasic = {
  id: string
  reportReference: string
  type: Type
  incidentDateAndTime: Date
  location: string
  title: string
  description: string
  reportedBy: string
  reportedAt: Date
  status: Status
  createdAt: Date
  modifiedAt: Date
  modifiedBy: string
  createdInNomis: boolean
  lastModifiedInNomis: boolean
  duplicatedReportId: string
}

export type ReportWithDetails = ReportBasic & {
  descriptionAddendums: DescriptionAddendum[]
  questions: Question[]
  history: HistoricReport[]
  historyOfStatuses: HistoricStatus[]
  staffInvolved: StaffInvolvement[]
  prisonersInvolved: PrisonerInvolvement[]
  correctionRequests: CorrectionRequest[]
  staffInvolvementDone: boolean
  prisonerInvolvementDone: boolean
}

export type GetReportsParams = {
  reference: string
  location: string | string[]
  source: InformationSource
  status: Status | Status[]
  type: Type | Type[]
  incidentDateFrom: Date // Inclusive
  incidentDateUntil: Date // Inclusive
  reportedDateFrom: Date // Inclusive
  reportedDateUntil: Date // Inclusive
  reportedByUsername: string
  involvingStaffUsername: string
  involvingPrisonerNumber: string
} & PaginationSortingParams

export type PaginationSortingParams = {
  page: number
  size: number
  // TODO: Add enums?
  sort: string[]
}

export type DescriptionAddendum = {
  createdBy: string
  createdAt: Date
  firstName: string
  lastName: string
  text: string
}

export type Question = {
  code: string
  question: string
  label: string
  responses: Response[]
  additionalInformation: string | null
}

export type Response = {
  code: string
  response: string
  label: string
  responseDate: Date | null
  additionalInformation: string | null
  recordedBy: string
  recordedAt: Date
}

export type HistoricReport = {
  type: Type
  changedAt: Date
  changedBy: string
  questions: Question[]
}

export type HistoricStatus = {
  status: Status
  changedAt: Date
  changedBy: string
}

export type StaffInvolvement = {
  staffUsername: string | null
  firstName: string
  lastName: string
  staffRole: StaffInvolvementRole
  comment: string | null
}

export type PrisonerInvolvement = {
  prisonerNumber: string
  firstName: string
  lastName: string
  prisonerRole: PrisonerInvolvementRole
  outcome: PrisonerInvolvementOutcome | null
  comment: string | null
}

export type CorrectionRequest = {
  descriptionOfChange: string
  userType?: ApiUserType
  userAction?: ApiUserAction
  originalReportReference?: string
  correctionRequestedBy: string
  correctionRequestedAt: Date
}

export type CreateReportRequest = {
  type: string
  incidentDateAndTime: Date
  location: string
  title: string
  description: string
}

export type UpdateReportRequest = {
  incidentDateAndTime?: Date
  location?: string
  title?: string
  description?: string
  staffInvolvementDone?: boolean
  prisonerInvolvementDone?: boolean
  duplicatedReportId?: string
}

export type ChangeStatusRequest = { newStatus: Status }
export type ChangeTypeRequest = { newType: Type }

export type AddOrUpdateQuestionWithResponsesRequest = {
  code: string
  question: string
  label: string
  responses: AddOrUpdateQuestionResponseRequest[]
  additionalInformation?: string
}

export type AddOrUpdateQuestionResponseRequest = {
  code: string
  response: string
  label: string
  responseDate?: Date
  additionalInformation?: string
}

export type ManagementReportDefinition = {
  id: string
  name: string
  description: string
  variants: ReportVariant[]
  authorised: boolean
}

export type ReportVariant = {
  id: string
  name: string
  description: string
}

export class IncidentReportingApi extends RestClient {
  constructor(systemToken: string) {
    super('HMPPS Incident Reporting API', config.apis.hmppsIncidentReportingApi, logger, {
      getToken: async () => systemToken,
    })
  }

  get constants(): Constants {
    return new Constants(this)
  }

  async getReports(
    {
      reference,
      location,
      source,
      status,
      type,
      incidentDateFrom,
      incidentDateUntil,
      reportedDateFrom,
      reportedDateUntil,
      reportedByUsername,
      involvingStaffUsername,
      involvingPrisonerNumber,
      page,
      size,
      sort,
    }: Partial<GetReportsParams> = {
      reference: null,
      location: null,
      source: null,
      status: null,
      type: null,
      incidentDateFrom: null,
      incidentDateUntil: null,
      reportedDateFrom: null,
      reportedDateUntil: null,
      reportedByUsername: null,
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
    if (reference) {
      query.reference = reference
    }
    if (location) {
      query.location = location
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
    if (reportedByUsername) {
      query.reportedByUsername = reportedByUsername
    }
    if (involvingStaffUsername) {
      query.involvingStaffUsername = involvingStaffUsername
    }
    if (involvingPrisonerNumber) {
      query.involvingPrisonerNumber = involvingPrisonerNumber
    }

    const response = await this.get<DatesAsStrings<PaginatedBasicReports>>(
      {
        path: '/incident-reports',
        query,
      },
      asSystem(),
    )
    return {
      ...response,
      content: response.content.map(convertBasicReportDates),
    }
  }

  async getReportById(id: string): Promise<ReportBasic> {
    const report = await this.get<DatesAsStrings<ReportBasic>>(
      {
        path: `/incident-reports/${encodeURIComponent(id)}`,
      },
      asSystem(),
    )
    return convertBasicReportDates(report)
  }

  async getReportByReference(reference: string): Promise<ReportBasic> {
    const report = await this.get<DatesAsStrings<ReportBasic>>(
      {
        path: `/incident-reports/reference/${encodeURIComponent(reference)}`,
      },
      asSystem(),
    )
    return convertBasicReportDates(report)
  }

  async getManagementReportDefinitions(): Promise<ManagementReportDefinition[]> {
    return this.get<ManagementReportDefinition[]>(
      {
        path: `/definitions`,
      },
      asSystem(),
    )
  }

  async getReportWithDetailsById(id: string): Promise<ReportWithDetails> {
    const report = await this.get<DatesAsStrings<ReportWithDetails>>(
      {
        path: `/incident-reports/${encodeURIComponent(id)}/with-details`,
      },
      asSystem(),
    )
    return convertReportWithDetailsDates(report)
  }

  async getReportWithDetailsByReference(reference: string): Promise<ReportWithDetails> {
    const report = await this.get<DatesAsStrings<ReportWithDetails>>(
      {
        path: `/incident-reports/reference/${encodeURIComponent(reference)}/with-details`,
      },
      asSystem(),
    )
    return convertReportWithDetailsDates(report)
  }

  async createReport(data: CreateReportRequest): Promise<ReportWithDetails> {
    const dataWithDatesAsStrings: DatesAsStrings<CreateReportRequest> = {
      ...data,
      incidentDateAndTime: format.isoDateTime(data.incidentDateAndTime),
    }
    const report = await this.post<DatesAsStrings<ReportWithDetails>>(
      {
        path: '/incident-reports',
        data: dataWithDatesAsStrings,
      },
      asSystem(),
    )
    return convertReportWithDetailsDates(report)
  }

  async updateReport(id: string, data: UpdateReportRequest): Promise<ReportBasic> {
    const dataWithDatesAsStrings: DatesAsStrings<UpdateReportRequest> = {
      ...data,
      incidentDateAndTime: format.isoDateTime(data.incidentDateAndTime),
    }
    const report = await this.patch<DatesAsStrings<ReportBasic>>(
      {
        path: `/incident-reports/${encodeURIComponent(id)}`,
        data: dataWithDatesAsStrings,
      },
      asSystem(),
    )
    return convertBasicReportDates(report)
  }

  async changeReportStatus(id: string, data: ChangeStatusRequest): Promise<ReportWithDetails> {
    const report = await this.patch<DatesAsStrings<ReportWithDetails>>(
      {
        path: `/incident-reports/${encodeURIComponent(id)}/status`,
        data,
      },
      asSystem(),
    )
    return convertReportWithDetailsDates(report)
  }

  async changeReportType(id: string, data: ChangeTypeRequest): Promise<ReportWithDetails> {
    const report = await this.patch<DatesAsStrings<ReportWithDetails>>(
      {
        path: `/incident-reports/${encodeURIComponent(id)}/type`,
        data,
      },
      asSystem(),
    )
    return convertReportWithDetailsDates(report)
  }

  async deleteReport(id: string): Promise<ReportWithDetails> {
    const report = await this.delete<DatesAsStrings<ReportWithDetails>>(
      {
        path: `/incident-reports/${encodeURIComponent(id)}`,
      },
      asSystem(),
    )
    return convertReportWithDetailsDates(report)
  }

  get descriptionAddendums(): RelatedObjects<
    DescriptionAddendum,
    AddDescriptionAddendumRequest,
    UpdateDescriptionAddendumRequest
  > {
    return new RelatedObjects(this, RelatedObjectUrlSlug.descriptionAddendums, convertDescriptionAddendumDates)
  }

  get staffInvolved(): RelatedObjects<StaffInvolvement, AddStaffInvolvementRequest, UpdateStaffInvolvementRequest> {
    return new RelatedObjects(this, RelatedObjectUrlSlug.staffInvolved)
  }

  get prisonersInvolved(): RelatedObjects<
    PrisonerInvolvement,
    AddPrisonerInvolvementRequest,
    UpdatePrisonerInvolvementRequest
  > {
    return new RelatedObjects(this, RelatedObjectUrlSlug.prisonersInvolved)
  }

  get correctionRequests(): RelatedObjects<
    CorrectionRequest,
    AddCorrectionRequestRequest,
    UpdateCorrectionRequestRequest
  > {
    return new RelatedObjects(this, RelatedObjectUrlSlug.correctionRequests, convertCorrectionRequestDates)
  }

  async getQuestions(reportId: string): Promise<Question[]> {
    const questions = await this.get<DatesAsStrings<Question[]>>(
      {
        path: `/incident-reports/${encodeURIComponent(reportId)}/questions`,
      },
      asSystem(),
    )
    return questions.map(convertQuestionDates)
  }

  async addOrUpdateQuestionsWithResponses(
    reportId: string,
    requests: AddOrUpdateQuestionWithResponsesRequest[],
  ): Promise<Question[]> {
    const data: DatesAsStrings<AddOrUpdateQuestionWithResponsesRequest>[] = requests.map(request => ({
      ...request,
      responses: request.responses.map(response => ({
        ...response,
        responseDate: format.isoDate(response.responseDate),
      })),
    }))
    const questions = await this.put<DatesAsStrings<Question[]>>(
      {
        path: `/incident-reports/${encodeURIComponent(reportId)}/questions`,
        data: data as unknown as Record<string, unknown>,
      },
      asSystem(),
    )
    return questions.map(convertQuestionDates)
  }

  async deleteQuestionsAndTheirResponses(reportId: string, questionCodes: string[]): Promise<Question[]> {
    const questions = await this.delete<DatesAsStrings<Question[]>>(
      {
        path: `/incident-reports/${encodeURIComponent(reportId)}/questions`,
        query: { code: questionCodes },
      },
      asSystem(),
    )
    return questions.map(convertQuestionDates)
  }
}

export type AddDescriptionAddendumRequest = {
  createdBy?: string
  createdAt?: Date
  firstName: string
  lastName: string
  text: string
}

export type UpdateDescriptionAddendumRequest = {
  createdBy?: string
  createdAt?: Date | null
  firstName?: string
  lastName?: string
  text?: string
}

export type AddStaffInvolvementRequest = {
  staffUsername?: string
  firstName: string
  lastName: string
  staffRole: StaffInvolvementRole
  comment?: string
}

export type UpdateStaffInvolvementRequest = {
  staffUsername?: string | null
  firstName?: string
  lastName?: string
  staffRole?: string
  comment?: string | null
}

export type AddPrisonerInvolvementRequest = {
  prisonerNumber: string
  firstName: string
  lastName: string
  prisonerRole: PrisonerInvolvementRole
  outcome?: PrisonerInvolvementOutcome
  comment?: string
}

export type UpdatePrisonerInvolvementRequest = {
  prisonerNumber?: string
  firstName?: string
  lastName?: string
  prisonerRole?: PrisonerInvolvementRole
  outcome?: PrisonerInvolvementOutcome | null
  comment?: string | null
}

export type AddCorrectionRequestRequest = {
  descriptionOfChange: string
  userType?: ApiUserType
  userAction?: ApiUserAction
  originalReportReference?: string
}

export type UpdateCorrectionRequestRequest = {
  descriptionOfChange?: string
  userType?: ApiUserType | null
  userAction?: ApiUserAction | null
  originalReportReference?: string | null
}

export enum RelatedObjectUrlSlug {
  descriptionAddendums = 'description-addendums',
  prisonersInvolved = 'prisoners-involved',
  staffInvolved = 'staff-involved',
  correctionRequests = 'correction-requests',
}

export class RelatedObjects<
  ResponseType,
  AddRequestType extends Record<string, unknown>,
  UpdateRequestType extends Record<string, unknown>,
> {
  constructor(
    private readonly apiClient: IncidentReportingApi,
    private readonly urlSlug: RelatedObjectUrlSlug,
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
    const response = await this.apiClient.get<DatesAsStrings<ResponseType>[]>(
      {
        path: this.listUrl(reportId),
      },
      asSystem(),
    )
    return response.map(this.responseDateConverter)
  }

  async addToReport(reportId: string, data: AddRequestType): Promise<ResponseType[]> {
    const response = await this.apiClient.post<DatesAsStrings<ResponseType>[]>(
      {
        path: this.listUrl(reportId),
        data,
      },
      asSystem(),
    )
    return response.map(this.responseDateConverter)
  }

  async updateForReport(reportId: string, index: number, data: UpdateRequestType): Promise<ResponseType[]> {
    const response = await this.apiClient.patch<DatesAsStrings<ResponseType>[]>(
      {
        path: this.itemUrl(reportId, index),
        data,
      },
      asSystem(),
    )
    return response.map(this.responseDateConverter)
  }

  async deleteFromReport(reportId: string, index: number): Promise<ResponseType[]> {
    const response = await this.apiClient.delete<DatesAsStrings<ResponseType>[]>(
      {
        path: this.itemUrl(reportId, index),
      },
      asSystem(),
    )
    return response.map(this.responseDateConverter)
  }
}

export interface Constant {
  code: string
  description: string
}

export interface TypeConstant extends Constant {
  familyCode: string
  active: boolean
  /** @deprecated */
  nomisCode: string
}

export interface StaffRoleConstant extends Constant {
  /** @deprecated */
  nomisCodes: string[]
}

export interface PrisonerRoleConstant extends Constant {
  /** @deprecated */
  nomisCode: string
}

export interface PrisonerOutcomeConstant extends Constant {
  /** @deprecated */
  nomisCode: string
}

class Constants {
  constructor(private readonly apiClient: IncidentReportingApi) {}

  private listConstants<T extends Constant>(urlSlug: string): Promise<T[]> {
    return this.apiClient.get(
      {
        path: `/constants/${urlSlug}`,
      },
      asSystem(),
    )
  }

  types(): Promise<TypeConstant[]> {
    return this.listConstants('types')
  }

  typeFamilies(): Promise<Constant[]> {
    return this.listConstants('type-families')
  }

  statuses(): Promise<Constant[]> {
    return this.listConstants('statuses')
  }

  informationSources(): Promise<Constant[]> {
    return this.listConstants('information-sources')
  }

  staffInvolvementRoles(): Promise<StaffRoleConstant[]> {
    return this.listConstants('staff-roles')
  }

  prisonerInvolvementRoles(): Promise<PrisonerRoleConstant[]> {
    return this.listConstants('prisoner-roles')
  }

  prisonerInvolvementOutcomes(): Promise<PrisonerOutcomeConstant[]> {
    return this.listConstants('prisoner-outcomes')
  }

  errorCodes(): Promise<Constant[]> {
    return this.listConstants('error-codes')
  }
}
