// Generated with ./scripts/importDpsConstants.ts at 2024-09-12T13:42:30.663Z

/** Report statuses */
export const statuses = [
  { code: 'DRAFT', description: 'Draft' },
  { code: 'AWAITING_ANALYSIS', description: 'Awaiting analysis' },
  { code: 'IN_ANALYSIS', description: 'In analysis' },
  { code: 'INFORMATION_REQUIRED', description: 'Information required' },
  { code: 'INFORMATION_AMENDED', description: 'Information amened' },
  { code: 'CLOSED', description: 'Closed' },
  { code: 'POST_INCIDENT_UPDATE', description: 'Post-incident update' },
  { code: 'INCIDENT_UPDATED', description: 'Incident updated' },
  { code: 'DUPLICATE', description: 'Duplicate' },
] as const

/** Report statuses */
export type Status = (typeof statuses)[number]['code']
