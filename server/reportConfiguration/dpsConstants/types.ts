// Generated with ./scripts/importDpsConstants.ts 2024-09-11T10:04:07.435Z

export const types = [
  /** Absconder */
  { code: 'ABSCONDER', active: true },
  /** Assault */
  { code: 'ASSAULT', active: true },
  /** Attempted escape from custody */
  { code: 'ATTEMPTED_ESCAPE_FROM_CUSTODY', active: true },
  /** Attempted escape from escort */
  { code: 'ATTEMPTED_ESCAPE_FROM_ESCORT', active: true },
  /** Bomb threat */
  { code: 'BOMB_THREAT', active: true },
  /** Breach of security */
  { code: 'BREACH_OF_SECURITY', active: true },
  /** Damage */
  { code: 'DAMAGE', active: true },
  /** Death in custody */
  { code: 'DEATH_IN_CUSTODY', active: true },
  /** Death (other) */
  { code: 'DEATH_OTHER', active: true },
  /** Disorder */
  { code: 'DISORDER', active: true },
  /** Drone sighting */
  { code: 'DRONE_SIGHTING', active: true },
  /** Drone sighting */
  { code: 'OLD_DRONE_SIGHTING1', active: true },
  /** Escape from custody */
  { code: 'ESCAPE_FROM_CUSTODY', active: true },
  /** Escape from escort */
  { code: 'ESCAPE_FROM_ESCORT', active: true },
  /** Finds */
  { code: 'FINDS', active: true },
  /** Fire */
  { code: 'FIRE', active: true },
  /** Food refusal */
  { code: 'FOOD_REFUSAL', active: true },
  /** Full close down search */
  { code: 'FULL_CLOSE_DOWN_SEARCH', active: true },
  /** Key lock incident */
  { code: 'KEY_LOCK_INCIDENT', active: true },
  /** Miscellaneous */
  { code: 'MISCELLANEOUS', active: true },
  /** Radio compromise */
  { code: 'RADIO_COMPROMISE', active: true },
  /** Released in error */
  { code: 'RELEASED_IN_ERROR', active: true },
  /** Self harm */
  { code: 'SELF_HARM', active: true },
  /** Temporary release failure */
  { code: 'TEMPORARY_RELEASE_FAILURE', active: true },
  /** Tool loss */
  { code: 'TOOL_LOSS', active: true },
  /** Assault */
  { code: 'OLD_ASSAULT', active: false },
  /** Assault (from April 2017) */
  { code: 'OLD_ASSAULT1', active: false },
  /** Assault (from April 2017) */
  { code: 'OLD_ASSAULT2', active: false },
  /** Assault (from April 2017) */
  { code: 'OLD_ASSAULT3', active: false },
  /** Barricade/prevention of access */
  { code: 'OLD_BARRICADE', active: false },
  /** Concerted indiscipline */
  { code: 'OLD_CONCERTED_INDISCIPLINE', active: false },
  /** Disorder */
  { code: 'OLD_DISORDER', active: false },
  /** Drone sighting */
  { code: 'OLD_DRONE_SIGHTING', active: false },
  /** Drugs */
  { code: 'OLD_DRUGS', active: false },
  /** Finds */
  { code: 'OLD_FINDS', active: false },
  /** Finds (from August 2015) */
  { code: 'OLD_FINDS1', active: false },
  /** Finds (from September 2015) */
  { code: 'OLD_FINDS2', active: false },
  /** Finds (from March 2022) */
  { code: 'OLD_FINDS3', active: false },
  /** Finds (from September 2016) */
  { code: 'OLD_FINDS4', active: false },
  /** Firearm/ammunition/chemical incapacitant */
  { code: 'OLD_FIREARM_ETC', active: false },
  /** Hostage */
  { code: 'OLD_HOSTAGE', active: false },
  /** Key lock incident */
  { code: 'OLD_KEY_LOCK_INCIDENT', active: false },
  /** Mobile phones */
  { code: 'OLD_MOBILES', active: false },
  /** Incident at height */
  { code: 'OLD_ROOF_CLIMB', active: false },
  /** Temporary release failure */
  { code: 'OLD_TEMPORARY_RELEASE_FAILURE', active: false },
  /** Temporary release failure (from July 2015) */
  { code: 'OLD_TEMPORARY_RELEASE_FAILURE1', active: false },
  /** Temporary release failure (from April 2016) */
  { code: 'OLD_TEMPORARY_RELEASE_FAILURE2', active: false },
] as const

export type Type = (typeof types)[number]['code']
