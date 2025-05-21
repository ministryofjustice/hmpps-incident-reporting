// Generated with ./scripts/importDpsConstants.ts at 2025-05-20T13:40:05.081Z

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
  { code: 'DUPLICATE', description: 'Duplicate', nomisCode: 'DUP' },
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore because typescript treats nomisCode as `any`
  { code: 'NOT_REPORTABLE', description: 'Not reportable', nomisCode: null },
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore because typescript treats nomisCode as `any`
  { code: 'REOPENED', description: 'Reopened', nomisCode: null },
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore because typescript treats nomisCode as `any`
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

/** Statuses before DW has seen report * */
export const dwNotReviewed: Status[] = ['DRAFT', 'AWAITING_REVIEW']
