import type {
  IncidentReportingApi,
  PrisonerInvolvement,
  Question,
  ReportWithDetails,
} from '../../data/incidentReportingApi'
import type { PrisonApi } from '../../data/prisonApi'
import { AgencyType } from '../../data/constants'
import { isPecsRegionCode } from '../../data/pecsRegions'
import {
  getTypeDetails,
  prisonerInvolvementRolesDescriptions,
  statusesDescriptions,
} from '../../reportConfiguration/constants'
import { ACTIVE_DETAIL_TYPES } from './breakdowns'
import { fetchAllReports, twelveMonthsAgo } from './prisonerReports'
import {
  answeredYes,
  findQuestion,
  hasAnyResponseCode,
  hasResponseCodeOtherThan,
  responseLabels,
} from './questionHelpers'

/**
 * Per-incident list for the prisoner incident summary drill-down.
 *
 * One row per involvement the prisoner has in each (non-excluded) report from the last 12 months,
 * most recent first. The derived columns (subtype, extra information, reason, location) are only
 * populated for the *currently active* type version of each detail family (ASSAULT_5, DISORDER_2,
 * SELF_HARM_1, FIND_6) — older versions and other incident types show the core columns only. The
 * question/response codes mirror the canonical DPR `prisoner-incident-detail` definition and are
 * cross-checked against the config in `server/reportConfiguration/types/`.
 */

/** One displayable incident row for the prisoner. */
export interface PrisonerIncidentListRow {
  reportId: string
  reportReference: string
  incidentDateAndTime: Date
  typeDescription: string
  subtype?: string
  role: string
  extraInformation?: string
  reason?: string
  location?: string
  establishment: string
  status: string
}

export interface PrisonerIncidentList {
  /** Inclusive start of the 12-month window (by incident date). */
  fromDate: Date
  rows: PrisonerIncidentListRow[]
}

// --- per-active-type question codes (verified against server/reportConfiguration/types/*.ts) ---

/** Question that records where in the establishment the incident took place. */
const LOCATION_QUESTION: Record<string, string> = {
  [ACTIVE_DETAIL_TYPES.ASSAULT]: '61284',
  [ACTIVE_DETAIL_TYPES.DISORDER]: '63182',
  [ACTIVE_DETAIL_TYPES.SELF_HARM]: '45051',
  [ACTIVE_DETAIL_TYPES.FIND]: '67181',
}

/** Question that records the headline sub-classification of the incident. */
const SUBTYPE_QUESTION: Record<string, string> = {
  [ACTIVE_DETAIL_TYPES.ASSAULT]: '61287',
  [ACTIVE_DETAIL_TYPES.DISORDER]: '63179',
  [ACTIVE_DETAIL_TYPES.FIND]: '67187',
}

/** "Was there an apparent reason..." question carrying the free-text reason. */
const REASON_QUESTION: Record<string, string> = {
  [ACTIVE_DETAIL_TYPES.ASSAULT]: '61311',
  [ACTIVE_DETAIL_TYPES.DISORDER]: '63184',
}

/** Join non-empty parts into a comma-separated string, or undefined if there are none. */
function joinParts(parts: (string | false | undefined | null)[]): string | undefined {
  const present = parts.filter((part): part is string => Boolean(part))
  return present.length ? present.join(', ') : undefined
}

/** The subtype label shown for the incident (assault/disorder/find headline answer). */
function subtype(report: ReportWithDetails): string | undefined {
  const questionCode = SUBTYPE_QUESTION[report.type]
  if (!questionCode) {
    return undefined
  }
  return joinParts(responseLabels(report.questions, questionCode))
}

/** Assault extra information, mirroring the DPR `incident_summary` (minor injury omitted). */
function assaultExtraInformation(questions: Question[]): string | undefined {
  return joinParts([
    answeredYes(questions, '61298') && 'Serious injury',
    answeredYes(questions, '61285') && 'Sexual assault',
    answeredYes(questions, '61290') && 'Spitting',
    answeredYes(questions, '61305') && 'Concussion or internal injury treatment',
    ...responseLabels(questions, '61303'), // type of hospital admission
  ])
}

/** Self-harm extra information (methods involved). */
function selfHarmExtraInformation(questions: Question[]): string | undefined {
  return joinParts([
    answeredYes(questions, '44753') && 'Cutting',
    (answeredYes(questions, '44207') || answeredYes(questions, '44244')) && 'Strangulation or hanging',
    answeredYes(questions, '45167') && 'Burning',
  ])
}

