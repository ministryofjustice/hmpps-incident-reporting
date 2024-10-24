// Generated with ./scripts/importDpsConstants.ts at 2024-10-23T09:57:41.203Z

/** Outcomes from a prisoner’s involvement in an incident */
export const prisonerInvolvementOutcomes = [
  { code: 'ACCT', description: 'ACCT' },
  { code: 'CHARGED_BY_POLICE', description: 'Charged by Police' },
  { code: 'CONVICTED', description: 'Convicted' },
  { code: 'CORONER_INFORMED', description: 'Coroner informed' },
  { code: 'DEATH', description: 'Death' },
  { code: 'FURTHER_CHARGES', description: 'Further charges' },
  { code: 'LOCAL_INVESTIGATION', description: 'Investigation (local)' },
  { code: 'NEXT_OF_KIN_INFORMED', description: 'Next of kin informed' },
  { code: 'PLACED_ON_REPORT', description: 'Placed on report' },
  { code: 'POLICE_INVESTIGATION', description: 'Investigation (Police)' },
  { code: 'REMAND', description: 'Remand' },
  { code: 'SEEN_DUTY_GOV', description: 'Seen by Duty Governor' },
  { code: 'SEEN_HEALTHCARE', description: 'Seen by Healthcare' },
  { code: 'SEEN_IMB', description: 'Seen by IMB' },
  { code: 'SEEN_OUTSIDE_HOSP', description: 'Seen by outside hospital' },
  { code: 'TRANSFER', description: 'Transfer' },
  { code: 'TRIAL', description: 'Trial' },
] as const

/** Outcomes from a prisoner’s involvement in an incident */
export type PrisonerInvolvementOutcomeDetails = (typeof prisonerInvolvementOutcomes)[number]

/** Codes for outcomes from a prisoner’s involvement in an incident */
export type PrisonerInvolvementOutcome = PrisonerInvolvementOutcomeDetails['code']

/** Lookup for outcomes from a prisoner’s involvement in an incident */
export function getPrisonerInvolvementOutcomeDetails(code: string): PrisonerInvolvementOutcomeDetails | null {
  return prisonerInvolvementOutcomes.find(item => item.code === code) ?? null
}
