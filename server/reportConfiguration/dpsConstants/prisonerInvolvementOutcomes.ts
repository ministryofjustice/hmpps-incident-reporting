// Generated with ./scripts/importDpsConstants.ts at 2024-09-11T16:52:05.750Z

/** Outcomes from a prisoner’s involvement in an incident */
export const prisonerInvolvementOutcomes = [
  /** ACCT */
  'ACCT',
  /** Charged by Police */
  'CHARGED_BY_POLICE',
  /** Convicted */
  'CONVICTED',
  /** Coroner informed */
  'CORONER_INFORMED',
  /** Death */
  'DEATH',
  /** Further charges */
  'FURTHER_CHARGES',
  /** Investigation (local) */
  'LOCAL_INVESTIGATION',
  /** Next of kin informed */
  'NEXT_OF_KIN_INFORMED',
  /** Placed on report */
  'PLACED_ON_REPORT',
  /** Investigation (Police) */
  'POLICE_INVESTIGATION',
  /** Remand */
  'REMAND',
  /** Seen by Duty Governor */
  'SEEN_DUTY_GOV',
  /** Seen by Healthcare */
  'SEEN_HEALTHCARE',
  /** Seen by IMB */
  'SEEN_IMB',
  /** Seen by outside hospital */
  'SEEN_OUTSIDE_HOSP',
  /** Transfer */
  'TRANSFER',
  /** Trial */
  'TRIAL',
] as const

/** Outcomes from a prisoner’s involvement in an incident */
export type PrisonerInvolvementOutcome = (typeof prisonerInvolvementOutcomes)[number]
