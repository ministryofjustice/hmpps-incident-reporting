// Generated with ./scripts/importDpsConstants.ts at 2025-04-01T17:13:56.132Z

/** Incident type families */
export const typeFamilies = [
  { code: 'ABSCOND', description: 'Abscond' },
  { code: 'ASSAULT', description: 'Assault' },
  { code: 'ATTEMPTED_ESCAPE_FROM_PRISON', description: 'Attempted escape from establishment' },
  { code: 'ATTEMPTED_ESCAPE_FROM_ESCORT', description: 'Attempted escape from escort' },
  { code: 'BARRICADE', description: 'Barricade' },
  { code: 'BOMB', description: 'Bomb explosion or threat' },
  { code: 'BREACH_OF_SECURITY', description: 'Breach or attempted breach of security' },
  { code: 'CLOSE_DOWN_SEARCH', description: 'Close down search' },
  { code: 'CONCERTED_INDISCIPLINE', description: 'Incident involving 2 or more prisioners acting together' },
  { code: 'DAMAGE', description: 'Deliberate damage' },
  { code: 'DEATH_PRISONER', description: 'Death of prisoner' },
  { code: 'DEATH_OTHER', description: 'Death of other person' },
  { code: 'DISORDER', description: 'Disorder' },
  { code: 'DRONE_SIGHTING', description: 'Drone sighting' },
  { code: 'DRUGS', description: 'Drugs' },
  { code: 'ESCAPE_FROM_PRISON', description: 'Escape from establishment' },
  { code: 'ESCAPE_FROM_ESCORT', description: 'Escape from escort' },
  { code: 'FIND', description: 'Find of illicit items' },
  { code: 'FIRE', description: 'Fire' },
  { code: 'FIREARM', description: 'Firearm, ammunition or chemical incapacitant' },
  { code: 'FOOD_REFUSAL', description: 'Food or liquid refusual' },
  { code: 'HOSTAGE', description: 'Hostage incident' },
  { code: 'INCIDENT_AT_HEIGHT', description: 'Incident at height' },
  { code: 'KEY_OR_LOCK', description: 'Key or lock compromise' },
  { code: 'MISCELLANEOUS', description: 'Miscellaneous' },
  { code: 'MOBILE_PHONE', description: 'Mobile phone' },
  { code: 'RADIO_COMPROMISE', description: 'Radio compromise' },
  { code: 'RELEASE_IN_ERROR', description: 'Release in error' },
  { code: 'SELF_HARM', description: 'Self harm' },
  { code: 'TEMPORARY_RELEASE_FAILURE', description: 'Temporary release failure' },
  { code: 'TOOL_LOSS', description: 'Tool or implement loss' },
] as const

/** Incident type families */
export type TypeFamilyDetails = (typeof typeFamilies)[number]

/** Codes for incident type families */
export type TypeFamily = TypeFamilyDetails['code']

/** Lookup for incident type families */
export function getTypeFamilyDetails(code: string): TypeFamilyDetails | null {
  return typeFamilies.find(item => item.code === code) ?? null
}
