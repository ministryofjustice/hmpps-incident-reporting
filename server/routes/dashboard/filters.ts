import { type Session, type SessionData } from 'express-session'
import { type ParsedQs } from 'qs'

interface UiFilters {
  searchID?: string
  fromDate?: string
  toDate?: string
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
    fromDate: typeof query.fromDate === 'string' ? query.fromDate : undefined,
    toDate: typeof query.toDate === 'string' ? query.toDate : undefined,
  }

  // If no filters are supplied from query, check for filters in session
  if (url === '/' && session.dashboardFilters) {
    const sessionFilters = session.dashboardFilters
    uiFilters.searchID = sessionFilters?.searchID
    uiFilters.fromDate = sessionFilters?.fromDate
    uiFilters.toDate = sessionFilters?.toDate
  }

  return uiFilters
}
