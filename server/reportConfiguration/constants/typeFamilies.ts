// Generated with ./scripts/importDpsConstants.ts at 2025-08-19T16:38:55.854Z

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
  { code: 'DIRTY_PROTEST', description: 'Dirty protest' },
  { code: 'DISORDER', description: 'Disorder' },
  { code: 'DRONE_SIGHTING', description: 'Drone sighting' },
  { code: 'DRUGS', description: 'Drugs' },
  { code: 'ESCAPE_FROM_PRISON', description: 'Escape from establishment' },
  { code: 'ESCAPE_FROM_ESCORT', description: 'Escape from escort' },
  { code: 'FIND', description: 'Find of illicit items' },
  { code: 'FIRE', description: 'Fire' },
  { code: 'FIREARM', description: 'Firearm, ammunition or chemical incapacitant' },
  { code: 'FOOD_REFUSAL', description: 'Food or liquid refusal' },
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
  { code: 'BC_DISRUPT_3RD_PTY', description: 'Disruption to 3rd party supplier - Business Continuity' },
  { code: 'BC_FUEL_SHORTAGE', description: 'Fuel Shortage - Business Continuity' },
  { code: 'BC_LOSS_ACCESS_EGRESS', description: 'Loss of Access / Egress  - Business Continuity' },
  {
    code: 'BC_LOSS_COMMS',
    description: 'Loss of Communications & Digital Systems - Business Continuity',
  },
  { code: 'BC_LOSS_UTILS', description: 'Loss of Utilities - Business Continuity' },
  { code: 'BC_SERV_WEATHER', description: 'Severe Weather - Business Continuity' },
  { code: 'BC_STAFF_SHORTAGES', description: 'Staff shortages  - Business Continuity' },
  { code: 'BC_WIDESPREAD_ILLNESS', description: 'Widespread illness - Business Continuity' },
] as const

/** Incident type families */
type TypeFamilyDetails = (typeof typeFamilies)[number]

/** Codes for incident type families */
export type TypeFamily = TypeFamilyDetails['code']

/** Code to description mapping for incident type families */
export const typeFamiliesDescriptions: Record<TypeFamily, string> = {
  ABSCOND: 'Abscond',
  ASSAULT: 'Assault',
  ATTEMPTED_ESCAPE_FROM_PRISON: 'Attempted escape from establishment',
  ATTEMPTED_ESCAPE_FROM_ESCORT: 'Attempted escape from escort',
  BARRICADE: 'Barricade',
  BOMB: 'Bomb explosion or threat',
  BREACH_OF_SECURITY: 'Breach or attempted breach of security',
  CLOSE_DOWN_SEARCH: 'Close down search',
  CONCERTED_INDISCIPLINE: 'Incident involving 2 or more prisoners acting together',
  DAMAGE: 'Deliberate damage',
  DEATH_PRISONER: 'Death of prisoner',
  DEATH_OTHER: 'Death of other person',
  DIRTY_PROTEST: 'Dirty protest',
  DISORDER: 'Disorder',
  DRONE_SIGHTING: 'Drone sighting',
  DRUGS: 'Drugs',
  ESCAPE_FROM_PRISON: 'Escape from establishment',
  ESCAPE_FROM_ESCORT: 'Escape from escort',
  FIND: 'Find of illicit items',
  FIRE: 'Fire',
  FIREARM: 'Firearm, ammunition or chemical incapacitant',
  FOOD_REFUSAL: 'Food or liquid refusal',
  HOSTAGE: 'Hostage incident',
  INCIDENT_AT_HEIGHT: 'Incident at height',
  KEY_OR_LOCK: 'Key or lock compromise',
  MISCELLANEOUS: 'Miscellaneous',
  MOBILE_PHONE: 'Mobile phone',
  RADIO_COMPROMISE: 'Radio compromise',
  RELEASE_IN_ERROR: 'Release in error',
  SELF_HARM: 'Self harm',
  TEMPORARY_RELEASE_FAILURE: 'Temporary release failure',
  TOOL_LOSS: 'Tool or implement loss',
  BC_DISRUPT_3RD_PTY: 'Disruption to 3rd party supplier - Business Continuity',
  BC_FUEL_SHORTAGE: 'Fuel Shortage - Business Continuity',
  BC_LOSS_ACCESS_EGRESS: 'Loss of Access / Egress  - Business Continuity',
  BC_LOSS_COMMS: 'Loss of Communications & Digital Systems - Business Continuity',
  BC_LOSS_UTILS: 'Loss of Utilities - Business Continuity',
  BC_SERV_WEATHER: 'Severe Weather - Business Continuity',
  BC_STAFF_SHORTAGES: 'Staff shortages  - Business Continuity',
  BC_WIDESPREAD_ILLNESS: 'Widespread illness - Business Continuity',
}

/** Lookup for incident type families */
export function getTypeFamilyDetails(code: string): TypeFamilyDetails | null {
  return typeFamilies.find(item => item.code === code) ?? null
}
