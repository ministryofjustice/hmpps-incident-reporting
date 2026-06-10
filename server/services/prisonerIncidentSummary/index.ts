import type { IncidentReportingApi, Question, ReportBasic } from '../../data/incidentReportingApi'
import type { Status, TypeFamily } from '../../reportConfiguration/constants'
import { getTypeDetails, statuses, typeFamiliesDescriptions } from '../../reportConfiguration/constants'
import {
  ACTIVE_DETAIL_TYPES,
  assaultBreakdown,
  disorderBreakdown,
  selfHarmBreakdown,
  findBreakdown,
  type BreakdownRow,
  type FindBreakdown,
} from './breakdowns'

/** Statuses that are excluded from the prisoner incident summary. */
const EXCLUDED_STATUSES: ReadonlySet<Status> = new Set<Status>(['DRAFT', 'DUPLICATE', 'NOT_REPORTABLE'])

/** All other statuses are included when querying the API. */
const INCLUDED_STATUSES: Status[] = statuses.map(status => status.code).filter(code => !EXCLUDED_STATUSES.has(code))

/** Page size used when paging through a prisoner's reports (small volumes expected per prisoner). */
const PAGE_SIZE = 100

/** A count of reports for one incident-type family. */
export interface FamilyCount {
  familyCode: TypeFamily
  description: string
  count: number
}

/** Everything the summary page needs for a single prisoner. */
export interface PrisonerIncidentSummary {
  /** Inclusive start of the 12-month window (by incident date). */
  fromDate: Date
  /** Total number of (non-excluded) reports involving the prisoner in the window. */
  totalReports: number
  /** Per-family counts, ordered by family description. */
  overall: FamilyCount[]
  /** Detail breakdowns, present only when the family has at least one report in the window. */
  assault?: BreakdownRow[]
  disorder?: BreakdownRow[]
  selfHarm?: BreakdownRow[]
  find?: FindBreakdown
}

/** today minus 12 months, used as the inclusive incidentDateFrom filter. */
function twelveMonthsAgo(): Date {
  const date = new Date()
  date.setFullYear(date.getFullYear() - 1)
  return date
}

/** Fetch every (non-excluded) report involving the prisoner since fromDate, following pagination. */
async function fetchAllReports(
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

/** Group reports by family code, returning counts ordered by family description. */
function countByFamily(reports: ReportBasic[]): FamilyCount[] {
  const counts = new Map<TypeFamily, number>()
  for (const report of reports) {
    const family = getTypeDetails(report.type)?.familyCode
    if (family) {
      counts.set(family, (counts.get(family) ?? 0) + 1)
    }
  }
  return [...counts.entries()]
    .map(([familyCode, count]) => ({ familyCode, description: typeFamiliesDescriptions[familyCode], count }))
    .sort((a, b) => a.description.localeCompare(b.description))
}

/**
 * Fetch the questions of every report whose type matches the given active version, in parallel.
 * Older type versions are not understood by the detail extractors so they are excluded.
 */
async function activeVersionQuestions(
  api: IncidentReportingApi,
  reports: ReportBasic[],
  activeType: string,
): Promise<Question[][]> {
  const matching = reports.filter(report => report.type === activeType)
  const detailed = await Promise.all(matching.map(report => api.getReportWithDetailsById(report.id)))
  return detailed.map(report => report.questions)
}

/** Build the 12-month incident summary for a single prisoner. */
export async function getPrisonerIncidentSummary(
  api: IncidentReportingApi,
  prisonerNumber: string,
): Promise<PrisonerIncidentSummary> {
  const fromDate = twelveMonthsAgo()
  const reports = await fetchAllReports(api, prisonerNumber, fromDate)
  const overall = countByFamily(reports)
  const families = new Set(overall.map(family => family.familyCode))

  const summary: PrisonerIncidentSummary = {
    fromDate,
    totalReports: reports.length,
    overall,
  }

  if (families.has('ASSAULT')) {
    summary.assault = assaultBreakdown(await activeVersionQuestions(api, reports, ACTIVE_DETAIL_TYPES.ASSAULT))
  }
  if (families.has('DISORDER')) {
    summary.disorder = disorderBreakdown(await activeVersionQuestions(api, reports, ACTIVE_DETAIL_TYPES.DISORDER))
  }
  if (families.has('SELF_HARM')) {
    summary.selfHarm = selfHarmBreakdown(await activeVersionQuestions(api, reports, ACTIVE_DETAIL_TYPES.SELF_HARM))
  }
  if (families.has('FIND')) {
    summary.find = findBreakdown(await activeVersionQuestions(api, reports, ACTIVE_DETAIL_TYPES.FIND))
  }

  return summary
}
