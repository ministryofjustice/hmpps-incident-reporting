// Manually updated based on draft PR at 2025-05-16T15:00:00.000Z
// https://github.com/ministryofjustice/hmpps-incident-reporting-api/pull/332

/** Report statuses */
export const statuses = [
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore because typescript treats nomisCode as `any`
  { code: 'DRAFT', description: 'Draft', nomisCode: null },
  { code: 'AWAITING_REVIEW', description: 'Awaiting review', nomisCode: 'AWAN' },
  { code: 'ON_HOLD', description: 'On hold', nomisCode: 'INAN' },
  { code: 'NEEDS_UPDATING', description: 'Needs updating', nomisCode: 'INREQ' },
  { code: 'UPDATED', description: 'Updated', nomisCode: 'INAME' },
  { code: 'CLOSED', description: 'Closed', nomisCode: 'CLOSE' },
  { code: 'POST_INCIDENT_UPDATE', description: 'Post-incident update', nomisCode: 'PIU' },
  { code: 'INCIDENT_UPDATED', description: 'Incident updated', nomisCode: 'IUP' },
  { code: 'DUPLICATE', description: 'Duplicate', nomisCode: 'DUP' },
  { code: 'NOT_REPORTABLE', description: 'Not reportable', nomisCode: null },
  { code: 'REOPENED', description: 'Reopened', nomisCode: null },
  { code: 'WAS_CLOSED', description: 'Was closed', nomisCode: null },
] as const

/** Report statuses */
export type StatusDetails = (typeof statuses)[number]

/** Codes for report statuses */
export type Status = StatusDetails['code']

/**
 * NOMIS codes for Report statuses
 * @deprecated
 */
export type NomisStatus = StatusDetails['nomisCode']

/** Lookup for report statuses */
export function getStatusDetails(code: string): StatusDetails | null {
  return statuses.find(item => item.code === code) ?? null
}
