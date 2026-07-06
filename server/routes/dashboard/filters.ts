import { type Session, type SessionData } from 'express-session'
import { type ParsedQs } from 'qs'

import { type GovukErrorSummaryItem } from '../../utils/govukFrontend'
import { type Type, type TypeFamily, types, typeFamilies } from '../../reportConfiguration/constants'
import { parseDateInput } from '../../utils/parseDateTime'
import format from '../../utils/format'
import { type Order } from '../../data/offenderSearchApi'

interface UiFilters {
  searchID?: string
  location?: string
  fromDate?: string
  toDate?: string
  typeFamily?: TypeFamily
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
  const uiFilters: UiFilters = {
    searchID: typeof query.searchID === 'string' ? query.searchID.trim() : undefined,
    location: typeof query.location === 'string' ? query.location : undefined,
    fromDate: typeof query.fromDate === 'string' ? query.fromDate : undefined,
    toDate: typeof query.toDate === 'string' ? query.toDate : undefined,
    typeFamily: query.typeFamily as TypeFamily | undefined,
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
    uiFilters.sort = sessionFilters?.sort ?? ''
    // @ts-expect-error - order is updated with default if invalid
    uiFilters.order = sessionFilters?.order ?? ''
  }

  return uiFilters
}

export function fillInDefaults(uiFilters: UiFilters): void {
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
}

export function validateUiFilters(uiFilters: UiFilters): GovukErrorSummaryItem[] {
  const errors: GovukErrorSummaryItem[] = []

  validateSearchId(uiFilters, errors)
  validateDateRanges(uiFilters, errors)

  if (uiFilters.typeFamily && !(uiFilters.typeFamily in familyToType)) {
    errors.push({ href: '#typeFamily', text: 'Select a valid incident type' })
  }

  return errors
}

export function filtersFromUiFilters(uiFilters: UiFilters): Filters {
  let page = (uiFilters.page && parseInt(uiFilters.page, 10)) || 1
  if (page < 1) {
    page = 1
  }

  let prisonerNumber
  let referenceNumber
  if (uiFilters.searchID) {
    if (isPrisonerNumber(uiFilters.searchID)) {
      prisonerNumber = uiFilters.searchID
    } else if (isReferenceNumber(uiFilters.searchID)) {
      referenceNumber = uiFilters.searchID
    }
  }

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
    sort: [`${uiFilters.sort},${uiFilters.order}`],
    page,
  }

  return filters
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
