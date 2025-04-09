// Generated with ./scripts/importDpsConstants.ts at 2025-04-01T17:15:27.753Z

/** Types of reportable incidents */
export const types = [
  { familyCode: 'ABSCOND', code: 'ABSCOND_1', description: 'Abscond', active: true, nomisCode: 'ABSCOND' },
  { familyCode: 'ASSAULT', code: 'ASSAULT_1', description: 'Assault', active: false, nomisCode: 'ASSAULT' },
  { familyCode: 'ASSAULT', code: 'ASSAULT_2', description: 'Assault', active: false, nomisCode: 'ASSAULTS' },
  { familyCode: 'ASSAULT', code: 'ASSAULT_3', description: 'Assault', active: false, nomisCode: 'ASSAULTS1' },
  { familyCode: 'ASSAULT', code: 'ASSAULT_4', description: 'Assault', active: false, nomisCode: 'ASSAULTS2' },
  { familyCode: 'ASSAULT', code: 'ASSAULT_5', description: 'Assault', active: true, nomisCode: 'ASSAULTS3' },
  {
    familyCode: 'ATTEMPTED_ESCAPE_FROM_PRISON',
    code: 'ATTEMPTED_ESCAPE_FROM_PRISON_1',
    description: 'Attempted escape from establishment',
    active: true,
    nomisCode: 'ATT_ESCAPE',
  },
  {
    familyCode: 'ATTEMPTED_ESCAPE_FROM_ESCORT',
    code: 'ATTEMPTED_ESCAPE_FROM_ESCORT_1',
    description: 'Attempted escape from escort',
    active: true,
    nomisCode: 'ATT_ESC_E',
  },
  { familyCode: 'BARRICADE', code: 'BARRICADE_1', description: 'Barricade', active: false, nomisCode: 'BARRICADE' },
  { familyCode: 'BOMB', code: 'BOMB_1', description: 'Bomb explosion or threat', active: true, nomisCode: 'BOMB' },
  {
    familyCode: 'BREACH_OF_SECURITY',
    code: 'BREACH_OF_SECURITY_1',
    description: 'Breach or attempted breach of security',
    active: true,
    nomisCode: 'BREACH',
  },
  {
    familyCode: 'CLOSE_DOWN_SEARCH',
    code: 'CLOSE_DOWN_SEARCH_1',
    description: 'Close down search',
    active: true,
    nomisCode: 'CLOSE_DOWN',
  },
  {
    familyCode: 'CONCERTED_INDISCIPLINE',
    code: 'CONCERTED_INDISCIPLINE_1',
    description: 'Incident involving 2 or more prisioners acting together',
    active: false,
    nomisCode: 'CON_INDISC',
  },
  {
    familyCode: 'DAMAGE',
    code: 'DAMAGE_1',
    description: 'Deliberate damage',
    active: false,
    nomisCode: 'DAMAGE',
  },
  {
    familyCode: 'DEATH_PRISONER',
    code: 'DEATH_PRISONER_1',
    description: 'Death of prisoner',
    active: true,
    nomisCode: 'DEATH',
  },
  {
    familyCode: 'DEATH_OTHER',
    code: 'DEATH_OTHER_1',
    description: 'Death of other person',
    active: true,
    nomisCode: 'DEATH_NI',
  },
  { familyCode: 'DISORDER', code: 'DISORDER_1', description: 'Disorder', active: false, nomisCode: 'DISORDER' },
  { familyCode: 'DISORDER', code: 'DISORDER_2', description: 'Disorder', active: true, nomisCode: 'DISORDER1' },
  {
    familyCode: 'DRONE_SIGHTING',
    code: 'DRONE_SIGHTING_1',
    description: 'Drone sighting',
    active: false,
    nomisCode: 'DRONE',
  },
  {
    familyCode: 'DRONE_SIGHTING',
    code: 'DRONE_SIGHTING_2',
    description: 'Drone sighting',
    active: false,
    nomisCode: 'DRONE1',
  },
  {
    familyCode: 'DRONE_SIGHTING',
    code: 'DRONE_SIGHTING_3',
    description: 'Drone sighting',
    active: true,
    nomisCode: 'DRONE2',
  },
  { familyCode: 'DRUGS', code: 'DRUGS_1', description: 'Drugs', active: false, nomisCode: 'DRUGS' },
  {
    familyCode: 'ESCAPE_FROM_PRISON',
    code: 'ESCAPE_FROM_PRISON_1',
    description: 'Escape from establishment',
    active: true,
    nomisCode: 'ESCAPE_EST',
  },
  {
    familyCode: 'ESCAPE_FROM_ESCORT',
    code: 'ESCAPE_FROM_ESCORT_1',
    description: 'Escape from escort',
    active: true,
    nomisCode: 'ESCAPE_ESC',
  },
  { familyCode: 'FIND', code: 'FIND_1', description: 'Find of illicit items', active: false, nomisCode: 'FINDS' },
  { familyCode: 'FIND', code: 'FIND_2', description: 'Find of illicit items', active: false, nomisCode: 'FIND' },
  { familyCode: 'FIND', code: 'FIND_3', description: 'Find of illicit items', active: false, nomisCode: 'FIND1' },
  { familyCode: 'FIND', code: 'FIND_4', description: 'Find of illicit items', active: false, nomisCode: 'FIND0322' },
  { familyCode: 'FIND', code: 'FIND_5', description: 'Find of illicit items', active: false, nomisCode: 'FINDS1' },
  { familyCode: 'FIND', code: 'FIND_6', description: 'Find of illicit items', active: true, nomisCode: 'FIND0422' },
  { familyCode: 'FIRE', code: 'FIRE_1', description: 'Fire', active: true, nomisCode: 'FIRE' },
  {
    familyCode: 'FIREARM',
    code: 'FIREARM_1',
    description: 'Firearm, ammunition or chemical incapacitant',
    active: false,
    nomisCode: 'FIREARM_ETC',
  },
  {
    familyCode: 'FOOD_REFUSAL',
    code: 'FOOD_REFUSAL_1',
    description: 'Food or liquid refusual',
    active: true,
    nomisCode: 'FOOD_REF',
  },
  { familyCode: 'HOSTAGE', code: 'HOSTAGE_1', description: 'Hostage incident', active: false, nomisCode: 'HOSTAGE' },
  {
    familyCode: 'INCIDENT_AT_HEIGHT',
    code: 'INCIDENT_AT_HEIGHT_1',
    description: 'Incident at height',
    active: false,
    nomisCode: 'ROOF_CLIMB',
  },
  {
    familyCode: 'KEY_OR_LOCK',
    code: 'KEY_OR_LOCK_1',
    description: 'Key or lock compromise',
    active: false,
    nomisCode: 'KEY_LOCK',
  },
  {
    familyCode: 'KEY_OR_LOCK',
    code: 'KEY_OR_LOCK_2',
    description: 'Key or lock compromise',
    active: true,
    nomisCode: 'KEY_LOCKNEW',
  },
  {
    familyCode: 'MISCELLANEOUS',
    code: 'MISCELLANEOUS_1',
    description: 'Miscellaneous',
    active: true,
    nomisCode: 'MISC',
  },
  {
    familyCode: 'MOBILE_PHONE',
    code: 'MOBILE_PHONE_1',
    description: 'Mobile phone',
    active: false,
    nomisCode: 'MOBILES',
  },
  {
    familyCode: 'RADIO_COMPROMISE',
    code: 'RADIO_COMPROMISE_1',
    description: 'Radio compromise',
    active: true,
    nomisCode: 'RADIO_COMP',
  },
  {
    familyCode: 'RELEASE_IN_ERROR',
    code: 'RELEASE_IN_ERROR_1',
    description: 'Release in error',
    active: true,
    nomisCode: 'REL_ERROR',
  },
  { familyCode: 'SELF_HARM', code: 'SELF_HARM_1', description: 'Self harm', active: true, nomisCode: 'SELF_HARM' },
  {
    familyCode: 'TEMPORARY_RELEASE_FAILURE',
    code: 'TEMPORARY_RELEASE_FAILURE_1',
    description: 'Temporary release failure',
    active: false,
    nomisCode: 'TRF',
  },
  {
    familyCode: 'TEMPORARY_RELEASE_FAILURE',
    code: 'TEMPORARY_RELEASE_FAILURE_2',
    description: 'Temporary release failure',
    active: false,
    nomisCode: 'TRF1',
  },
  {
    familyCode: 'TEMPORARY_RELEASE_FAILURE',
    code: 'TEMPORARY_RELEASE_FAILURE_3',
    description: 'Temporary release failure',
    active: false,
    nomisCode: 'TRF2',
  },
  {
    familyCode: 'TEMPORARY_RELEASE_FAILURE',
    code: 'TEMPORARY_RELEASE_FAILURE_4',
    description: 'Temporary release failure',
    active: true,
    nomisCode: 'TRF3',
  },
  {
    familyCode: 'TOOL_LOSS',
    code: 'TOOL_LOSS_1',
    description: 'Tool or implement loss',
    active: true,
    nomisCode: 'TOOL_LOSS',
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
