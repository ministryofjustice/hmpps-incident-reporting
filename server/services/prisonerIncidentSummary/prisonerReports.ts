import type { IncidentReportingApi, ReportBasic } from '../../data/incidentReportingApi'
import type { Status } from '../../reportConfiguration/constants'
import { statuses } from '../../reportConfiguration/constants'

/**
 * Shared report-fetching for the prisoner incident summary and the per-incident list. Both views
 * cover the same 12-month window and exclude the same statuses, so the list reconciles with the
 * summary counts.
 */

/** Statuses that are excluded from the prisoner incident summary and list. */
export const EXCLUDED_STATUSES: ReadonlySet<Status> = new Set<Status>(['DRAFT', 'DUPLICATE', 'NOT_REPORTABLE'])

/** All other statuses are included when querying the API. */
export const INCLUDED_STATUSES: Status[] = statuses
  .map(status => status.code)
  .filter(code => !EXCLUDED_STATUSES.has(code))

/** Page size used when paging through a prisoner's reports (small volumes expected per prisoner). */
const PAGE_SIZE = 100

/** today minus 12 months, used as the inclusive incidentDateFrom filter. */
export function twelveMonthsAgo(): Date {
  const date = new Date()
  date.setFullYear(date.getFullYear() - 1)
  return date
}

/** Fetch every (non-excluded) report involving the prisoner since fromDate, following pagination. */
export async function fetchAllReports(
  api: IncidentReportingApi,
  prisonerNumber: string,
  fromDate: Date,
): Promise<ReportBasic[]> {
  const reports: ReportBasic[] = []
  let page = 0
  let totalPages = 1
  do {
    // eslint-disable-next-line no-await-in-loop -- pages must be fetched sequentially
    const response = await api.getReports({
      involvingPrisonerNumber: prisonerNumber,
      incidentDateFrom: fromDate,
      status: INCLUDED_STATUSES,
      page,
      size: PAGE_SIZE,
    })
    reports.push(...response.content)
    totalPages = response.totalPages
    page += 1
  } while (page < totalPages)
  return reports
}
