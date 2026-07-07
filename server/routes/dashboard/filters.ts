import { type Session, type SessionData } from 'express-session'
import { type ParsedQs } from 'qs'

import { type GovukErrorSummaryItem } from '../../utils/govukFrontend'
import {
  type Type,
  type TypeFamily,
  type Status,
  type WorkList,
  types,
  typeFamilies,
  workListCodes,
  statuses,
  workListMapping,
} from '../../reportConfiguration/constants'
import { parseDateInput } from '../../utils/parseDateTime'
import format from '../../utils/format'
import { type Order } from '../../data/offenderSearchApi'
import { hasInvalidValues } from '../../utils/utils'
import { type ApiUserAction, type Permissions, type UserAction, apiUserActions } from '../../middleware/permissions'

// `latestUserActions` can include 'REQUEST_REMOVAL' (not a valid `ApiUserAction`)
// which maps/is replaced with 'REQUEST_NOT_REPORTABLE' and 'REQUEST_DUPLICATE'
export type LatestUserActions = ApiUserAction | 'REQUEST_REMOVAL'

type IncidentStatuses = Status | WorkList

export interface UiFilters {
  clearFilters?: string
  searchID?: string
  location?: string
  fromDate?: string
  toDate?: string
  typeFamily?: TypeFamily
  incidentStatuses?: IncidentStatuses[]
  latestUserActions?: LatestUserActions[]
  sort: string
  order: Order
  page?: string
}

interface Filters {
  prisonerNumber?: string
  referenceNumber?: string
  fromDate?: Date
  toDate?: Date
  type?: Type[]
  status?: Status[]
  userAction?: ApiUserAction[]
  sort: string[]
  page: number
}

export function readUiFilters({
  query,
  session,
  url,
}: {
  query: ParsedQs
  session: Session & Partial<SessionData>
  url: string
}): UiFilters {
  let incidentStatuses
  if (typeof query.incidentStatuses === 'string') {
    incidentStatuses = [query.incidentStatuses]
  } else if (Array.isArray(query.incidentStatuses)) {
    incidentStatuses = query.incidentStatuses
  }

  let latestUserActions
  if (typeof query.latestUserActions === 'string') {
    latestUserActions = [query.latestUserActions]
  } else if (Array.isArray(query.latestUserActions)) {
    latestUserActions = query.latestUserActions
  }

  const uiFilters: UiFilters = {
    clearFilters: typeof query.clearFilters === 'string' ? query.clearFilters : undefined,
    searchID: typeof query.searchID === 'string' ? query.searchID.trim() : undefined,
    location: typeof query.location === 'string' ? query.location : undefined,
    fromDate: typeof query.fromDate === 'string' ? query.fromDate : undefined,
    toDate: typeof query.toDate === 'string' ? query.toDate : undefined,
    typeFamily: query.typeFamily as TypeFamily | undefined,
    // @ts-expect-error - provided incidentStatuses could be invalid
    incidentStatuses,
    // @ts-expect-error - provided latestUserActions could be invalid
    latestUserActions,
    sort: typeof query.sort === 'string' ? query.sort : '',
    // @ts-expect-error - order is updated with default if invalid
    order: typeof query.order === 'string' ? query.order : '',
    page: typeof query.page === 'string' ? query.page : undefined,
  }

  // If no filters are supplied from query, check for filters in session
  if (url === '/' && session.dashboardFilters) {
    const sessionFilters = session.dashboardFilters
    uiFilters.searchID = sessionFilters?.searchID
    uiFilters.location = sessionFilters?.location
    uiFilters.fromDate = sessionFilters?.fromDate
    uiFilters.toDate = sessionFilters?.toDate
    uiFilters.typeFamily = sessionFilters?.typeFamily
    uiFilters.incidentStatuses = sessionFilters?.incidentStatuses
    uiFilters.latestUserActions = sessionFilters?.latestUserActions
    uiFilters.sort = sessionFilters?.sort ?? ''
    // @ts-expect-error - order is updated with default if invalid
    uiFilters.order = sessionFilters?.order ?? ''
  }

  return uiFilters
}

