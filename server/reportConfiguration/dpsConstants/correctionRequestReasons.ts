// Generated with ./scripts/importDpsConstants.ts at 2024-09-11T16:52:06.458Z

/** Reasons for correction requests made about a report */
export const correctionRequestReasons = [
  /** Mistake */
  'MISTAKE',
  /** Incorrect information */
  'INCORRECT_INFORMATION',
  /** Missing information */
  'MISSING_INFORMATION',
  /** Other reason */
  'OTHER',
  /** Not specified */
  'NOT_SPECIFIED',
] as const

/** Reasons for correction requests made about a report */
export type CorrectionRequestReason = (typeof correctionRequestReasons)[number]
