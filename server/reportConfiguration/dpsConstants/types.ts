// Generated with ./scripts/importDpsConstants.ts 2024-09-11T11:21:23.335Z

export const types = [
  /** Absconder */
  { code: 'ABSCONDER', active: true, nomisCode: 'ABSCOND' },
  /** Assault */
  { code: 'ASSAULT', active: true, nomisCode: 'ASSAULTS3' },
  /** Attempted escape from custody */
  { code: 'ATTEMPTED_ESCAPE_FROM_CUSTODY', active: true, nomisCode: 'ATT_ESCAPE' },
  /** Attempted escape from escort */
  { code: 'ATTEMPTED_ESCAPE_FROM_ESCORT', active: true, nomisCode: 'ATT_ESC_E' },
  /** Bomb threat */
  { code: 'BOMB_THREAT', active: true, nomisCode: 'BOMB' },
  /** Breach of security */
  { code: 'BREACH_OF_SECURITY', active: true, nomisCode: 'BREACH' },
  /** Damage */
  { code: 'DAMAGE', active: true, nomisCode: 'DAMAGE' },
  /** Death in custody */
  { code: 'DEATH_IN_CUSTODY', active: true, nomisCode: 'DEATH' },
  /** Death (other) */
  { code: 'DEATH_OTHER', active: true, nomisCode: 'DEATH_NI' },
  /** Disorder */
  { code: 'DISORDER', active: true, nomisCode: 'DISORDER1' },
  /** Drone sighting */
  { code: 'DRONE_SIGHTING', active: true, nomisCode: 'DRONE2' },
  /** Drone sighting */
  { code: 'OLD_DRONE_SIGHTING1', active: true, nomisCode: 'DRONE1' },
  /** Escape from custody */
  { code: 'ESCAPE_FROM_CUSTODY', active: true, nomisCode: 'ESCAPE_EST' },
  /** Escape from escort */
  { code: 'ESCAPE_FROM_ESCORT', active: true, nomisCode: 'ESCAPE_ESC' },
  /** Finds */
  { code: 'FINDS', active: true, nomisCode: 'FIND0422' },
  /** Fire */
  { code: 'FIRE', active: true, nomisCode: 'FIRE' },
  /** Food refusal */
  { code: 'FOOD_REFUSAL', active: true, nomisCode: 'FOOD_REF' },
  /** Full close down search */
  { code: 'FULL_CLOSE_DOWN_SEARCH', active: true, nomisCode: 'CLOSE_DOWN' },
  /** Key lock incident */
  { code: 'KEY_LOCK_INCIDENT', active: true, nomisCode: 'KEY_LOCKNEW' },
  /** Miscellaneous */
  { code: 'MISCELLANEOUS', active: true, nomisCode: 'MISC' },
  /** Radio compromise */
  { code: 'RADIO_COMPROMISE', active: true, nomisCode: 'RADIO_COMP' },
  /** Released in error */
  { code: 'RELEASED_IN_ERROR', active: true, nomisCode: 'REL_ERROR' },
  /** Self harm */
  { code: 'SELF_HARM', active: true, nomisCode: 'SELF_HARM' },
  /** Temporary release failure */
  { code: 'TEMPORARY_RELEASE_FAILURE', active: true, nomisCode: 'TRF3' },
  /** Tool loss */
  { code: 'TOOL_LOSS', active: true, nomisCode: 'TOOL_LOSS' },
  /** Assault */
  { code: 'OLD_ASSAULT', active: false, nomisCode: 'ASSAULT' },
  /** Assault (from April 2017) */
  { code: 'OLD_ASSAULT1', active: false, nomisCode: 'ASSAULTS' },
  /** Assault (from April 2017) */
  { code: 'OLD_ASSAULT2', active: false, nomisCode: 'ASSAULTS1' },
  /** Assault (from April 2017) */
  { code: 'OLD_ASSAULT3', active: false, nomisCode: 'ASSAULTS2' },
  /** Barricade/prevention of access */
  { code: 'OLD_BARRICADE', active: false, nomisCode: 'BARRICADE' },
  /** Concerted indiscipline */
  { code: 'OLD_CONCERTED_INDISCIPLINE', active: false, nomisCode: 'CON_INDISC' },
  /** Disorder */
  { code: 'OLD_DISORDER', active: false, nomisCode: 'DISORDER' },
  /** Drone sighting */
  { code: 'OLD_DRONE_SIGHTING', active: false, nomisCode: 'DRONE' },
  /** Drugs */
  { code: 'OLD_DRUGS', active: false, nomisCode: 'DRUGS' },
  /** Finds */
  { code: 'OLD_FINDS', active: false, nomisCode: 'FINDS' },
  /** Finds (from August 2015) */
  { code: 'OLD_FINDS1', active: false, nomisCode: 'FIND' },
  /** Finds (from September 2015) */
  { code: 'OLD_FINDS2', active: false, nomisCode: 'FIND1' },
  /** Finds (from March 2022) */
  { code: 'OLD_FINDS3', active: false, nomisCode: 'FIND0322' },
  /** Finds (from September 2016) */
  { code: 'OLD_FINDS4', active: false, nomisCode: 'FINDS1' },
  /** Firearm/ammunition/chemical incapacitant */
  { code: 'OLD_FIREARM_ETC', active: false, nomisCode: 'FIREARM_ETC' },
  /** Hostage */
  { code: 'OLD_HOSTAGE', active: false, nomisCode: 'HOSTAGE' },
  /** Key lock incident */
  { code: 'OLD_KEY_LOCK_INCIDENT', active: false, nomisCode: 'KEY_LOCK' },
  /** Mobile phones */
  { code: 'OLD_MOBILES', active: false, nomisCode: 'MOBILES' },
  /** Incident at height */
  { code: 'OLD_ROOF_CLIMB', active: false, nomisCode: 'ROOF_CLIMB' },
  /** Temporary release failure */
  { code: 'OLD_TEMPORARY_RELEASE_FAILURE', active: false, nomisCode: 'TRF' },
  /** Temporary release failure (from July 2015) */
  { code: 'OLD_TEMPORARY_RELEASE_FAILURE1', active: false, nomisCode: 'TRF1' },
  /** Temporary release failure (from April 2016) */
  { code: 'OLD_TEMPORARY_RELEASE_FAILURE2', active: false, nomisCode: 'TRF2' },
] as const

export type Type = (typeof types)[number]['code']