export function fillInDefaults(uiFilters: UiFilters, useWorklists: boolean): void {
  const sortOptions = ['incidentDateAndTime', 'reportReference', 'location', 'type', 'status', 'reportedBy']
  const orderOptions = ['ASC', 'DESC']

  if (!sortOptions.includes(uiFilters.sort)) {
    // eslint-disable-next-line no-param-reassign
    uiFilters.sort = 'incidentDateAndTime'
  }

  if (!orderOptions.includes(uiFilters.order)) {
    // eslint-disable-next-line no-param-reassign
    uiFilters.order = 'DESC'
  }

  if (useWorklists && uiFilters.clearFilters === 'ToDo') {
    // eslint-disable-next-line no-param-reassign
    uiFilters.incidentStatuses = ['toDo']
  }
}

export function validateUiFilters(uiFilters: UiFilters, useWorklists: boolean): GovukErrorSummaryItem[] {
  const errors: GovukErrorSummaryItem[] = []

  validateSearchId(uiFilters, errors)
  validateDateRanges(uiFilters, errors)
  validateIncidentStatuses(uiFilters, errors, useWorklists)
  validateLatestUserActions(uiFilters, errors)

  if (uiFilters.typeFamily && !(uiFilters.typeFamily in familyToType)) {
    errors.push({ href: '#typeFamily', text: 'Select a valid incident type' })
  }

  return errors
}

export function filtersFromUiFilters(uiFilters: UiFilters, useWorklists: boolean, permissions: Permissions): Filters {
  let page = (uiFilters.page && parseInt(uiFilters.page, 10)) || 1
  if (page < 1) {
    page = 1
  }

  const { prisonerNumber, referenceNumber } = processSearchId(uiFilters.searchID)

  const fromDate = parseDate(uiFilters.fromDate)
  const toDate = parseDate(uiFilters.toDate)
  const validDates = fromDate !== undefined && toDate !== undefined
  const validDateOrder = validDates && toDate >= fromDate

  const filters = {
    prisonerNumber,
    referenceNumber,
    fromDate: validDateOrder ? fromDate : undefined,
    toDate: validDateOrder ? toDate : undefined,
    type: uiFilters.typeFamily && familyToType[uiFilters.typeFamily],
    status: processStatus(uiFilters.incidentStatuses, useWorklists),
    userAction: processUserAction(uiFilters.latestUserActions, permissions),
    sort: [`${uiFilters.sort},${uiFilters.order}`],
    page,
  }

  return filters
}

function processStatus(incidentStatuses: IncidentStatuses[] | undefined, useWorklists: boolean): Status[] | undefined {
  if (!incidentStatuses) {
    return
  }

  if (useWorklists) {
    if (validWorkListCodes(incidentStatuses)) {
      // eslint-disable-next-line consistent-return
      return incidentStatuses.map(worklist => workListMapping[worklist]).flat(1)
    }
  } else if (validReportStatusCodes(incidentStatuses)) {
    // eslint-disable-next-line consistent-return
    return incidentStatuses
  }
}

function processUserAction(
  latestUserActions: LatestUserActions[] | undefined,
  permissions: Permissions,
): UserAction[] | undefined {
  if (!latestUserActions) {
    return
  }

  // If an RO opens a link containing filter, remove filter
  if (permissions.isReportingOfficer) {
    return
  }

  if (validUserAction(latestUserActions)) {
    // Convert 'REQUEST_REMOVAL' into corresponding API user actions
    if (latestUserActions.includes('REQUEST_REMOVAL')) {
      // @ts-expect-error - latestUserActions has valid API user actions
      // eslint-disable-next-line consistent-return
      return [
        ...latestUserActions.filter(action => action !== 'REQUEST_REMOVAL'),
        'REQUEST_NOT_REPORTABLE',
        'REQUEST_DUPLICATE',
      ] as ApiUserAction[]
    }

    // @ts-expect-error - latestUserActions has valid API user actions
    // eslint-disable-next-line consistent-return
    return latestUserActions
  }
}

