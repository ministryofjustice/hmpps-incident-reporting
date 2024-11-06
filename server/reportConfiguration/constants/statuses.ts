// Generated with ./scripts/importDpsConstants.ts at 2024-11-06T10:46:39.702Z

/** Report statuses */
export const statuses = [
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore because typescript treats nomisCode as `any`
  { code: 'DRAFT', description: 'Draft', nomisCode: null },
  { code: 'AWAITING_ANALYSIS', description: 'Awaiting analysis', nomisCode: 'AWAN' },
  { code: 'IN_ANALYSIS', description: 'In analysis', nomisCode: 'INAN' },
  { code: 'INFORMATION_REQUIRED', description: 'Information required', nomisCode: 'INREQ' },
  { code: 'INFORMATION_AMENDED', description: 'Information amened', nomisCode: 'INAME' },
  { code: 'CLOSED', description: 'Closed', nomisCode: 'CLOSE' },
  { code: 'POST_INCIDENT_UPDATE', description: 'Post-incident update', nomisCode: 'PIU' },
  { code: 'INCIDENT_UPDATED', description: 'Incident updated', nomisCode: 'IUP' },
  { code: 'DUPLICATE', description: 'Duplicate', nomisCode: 'DUP' },
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
