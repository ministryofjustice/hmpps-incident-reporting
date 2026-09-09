import { getTypeDetails, type Type } from './types'
import { type TypeFamily } from './typeFamilies'

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
  CONCERTED_INDISCIPLINE: 'incident involving 2 or more prisoners acting together',
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
  SELF_HARM: 'self-harm',
  TEMPORARY_RELEASE_FAILURE: 'temporary release failure',
  TOOL_LOSS: 'tool or equipment loss',
  UNLAWFUL_DETENTION: 'unlawful detention',
}

export function aboutTheType(typeOrFamily: Type | TypeFamily): string {
  let familyCode: string | undefined = typeOrFamily
  if (/\d$/.test(typeOrFamily)) {
    // type code
    familyCode = getTypeDetails(typeOrFamily)?.familyCode
  }
  const title: string = (familyCode && shortTypeTitles[familyCode as TypeFamily]) || 'incident'
  return `About the ${title}`
}
