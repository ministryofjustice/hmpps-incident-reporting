import { type Session, type SessionData } from 'express-session'
import { type ParsedQs } from 'qs'

import { type GovukErrorSummaryItem } from '../../utils/govukFrontend'
import { typeFamilies, TypeFamily, types } from '../../reportConfiguration/constants'

interface UiFilters {
  searchID?: string
  location?: string
  fromDate?: string
  toDate?: string
  typeFamily?: TypeFamily
  page?: string
}

interface Filters {
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
  const uiFilters = {
    searchID: typeof query.searchID === 'string' ? query.searchID.trim() : undefined,
    location: typeof query.location === 'string' ? query.location : undefined,
    fromDate: typeof query.fromDate === 'string' ? query.fromDate : undefined,
    toDate: typeof query.toDate === 'string' ? query.toDate : undefined,
    typeFamily: query.typeFamily as TypeFamily | undefined,
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
  }

  return uiFilters
}

export function validateUiFilters(uiFilters: UiFilters): GovukErrorSummaryItem[] {
  const errors: GovukErrorSummaryItem[] = []

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

  const filters = {
    page,
  }

  return filters
}

/** Given a family code, list type codes belonging to the family */
export const familyToType = Object.fromEntries(
  Object.values(typeFamilies).map(({ code: familyCode }) => [
    familyCode,
    Object.values(types)
      .filter(({ familyCode: someFamilyCode }) => someFamilyCode === familyCode)
      .map(({ code }) => code),
  ]),
)
