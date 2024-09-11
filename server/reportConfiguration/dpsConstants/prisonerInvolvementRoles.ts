// Generated with ./scripts/importDpsConstants.ts at 2024-09-11T16:52:05.099Z

/** Roles of a prisoner’s involvement in an incident */
export const prisonerInvolvementRoles = [
  /** Absconder */
  'ABSCONDER',
  /** Active involvement */
  'ACTIVE_INVOLVEMENT',
  /** Assailant */
  'ASSAILANT',
  /** Assisted staff */
  'ASSISTED_STAFF',
  /** Deceased */
  'DECEASED',
  /** Escapee */
  'ESCAPE',
  /** Fighter */
  'FIGHTER',
  /** Hostage */
  'HOSTAGE',
  /** Impeded staff */
  'IMPEDED_STAFF',
  /** In possession */
  'IN_POSSESSION',
  /** Intended recipient */
  'INTENDED_RECIPIENT',
  /** License failure */
  'LICENSE_FAILURE',
  /** Perpetrator */
  'PERPETRATOR',
  /** Present at scene */
  'PRESENT_AT_SCENE',
  /** Suspected assailant */
  'SUSPECTED_ASSAILANT',
  /** Suspected involved */
  'SUSPECTED_INVOLVED',
  /** Temporary release failure */
  'TEMPORARY_RELEASE_FAILURE',
  /** Victim */
  'VICTIM',
] as const

/** Roles of a prisoner’s involvement in an incident */
export type PrisonerInvolvementRole = (typeof prisonerInvolvementRoles)[number]
