// Generated with ./scripts/importDpsConstants.ts at 2024-09-11T16:52:02.996Z

/** Report statuses */
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

/** Report statuses */
export type Status = (typeof statuses)[number]
