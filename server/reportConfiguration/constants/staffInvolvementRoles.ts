// Generated with ./scripts/importDpsConstants.ts at 2024-09-12T13:42:31.910Z

/** Roles of staff involvement in an incident */
export const staffInvolvementRoles = [
  { code: 'ACTIVELY_INVOLVED', description: 'Actively involved' },
  { code: 'AUTHORISING_OFFICER', description: 'Authorising officer' },
  { code: 'CR_HEAD', description: 'Control and restraint - head' },
  { code: 'CR_LEFT_ARM', description: 'Control and restraint - left arm' },
  { code: 'CR_LEGS', description: 'Control and restraint - legs' },
  { code: 'CR_RIGHT_ARM', description: 'Control and restraint - right arm' },
  { code: 'CR_SUPERVISOR', description: 'Control and restraint - supervisor' },
  { code: 'DECEASED', description: 'Deceased' },
  { code: 'FIRST_ON_SCENE', description: 'First on scene' },
  { code: 'HEALTHCARE', description: 'Healthcare' },
  { code: 'HOSTAGE', description: 'Hostage' },
  { code: 'IN_POSSESSION', description: 'In possession' },
  { code: 'NEGOTIATOR', description: 'Negotiator' },
  { code: 'PRESENT_AT_SCENE', description: 'Present at scene' },
  { code: 'SUSPECTED_INVOLVEMENT', description: 'Suspected involvement' },
  { code: 'VICTIM', description: 'Victim' },
  { code: 'WITNESS', description: 'Witness' },
] as const

/** Roles of staff involvement in an incident */
export type StaffInvolvementRole = (typeof staffInvolvementRoles)[number]['code']
