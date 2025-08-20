// Generated with ./scripts/importDpsConstants.ts at 2025-08-19T16:39:01.117Z

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
type PrisonerInvolvementOutcomeDetails = (typeof prisonerInvolvementOutcomes)[number]

/** Codes for outcomes from a prisoner’s involvement in an incident */
export type PrisonerInvolvementOutcome = PrisonerInvolvementOutcomeDetails['code']

/** Code to description mapping for outcomes from a prisoner’s involvement in an incident */
export const prisonerInvolvementOutcomesDescriptions: Record<PrisonerInvolvementOutcome, string> = {
  ACCT: 'ACCT',
  CHARGED_BY_POLICE: 'Charged by Police',
  CONVICTED: 'Convicted',
  CORONER_INFORMED: 'Coroner informed',
  DEATH: 'Death',
  FURTHER_CHARGES: 'Further charges',
  LOCAL_INVESTIGATION: 'Investigation (local)',
  NEXT_OF_KIN_INFORMED: 'Next of kin informed',
  PLACED_ON_REPORT: 'Placed on report',
  POLICE_INVESTIGATION: 'Investigation (Police)',
  REMAND: 'Remand',
  SEEN_DUTY_GOV: 'Seen by Duty Governor',
  SEEN_HEALTHCARE: 'Seen by Healthcare',
  SEEN_IMB: 'Seen by IMB',
  SEEN_OUTSIDE_HOSP: 'Seen by outside hospital',
  TRANSFER: 'Transfer',
  TRIAL: 'Trial',
}

/**
 * NOMIS codes for Outcomes from a prisoner’s involvement in an incident
 * @deprecated
 */
export type NomisPrisonerInvolvementOutcome = PrisonerInvolvementOutcomeDetails['nomisCode']

/** Lookup for outcomes from a prisoner’s involvement in an incident */
export function getPrisonerInvolvementOutcomeDetails(code: string): PrisonerInvolvementOutcomeDetails | null {
  return prisonerInvolvementOutcomes.find(item => item.code === code) ?? null
}
