// Generated with ./scripts/importDpsConstants.ts at 2024-09-24T14:57:26.599Z

/** Roles of a prisoner’s involvement in an incident */
export const prisonerInvolvementRoles = [
  { code: 'ABSCONDER', description: 'Absconder', nomisCode: 'ABS' },
  { code: 'ACTIVE_INVOLVEMENT', description: 'Active involvement', nomisCode: 'ACTINV' },
  { code: 'ASSAILANT', description: 'Assailant', nomisCode: 'ASSIAL' },
  { code: 'ASSISTED_STAFF', description: 'Assisted staff', nomisCode: 'ASSIST' },
  { code: 'DECEASED', description: 'Deceased', nomisCode: 'DEC' },
  { code: 'ESCAPE', description: 'Escapee', nomisCode: 'ESC' },
  { code: 'FIGHTER', description: 'Fighter', nomisCode: 'FIGHT' },
  { code: 'HOSTAGE', description: 'Hostage', nomisCode: 'HOST' },
  { code: 'IMPEDED_STAFF', description: 'Impeded staff', nomisCode: 'IMPED' },
  { code: 'IN_POSSESSION', description: 'In possession', nomisCode: 'INPOSS' },
  { code: 'INTENDED_RECIPIENT', description: 'Intended recipient', nomisCode: 'INREC' },
  { code: 'LICENSE_FAILURE', description: 'License failure', nomisCode: 'LICFAIL' },
  { code: 'PERPETRATOR', description: 'Perpetrator', nomisCode: 'PERP' },
  { code: 'PRESENT_AT_SCENE', description: 'Present at scene', nomisCode: 'PRESENT' },
  { code: 'SUSPECTED_ASSAILANT', description: 'Suspected assailant', nomisCode: 'SUSASS' },
  { code: 'SUSPECTED_INVOLVED', description: 'Suspected involved', nomisCode: 'SUSINV' },
  { code: 'TEMPORARY_RELEASE_FAILURE', description: 'Temporary release failure', nomisCode: 'TRF' },
  { code: 'VICTIM', description: 'Victim', nomisCode: 'VICT' },
] as const

/** Roles of a prisoner’s involvement in an incident */
export type PrisonerInvolvementRole = (typeof prisonerInvolvementRoles)[number]['code']

/** Roles of a prisoner’s involvement in an incident
 * @deprecated
 */
export type NomisPrisonerInvolvementRole = (typeof prisonerInvolvementRoles)[number]['nomisCode']
