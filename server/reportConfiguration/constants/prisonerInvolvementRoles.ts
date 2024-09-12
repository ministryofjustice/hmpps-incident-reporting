// Generated with ./scripts/importDpsConstants.ts at 2024-09-12T13:42:32.535Z

/** Roles of a prisoner’s involvement in an incident */
export const prisonerInvolvementRoles = [
  { code: 'ABSCONDER', description: 'Absconder' },
  { code: 'ACTIVE_INVOLVEMENT', description: 'Active involvement' },
  { code: 'ASSAILANT', description: 'Assailant' },
  { code: 'ASSISTED_STAFF', description: 'Assisted staff' },
  { code: 'DECEASED', description: 'Deceased' },
  { code: 'ESCAPE', description: 'Escapee' },
  { code: 'FIGHTER', description: 'Fighter' },
  { code: 'HOSTAGE', description: 'Hostage' },
  { code: 'IMPEDED_STAFF', description: 'Impeded staff' },
  { code: 'IN_POSSESSION', description: 'In possession' },
  { code: 'INTENDED_RECIPIENT', description: 'Intended recipient' },
  { code: 'LICENSE_FAILURE', description: 'License failure' },
  { code: 'PERPETRATOR', description: 'Perpetrator' },
  { code: 'PRESENT_AT_SCENE', description: 'Present at scene' },
  { code: 'SUSPECTED_ASSAILANT', description: 'Suspected assailant' },
  { code: 'SUSPECTED_INVOLVED', description: 'Suspected involved' },
  { code: 'TEMPORARY_RELEASE_FAILURE', description: 'Temporary release failure' },
  { code: 'VICTIM', description: 'Victim' },
] as const

/** Roles of a prisoner’s involvement in an incident */
export type PrisonerInvolvementRole = (typeof prisonerInvolvementRoles)[number]['code']
