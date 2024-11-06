// Generated with ./scripts/importDpsConstants.ts at 2024-10-23T09:57:37.757Z

/** Types of reportable incidents */
export const types = [
  { code: 'ABSCONDER', description: 'Absconder', active: true, nomisCode: 'ABSCOND' },
  { code: 'ASSAULT', description: 'Assault', active: true, nomisCode: 'ASSAULTS3' },
  {
    code: 'ATTEMPTED_ESCAPE_FROM_CUSTODY',
    description: 'Attempted escape from custody',
    active: true,
    nomisCode: 'ATT_ESCAPE',
  },
  {
    code: 'ATTEMPTED_ESCAPE_FROM_ESCORT',
    description: 'Attempted escape from escort',
    active: true,
    nomisCode: 'ATT_ESC_E',
  },
  { code: 'BOMB_THREAT', description: 'Bomb threat', active: true, nomisCode: 'BOMB' },
  { code: 'BREACH_OF_SECURITY', description: 'Breach of security', active: true, nomisCode: 'BREACH' },
  { code: 'DAMAGE', description: 'Damage', active: true, nomisCode: 'DAMAGE' },
  { code: 'DEATH_IN_CUSTODY', description: 'Death in custody', active: true, nomisCode: 'DEATH' },
  { code: 'DEATH_OTHER', description: 'Death (other)', active: true, nomisCode: 'DEATH_NI' },
  { code: 'DISORDER', description: 'Disorder', active: true, nomisCode: 'DISORDER1' },
  { code: 'DRONE_SIGHTING', description: 'Drone sighting', active: true, nomisCode: 'DRONE2' },
  { code: 'OLD_DRONE_SIGHTING1', description: 'Drone sighting', active: true, nomisCode: 'DRONE1' },
  { code: 'ESCAPE_FROM_CUSTODY', description: 'Escape from custody', active: true, nomisCode: 'ESCAPE_EST' },
  { code: 'ESCAPE_FROM_ESCORT', description: 'Escape from escort', active: true, nomisCode: 'ESCAPE_ESC' },
  { code: 'FINDS', description: 'Finds', active: true, nomisCode: 'FIND0422' },
  { code: 'FIRE', description: 'Fire', active: true, nomisCode: 'FIRE' },
  { code: 'FOOD_REFUSAL', description: 'Food refusal', active: true, nomisCode: 'FOOD_REF' },
  { code: 'FULL_CLOSE_DOWN_SEARCH', description: 'Full close down search', active: true, nomisCode: 'CLOSE_DOWN' },
  { code: 'KEY_LOCK_INCIDENT', description: 'Key lock incident', active: true, nomisCode: 'KEY_LOCKNEW' },
  { code: 'MISCELLANEOUS', description: 'Miscellaneous', active: true, nomisCode: 'MISC' },
  { code: 'RADIO_COMPROMISE', description: 'Radio compromise', active: true, nomisCode: 'RADIO_COMP' },
  { code: 'RELEASED_IN_ERROR', description: 'Released in error', active: true, nomisCode: 'REL_ERROR' },
  { code: 'SELF_HARM', description: 'Self harm', active: true, nomisCode: 'SELF_HARM' },
  { code: 'TEMPORARY_RELEASE_FAILURE', description: 'Temporary release failure', active: true, nomisCode: 'TRF3' },
  { code: 'TOOL_LOSS', description: 'Tool loss', active: true, nomisCode: 'TOOL_LOSS' },
  { code: 'OLD_ASSAULT', description: 'Assault', active: false, nomisCode: 'ASSAULT' },
  { code: 'OLD_ASSAULT1', description: 'Assault (from April 2017)', active: false, nomisCode: 'ASSAULTS' },
  { code: 'OLD_ASSAULT2', description: 'Assault (from April 2017)', active: false, nomisCode: 'ASSAULTS1' },
  { code: 'OLD_ASSAULT3', description: 'Assault (from April 2017)', active: false, nomisCode: 'ASSAULTS2' },
  { code: 'OLD_BARRICADE', description: 'Barricade/prevention of access', active: false, nomisCode: 'BARRICADE' },
  { code: 'OLD_CONCERTED_INDISCIPLINE', description: 'Concerted indiscipline', active: false, nomisCode: 'CON_INDISC' },
  { code: 'OLD_DISORDER', description: 'Disorder', active: false, nomisCode: 'DISORDER' },
  { code: 'OLD_DRONE_SIGHTING', description: 'Drone sighting', active: false, nomisCode: 'DRONE' },
  { code: 'OLD_DRUGS', description: 'Drugs', active: false, nomisCode: 'DRUGS' },
  { code: 'OLD_FINDS', description: 'Finds', active: false, nomisCode: 'FINDS' },
  { code: 'OLD_FINDS1', description: 'Finds (from August 2015)', active: false, nomisCode: 'FIND' },
  { code: 'OLD_FINDS2', description: 'Finds (from September 2015)', active: false, nomisCode: 'FIND1' },
  { code: 'OLD_FINDS3', description: 'Finds (from March 2022)', active: false, nomisCode: 'FIND0322' },
  { code: 'OLD_FINDS4', description: 'Finds (from September 2016)', active: false, nomisCode: 'FINDS1' },
  {
    code: 'OLD_FIREARM_ETC',
    description: 'Firearm/ammunition/chemical incapacitant',
    active: false,
    nomisCode: 'FIREARM_ETC',
  },
  { code: 'OLD_HOSTAGE', description: 'Hostage', active: false, nomisCode: 'HOSTAGE' },
  { code: 'OLD_KEY_LOCK_INCIDENT', description: 'Key lock incident', active: false, nomisCode: 'KEY_LOCK' },
  { code: 'OLD_MOBILES', description: 'Mobile phones', active: false, nomisCode: 'MOBILES' },
  { code: 'OLD_ROOF_CLIMB', description: 'Incident at height', active: false, nomisCode: 'ROOF_CLIMB' },
  { code: 'OLD_TEMPORARY_RELEASE_FAILURE', description: 'Temporary release failure', active: false, nomisCode: 'TRF' },
  {
    code: 'OLD_TEMPORARY_RELEASE_FAILURE1',
    description: 'Temporary release failure (from July 2015)',
    active: false,
    nomisCode: 'TRF1',
  },
  {
    code: 'OLD_TEMPORARY_RELEASE_FAILURE2',
    description: 'Temporary release failure (from April 2016)',
    active: false,
    nomisCode: 'TRF2',
  },
] as const

/** Types of reportable incidents */
export type TypeDetails = (typeof types)[number]

/** Codes for types of reportable incidents */
export type Type = TypeDetails['code']

/**
 * NOMIS codes for Types of reportable incidents
 * @deprecated
 */
export type NomisType = TypeDetails['nomisCode']

/** Lookup for types of reportable incidents */
export function getTypeDetails(code: string): TypeDetails | null {
  return types.find(item => item.code === code) ?? null
}