/** Find extra information: items recorded via the FIND_6 "multiple types" flow. */
function findExtraInformation(questions: Question[]): string | undefined {
  return joinParts([
    hasResponseCodeOtherThan(questions, '67205', ['218953']) && 'Alcohol',
    hasAnyResponseCode(questions, '67207', ['218965']) && 'Drugs',
    hasAnyResponseCode(questions, '67213', ['219014']) && 'Mobile phone',
    hasResponseCodeOtherThan(questions, '67215', ['219038']) && 'SIM card',
    hasResponseCodeOtherThan(questions, '67216', ['219061']) && 'Memory card',
    hasResponseCodeOtherThan(questions, '67220', ['219091']) && 'Digital',
    hasAnyResponseCode(questions, '67221', ['219106']) && 'Tobacco',
    hasResponseCodeOtherThan(questions, '67224', ['219115']) && 'Weapon',
  ])
}

function extraInformation(report: ReportWithDetails): string | undefined {
  switch (report.type) {
    case ACTIVE_DETAIL_TYPES.ASSAULT:
      return assaultExtraInformation(report.questions)
    case ACTIVE_DETAIL_TYPES.SELF_HARM:
      return selfHarmExtraInformation(report.questions)
    case ACTIVE_DETAIL_TYPES.FIND:
      return findExtraInformation(report.questions)
    default:
      return undefined
  }
}

/** Free-text reason recorded against the "apparent reason" question. */
function reason(report: ReportWithDetails): string | undefined {
  const questionCode = REASON_QUESTION[report.type]
  if (!questionCode) {
    return undefined
  }
  const question = findQuestion(report.questions, questionCode)
  if (!question) {
    return undefined
  }
  return joinParts(
    question.responses.map(response => {
      if (response.additionalInformation) {
        return response.additionalInformation
      }
      return response.response !== 'YES' && response.response !== 'NO' ? response.label : undefined
    }),
  )
}

/** Where in the establishment the incident took place, with any recorded comment. */
function location(report: ReportWithDetails): string | undefined {
  const questionCode = LOCATION_QUESTION[report.type]
  if (!questionCode) {
    return undefined
  }
  const question = findQuestion(report.questions, questionCode)
  if (!question) {
    return undefined
  }
  return joinParts(
    question.responses.map(response =>
      response.additionalInformation ? `${response.label} (${response.additionalInformation})` : response.label,
    ),
  )
}

/** Build one row per involvement this prisoner has in the report. */
function rowsForReport(
  report: ReportWithDetails,
  prisonerNumber: string,
  establishment: string,
): PrisonerIncidentListRow[] {
  const involvements = report.prisonersInvolved.filter(
    (prisoner: PrisonerInvolvement) => prisoner.prisonerNumber === prisonerNumber,
  )
  return involvements.map(involvement => ({
    reportId: report.id,
    reportReference: report.reportReference,
    incidentDateAndTime: report.incidentDateAndTime,
    typeDescription: getTypeDetails(report.type)?.description ?? report.type,
    subtype: subtype(report),
    role: prisonerInvolvementRolesDescriptions[involvement.prisonerRole] ?? involvement.prisonerRole,
    extraInformation: extraInformation(report),
    reason: reason(report),
    location: location(report),
    establishment,
    status: statusesDescriptions[report.status] ?? report.status,
  }))
}

/** Resolve each distinct report location to its establishment / PECS region display name. */
async function resolveEstablishments(prisonApi: PrisonApi, locations: string[]): Promise<Map<string, string>> {
  const distinct = [...new Set(locations)]
  const resolved = await Promise.all(
    distinct.map(async code => {
      const isPecs = isPecsRegionCode(code)
      const agency = await prisonApi.getAgency(code, false, isPecs ? AgencyType.PECS : AgencyType.INST, isPecs)
      return [code, agency?.description || code] as const
    }),
  )
  return new Map(resolved)
}

/** Build the 12-month per-incident list for a single prisoner. */
export async function getPrisonerIncidentList(
  api: IncidentReportingApi,
  prisonApi: PrisonApi,
  prisonerNumber: string,
): Promise<PrisonerIncidentList> {
  const fromDate = twelveMonthsAgo()
  const basicReports = await fetchAllReports(api, prisonerNumber, fromDate)
  const reports = await Promise.all(basicReports.map(report => api.getReportWithDetailsById(report.id)))

  const establishments = await resolveEstablishments(
    prisonApi,
    reports.map(report => report.location),
  )

  const rows = reports
    .flatMap(report => rowsForReport(report, prisonerNumber, establishments.get(report.location) ?? report.location))
    .sort((a, b) => b.incidentDateAndTime.getTime() - a.incidentDateAndTime.getTime())

  return { fromDate, rows }
}
