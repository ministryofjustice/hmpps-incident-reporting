import { getTypeDetails, type Type } from './types'
import type { TypeFamily } from './typeFamilies'

/**
 * Additional info to display when users select an incident *type* for a report (not *family*)
 */
export const typeHints: Partial<Record<Type, string>> = {
  ASSAULT_5: 'Includes fights and suspected assaults.',
  CLOSE_DOWN_SEARCH_1: 'Any finds must be reported using the Find type.',
  DISORDER_2: 'Includes barricade, concerted indiscipline, hostage, and incident at height.',
  DRONE_SIGHTING_3: 'Drones must have been seen by staff.',
  DIRTY_PROTEST_1:
    'Deliberately defecating or urinating without a toilet or, throwing or smearing urine and/or faeces. An ongoing dirty protest is one incident.',
  FIND_6: 'Items must be recovered, not just seen.',
  MISCELLANEOUS_1:
    'Includes failure of IT or telephony, large scale evacuation, late release or unlawful detention, loss of essential services, public demonstration, secondary exposure to airborne contaminants and any other incident not listed.',
  SELF_HARM_1:
    'Includes suspected and reported self-harm. Do not use to report a noose, unless it’s around the neck or applying pressure.',
  TOOL_LOSS_1: 'Do not use for radio and key or lock compromises. They are separate incident types.',
}

/**
 * Short titles displayed when generating titles in the form “About the incident”, eg. “About the assault”.
 * A *family* of types shares one title.
 */
const shortTypeTitles: Partial<Record<TypeFamily, string>> = {
  ABSCOND: 'abscond',
  ASSAULT: 'assault',
  ATTEMPTED_ESCAPE_FROM_ESCORT: 'attempted escape from escort',
  ATTEMPTED_ESCAPE_FROM_PRISON: 'attempted escape from establishment',
  BC_DISRUPT_3RD_PTY: 'disruption to 3rd party supplier',
  BC_FUEL_SHORTAGE: 'fuel shortage',
  BC_LOSS_ACCESS_EGRESS: 'loss of access / egress',
  BC_LOSS_COMMS: 'loss of communications',
  BC_LOSS_UTILS: 'loss of utilities',
  BC_SERV_WEATHER: 'severe weather',
  BC_STAFF_SHORTAGES: 'staff shortages',
  BC_WIDESPREAD_ILLNESS: 'widespread illness',
  BOMB: 'bomb explosion or threat',
  BREACH_OF_SECURITY: 'breach or attempted breach of security',
  CLOSE_DOWN_SEARCH: 'close down search',
  CONCERTED_INDISCIPLINE: 'incident involving 2 or more prisioners acting together',
  DAMAGE: 'deliberate damage',
  DEATH_OTHER: 'death of other person',
  DEATH_PRISONER: 'death of a prisoner',
  DIRTY_PROTEST: 'dirty protest',
  DISORDER: 'disorder',
  DRONE_SIGHTING: 'drone sighting',
  DRUGS: 'drugs',
  ESCAPE_FROM_ESCORT: 'escape from escort',
  ESCAPE_FROM_PRISON: 'escape from establishment',
  FIND: 'find of illicit items',
  FIRE: 'fire',
  FIREARM: 'firearm, ammunition or chemical incapacitant',
  FOOD_REFUSAL: 'food or liquid refusal',
  HOSTAGE: 'hostage incident',
  INCIDENT_AT_HEIGHT: 'incident at height',
  KEY_OR_LOCK: 'key or lock compromise',
  MOBILE_PHONE: 'mobile phone incident',
  RADIO_COMPROMISE: 'radio compromise',
  RELEASE_IN_ERROR: 'release in error',
  SELF_HARM: 'self harm',
  TEMPORARY_RELEASE_FAILURE: 'temporary release failure',
  TOOL_LOSS: 'tool or implement loss',
}

export function aboutTheType(typeOrFamily: Type | TypeFamily): string {
  let familyCode: string = typeOrFamily
  if (/\d$/.test(typeOrFamily)) {
    // type code
    familyCode = getTypeDetails(typeOrFamily).familyCode
  }
  const title: string = (familyCode && shortTypeTitles[familyCode as TypeFamily]) || 'incident'
  return `About the ${title}`
}
