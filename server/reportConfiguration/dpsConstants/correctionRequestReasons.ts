// Generated with ./scripts/importDpsConstants.ts 2024-09-11T10:04:11.653Z

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

export type CorrectionRequestReason = (typeof correctionRequestReasons)[number]
