// Generated with ./scripts/importDpsConstants.ts 2024-09-11T10:04:08.101Z

export const statuses = [
  /** Draft */
  'DRAFT',
  /** Awaiting analysis */
  'AWAITING_ANALYSIS',
  /** In analysis */
  'IN_ANALYSIS',
  /** Information required */
  'INFORMATION_REQUIRED',
  /** Information amened */
  'INFORMATION_AMENDED',
  /** Closed */
  'CLOSED',
  /** Post-incident update */
  'POST_INCIDENT_UPDATE',
  /** Incident updated */
  'INCIDENT_UPDATED',
  /** Duplicate */
  'DUPLICATE',
] as const

export type Status = (typeof statuses)[number]
