// Generated with ./scripts/importDpsConstants.ts 2024-09-11T10:04:09.546Z

export const staffInvolvementRoles = [
  /** Actively involved */
  'ACTIVELY_INVOLVED',
  /** Authorising officer */
  'AUTHORISING_OFFICER',
  /** Control and restraint - head */
  'CR_HEAD',
  /** Control and restraint - left arm */
  'CR_LEFT_ARM',
  /** Control and restraint - legs */
  'CR_LEGS',
  /** Control and restraint - right arm */
  'CR_RIGHT_ARM',
  /** Control and restraint - supervisor */
  'CR_SUPERVISOR',
  /** Deceased */
  'DECEASED',
  /** First on scene */
  'FIRST_ON_SCENE',
  /** Healthcare */
  'HEALTHCARE',
  /** Hostage */
  'HOSTAGE',
  /** In possession */
  'IN_POSSESSION',
  /** Negotiator */
  'NEGOTIATOR',
  /** Present at scene */
  'PRESENT_AT_SCENE',
  /** Suspected involvement */
  'SUSPECTED_INVOLVEMENT',
  /** Victim */
  'VICTIM',
  /** Witness */
  'WITNESS',
] as const

export type StaffInvolvementRole = (typeof staffInvolvementRoles)[number]
