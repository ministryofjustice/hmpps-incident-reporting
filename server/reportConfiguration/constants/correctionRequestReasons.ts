// Generated with ./scripts/importDpsConstants.ts at 2024-09-12T13:42:33.866Z

/** Reasons for correction requests made about a report */
export const correctionRequestReasons = [
  { code: 'MISTAKE', description: 'Mistake' },
  { code: 'INCORRECT_INFORMATION', description: 'Incorrect information' },
  { code: 'MISSING_INFORMATION', description: 'Missing information' },
  { code: 'OTHER', description: 'Other reason' },
  { code: 'NOT_SPECIFIED', description: 'Not specified' },
] as const

/** Reasons for correction requests made about a report */
export type CorrectionRequestReason = (typeof correctionRequestReasons)[number]['code']
