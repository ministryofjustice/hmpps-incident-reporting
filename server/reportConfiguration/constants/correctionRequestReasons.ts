// Generated with ./scripts/importDpsConstants.ts at 2024-11-06T10:46:43.489Z

/** Reasons for correction requests made about a report */
export const correctionRequestReasons = [
  { code: 'MISTAKE', description: 'Mistake' },
  { code: 'INCORRECT_INFORMATION', description: 'Incorrect information' },
  { code: 'MISSING_INFORMATION', description: 'Missing information' },
  { code: 'OTHER', description: 'Other reason' },
  { code: 'NOT_SPECIFIED', description: 'Not specified' },
] as const

/** Reasons for correction requests made about a report */
export type CorrectionRequestReasonDetails = (typeof correctionRequestReasons)[number]

/** Codes for reasons for correction requests made about a report */
export type CorrectionRequestReason = CorrectionRequestReasonDetails['code']

/** Lookup for reasons for correction requests made about a report */
export function getCorrectionRequestReasonDetails(code: string): CorrectionRequestReasonDetails | null {
  return correctionRequestReasons.find(item => item.code === code) ?? null
}
