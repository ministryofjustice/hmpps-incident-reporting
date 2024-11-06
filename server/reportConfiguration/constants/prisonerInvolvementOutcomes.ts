// Generated with ./scripts/importDpsConstants.ts at 2024-11-06T10:46:42.719Z

/** Outcomes from a prisoner’s involvement in an incident */
export const prisonerInvolvementOutcomes = [
  { code: 'ACCT', description: 'ACCT', nomisCode: 'ACCT' },
  { code: 'CHARGED_BY_POLICE', description: 'Charged by Police', nomisCode: 'CBP' },
  { code: 'CONVICTED', description: 'Convicted', nomisCode: 'CON' },
  { code: 'CORONER_INFORMED', description: 'Coroner informed', nomisCode: 'CORIN' },
  { code: 'DEATH', description: 'Death', nomisCode: 'DEA' },
  { code: 'FURTHER_CHARGES', description: 'Further charges', nomisCode: 'FCHRG' },
  { code: 'LOCAL_INVESTIGATION', description: 'Investigation (local)', nomisCode: 'ILOC' },
  { code: 'NEXT_OF_KIN_INFORMED', description: 'Next of kin informed', nomisCode: 'NKI' },
  { code: 'PLACED_ON_REPORT', description: 'Placed on report', nomisCode: 'POR' },
  { code: 'POLICE_INVESTIGATION', description: 'Investigation (Police)', nomisCode: 'IPOL' },
  { code: 'REMAND', description: 'Remand', nomisCode: 'RMND' },
  { code: 'SEEN_DUTY_GOV', description: 'Seen by Duty Governor', nomisCode: 'DUTGOV' },
  { code: 'SEEN_HEALTHCARE', description: 'Seen by Healthcare', nomisCode: 'HELTH' },
  { code: 'SEEN_IMB', description: 'Seen by IMB', nomisCode: 'IMB' },
  { code: 'SEEN_OUTSIDE_HOSP', description: 'Seen by outside hospital', nomisCode: 'OUTH' },
  { code: 'TRANSFER', description: 'Transfer', nomisCode: 'TRN' },
  { code: 'TRIAL', description: 'Trial', nomisCode: 'TRL' },
] as const

/** Outcomes from a prisoner’s involvement in an incident */
export type PrisonerInvolvementOutcomeDetails = (typeof prisonerInvolvementOutcomes)[number]

/** Codes for outcomes from a prisoner’s involvement in an incident */
export type PrisonerInvolvementOutcome = PrisonerInvolvementOutcomeDetails['code']

/**
 * NOMIS codes for Outcomes from a prisoner’s involvement in an incident
 * @deprecated
 */
export type NomisPrisonerInvolvementOutcome = PrisonerInvolvementOutcomeDetails['nomisCode']

/** Lookup for outcomes from a prisoner’s involvement in an incident */
export function getPrisonerInvolvementOutcomeDetails(code: string): PrisonerInvolvementOutcomeDetails | null {
  return prisonerInvolvementOutcomes.find(item => item.code === code) ?? null
}
