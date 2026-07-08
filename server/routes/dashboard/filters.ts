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
import { pecsRegions } from '../../data/pecsRegions'

/** Location search filter which is replaced by all PECS regions when performing search */
export const ALL_PECS_REGIONS_FLAG = '.PECS' as const

// `latestUserActions` can include 'REQUEST_REMOVAL' (not a valid `ApiUserAction`)
// which maps/is replaced with 'REQUEST_NOT_REPORTABLE' and 'REQUEST_DUPLICATE'
export type LatestUserAction = ApiUserAction | 'REQUEST_REMOVAL'

type StatusOrWorkList = Status | WorkList

export interface UiFilters {
  clearFilters?: string
  searchID?: string
  location?: string
  fromDate?: string
  toDate?: string
  typeFamily?: TypeFamily
  incidentStatuses?: StatusOrWorkList[]
  latestUserActions?: LatestUserAction[]
  sort: string
  order: Order
  // UI page starts at 1
  page?: string
}

interface Filters {
  involvingPrisonerNumber?: string
  reference?: string
  location: string[]
  incidentDateFrom?: Date
  incidentDateUntil?: Date
  type?: Type[]
  status?: Status[]
  userAction?: ApiUserAction[]
  sort: string[]
  // API page starts at 0
  page: number
}

export function readUiFilters({
  query,
  session,
  url,
  useWorkLists,
}: {
  query: ParsedQs
  session: Session & Partial<SessionData>
  url: string
  useWorkLists: boolean
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

  fillInDefaults(uiFilters, useWorkLists)

  return uiFilters
}

function fillInDefaults(uiFilters: UiFilters, useWorkLists: boolean): void {
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

  if (useWorkLists && uiFilters.clearFilters === 'ToDo') {
    // eslint-disable-next-line no-param-reassign
    uiFilters.incidentStatuses = ['toDo']
  }
}

export function validateUiFilters({
  uiFilters,
  useWorkLists,
  permissions,
  userCaseloadIds,
}: {
  uiFilters: UiFilters
  useWorkLists: boolean
  permissions: Permissions
  userCaseloadIds: string[]
}): GovukErrorSummaryItem[] {
  const errors: GovukErrorSummaryItem[] = []

  validateSearchId(uiFilters, errors)
  validateLocation({ uiFilters, errors, permissions, userCaseloadIds })
  validateDateRanges(uiFilters, errors)
  validateIncidentStatuses(uiFilters, errors, useWorkLists)
  validateLatestUserActions(uiFilters, errors)

  if (uiFilters.typeFamily && !(uiFilters.typeFamily in familyToType)) {
    errors.push({ href: '#typeFamily', text: 'Select a valid incident type' })
  }

  return errors
}

export function filtersFromUiFilters({
  uiFilters,
  useWorkLists,
  permissions,
  userCaseloadIds,
}: {
  uiFilters: UiFilters
  useWorkLists: boolean
  permissions: Permissions
  userCaseloadIds: string[]
}): Filters {
  let uiPage = (uiFilters.page && parseInt(uiFilters.page, 10)) || 1
  if (uiPage < 1) {
    uiPage = 1
  }

  const { prisonerNumber, referenceNumber } = processSearchId(uiFilters.searchID)

  const incidentDateFrom = parseDate(uiFilters.fromDate)
  const incidentDateUntil = parseDate(uiFilters.toDate)
  const validDates = incidentDateFrom !== undefined && incidentDateUntil !== undefined
  const validDateOrder = validDates && incidentDateUntil >= incidentDateFrom

  const filters = {
    involvingPrisonerNumber: prisonerNumber,
    reference: referenceNumber,
    location: processLocation(uiFilters.location, permissions, userCaseloadIds),
    incidentDateFrom: validDateOrder ? incidentDateFrom : undefined,
    incidentDateUntil: validDateOrder ? incidentDateUntil : undefined,
    type: uiFilters.typeFamily && familyToType[uiFilters.typeFamily],
    status: processStatus(uiFilters.incidentStatuses, useWorkLists),
    userAction: processUserAction(uiFilters.latestUserActions, permissions),
    sort: [`${uiFilters.sort},${uiFilters.order}`],
    page: uiPage - 1,
  }

  return filters
}

function processLocation(location: string | undefined, permissions: Permissions, userCaseloadIds: string[]): string[] {
  const pecsRegionCodes = pecsRegions.map(pecsRegion => pecsRegion.code)

  // Set locations to user’s caseloads by default and PECS regions if allowed
  const allUserLocations = userCaseloadIds
  if (permissions.hasPecsAccess) {
    allUserLocations.push(...pecsRegionCodes)
  }

  let locations = allUserLocations
  if (location) {
    const isInCaseLoads = userCaseloadIds.includes(location)
    const isPecsRegion = pecsRegionCodes.includes(location)
    const isAllPecsRegions = location === ALL_PECS_REGIONS_FLAG

    if (isInCaseLoads || (permissions.hasPecsAccess && isPecsRegion)) {
      locations = [location]
    } else if (permissions.hasPecsAccess && isAllPecsRegions) {
      locations = pecsRegionCodes
    }
  }

  return locations
}

function processStatus(incidentStatuses: StatusOrWorkList[] | undefined, useWorkLists: boolean): Status[] | undefined {
  if (!incidentStatuses) {
    return
  }

  if (useWorkLists) {
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
  latestUserActions: LatestUserAction[] | undefined,
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

function validateLocation({
  uiFilters,
  errors,
  permissions,
  userCaseloadIds,
}: {
  uiFilters: UiFilters
  errors: GovukErrorSummaryItem[]
  permissions: Permissions
  userCaseloadIds: string[]
}) {
  if (!uiFilters.location) {
    return
  }

  if (!validLocation({ location: uiFilters.location, permissions, userCaseloadIds })) {
    errors.push({
      href: '#location',
      text: 'Select a location to search',
    })
  }
}

function validLocation({
  location,
  permissions,
  userCaseloadIds,
}: {
  location: string
  permissions: Permissions
  userCaseloadIds: string[]
}): boolean {
  if (userCaseloadIds.includes(location)) {
    return true
  }
  if (permissions.hasPecsAccess) {
    const pecsRegionCodes = pecsRegions.map(pecsRegion => pecsRegion.code)
    return location === ALL_PECS_REGIONS_FLAG || pecsRegionCodes.includes(location)
  }

  return false
}

function validateIncidentStatuses(uiFilters: UiFilters, errors: GovukErrorSummaryItem[], useWorkLists: boolean): void {
  if (!uiFilters.incidentStatuses) {
    return
  }

  let errorMessage
  if (useWorkLists) {
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

function validUserAction(latestUserActions: LatestUserAction[]): latestUserActions is LatestUserAction[] {
  return !hasInvalidValues(latestUserActions, [...apiUserActions, 'REQUEST_REMOVAL'])
}

function validWorkListCodes(incidentStatuses: StatusOrWorkList[]): incidentStatuses is WorkList[] {
  return !hasInvalidValues(incidentStatuses, workListCodes)
}

function validReportStatusCodes(incidentStatuses: StatusOrWorkList[]): incidentStatuses is Status[] {
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