function processSearchId(searchID: string | undefined): { prisonerNumber?: string; referenceNumber?: string } {
  let prisonerNumber
  let referenceNumber

  if (searchID) {
    if (isPrisonerNumber(searchID)) {
      prisonerNumber = searchID
    } else if (isReferenceNumber(searchID)) {
      referenceNumber = searchID
    }
  }

  return {
    prisonerNumber,
    referenceNumber,
  }
}

function validateIncidentStatuses(uiFilters: UiFilters, errors: GovukErrorSummaryItem[], useWorklists: boolean): void {
  if (!uiFilters.incidentStatuses) {
    return
  }

  let errorMessage
  if (useWorklists) {
    if (!validWorkListCodes(uiFilters.incidentStatuses)) {
      errorMessage = 'Select a valid work list'
    }
  } else if (!validReportStatusCodes(uiFilters.incidentStatuses)) {
    errorMessage = 'Select a valid status'
  }

  if (errorMessage) {
    errors.push({
      href: '#incidentStatuses-item',
      text: errorMessage,
    })
  }
}

function validateLatestUserActions(uiFilters: UiFilters, errors: GovukErrorSummaryItem[]): void {
  if (!uiFilters.latestUserActions) {
    return
  }

  if (!validUserAction(uiFilters.latestUserActions)) {
    errors.push({
      href: '#latestUserActions-item',
      text: 'Enter a valid user action',
    })
  }
}

function validUserAction(latestUserActions: LatestUserActions[]): latestUserActions is LatestUserActions[] {
  return !hasInvalidValues(latestUserActions, [...apiUserActions, 'REQUEST_REMOVAL'])
}

function validWorkListCodes(incidentStatuses: IncidentStatuses[]): incidentStatuses is WorkList[] {
  return !hasInvalidValues(incidentStatuses, workListCodes)
}

function validReportStatusCodes(incidentStatuses: IncidentStatuses[]): incidentStatuses is Status[] {
  const reportStatusCodes = statuses.map(status => status.code)
  return !hasInvalidValues(incidentStatuses, reportStatusCodes)
}

function validateSearchId(uiFilters: UiFilters, errors: GovukErrorSummaryItem[]): void {
  if (!uiFilters.searchID) {
    return
  }

  if (!isPrisonerNumber(uiFilters.searchID) && !isReferenceNumber(uiFilters.searchID)) {
    errors.push({
      href: '#searchID',
      text: `Enter a valid incident number or offender ID. For example, 12345678 or A0011BB`,
    })
  }
}

function isPrisonerNumber(searchID: string): boolean {
  return searchID.match(/^[a-zA-Z][0-9]{4}[a-zA-Z]{2}$/) !== null
}

function isReferenceNumber(searchID: string): boolean {
  return searchID.match(/^[0-9]+$/) !== null
}

function validateDateRanges(uiFilters: UiFilters, errors: GovukErrorSummaryItem[]): void {
  const todayAsShortDate = format.shortDate(new Date())

  const fromDate = parseDate(uiFilters.fromDate)
  const toDate = parseDate(uiFilters.toDate)

  if (uiFilters.fromDate && !fromDate) {
    errors.push({ href: '#fromDate', text: `Enter a valid from date, for example ${todayAsShortDate}` })
  }
  if (uiFilters.toDate && !toDate) {
    errors.push({ href: '#toDate', text: `Enter a valid to date, for example ${todayAsShortDate}` })
  }

  if (fromDate && toDate && toDate < fromDate) {
    errors.push({ href: '#toDate', text: 'Enter a date after from date' })
  }
}

function parseDate(date: string | undefined): Date | undefined {
  if (date) {
    try {
      return parseDateInput(date)
    } catch {
      //
    }
  }

  return undefined
}

/** Given a family code, list type codes belonging to the family */
const familyToType = Object.fromEntries(
  Object.values(typeFamilies).map(({ code: familyCode }) => [
    familyCode,
    Object.values(types)
      .filter(({ familyCode: someFamilyCode }) => someFamilyCode === familyCode)
      .map(({ code }) => code),
  ]),
)
