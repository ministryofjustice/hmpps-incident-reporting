import { TypeFamily } from './typeFamilies'

export type TypeDetails = {
  familyCode: TypeFamily
  description: string
  active: boolean
  nomisCode: string
  hint?: string
  activeTo?: string
  activeFrom?: string
}

function makeTypedDetails<const Input extends Record<string, TypeDetails>>(
  input: Input,
): { [Key in keyof Input]: TypeDetails } {
  return input
}

/**
 * Date-based activation windows for incident types.
 *
 * Source of truth for *when* a type is active, layered on top of the generated `active`
 * boolean in `./types`. Kept in this hand-maintained file (rather than the generated registry)
 * so the dates survive regeneration of the constants from the API.
 *
 * A type is only ever active when its registry boolean is `true` AND now falls within its
 * window (see {@link isTypeActive}). Windows therefore can only *retire* or *delay* a type;
 * a recorded `activeTo` on an already-inactive (boolean `false`) type is metadata only and
 * never reactivates it — important because some retired NOMIS types carry recent/future end
 * dates that are not monotonic by version number.
 */

/** Types of reportable incidents */
export const types = makeTypedDetails({
  ABSCOND_1: { familyCode: 'ABSCOND', description: 'Abscond', active: true, nomisCode: 'ABSCOND' },
  ASSAULT_1: {
    familyCode: 'ASSAULT',
    description: 'Assault',
    active: false,
    nomisCode: 'ASSAULT',
    activeTo: '2017-04-13',
  },
  ASSAULT_2: {
    familyCode: 'ASSAULT',
    description: 'Assault',
    active: false,
    nomisCode: 'ASSAULTS',
    activeTo: '2017-04-13',
  },
  ASSAULT_3: {
    familyCode: 'ASSAULT',
    description: 'Assault',
    active: false,
    nomisCode: 'ASSAULTS1',
    activeTo: '2017-04-13',
  },
  ASSAULT_4: {
    familyCode: 'ASSAULT',
    description: 'Assault',
    active: false,
    nomisCode: 'ASSAULTS2',
    activeTo: '2017-04-27',
  },
  ASSAULT_5: {
    familyCode: 'ASSAULT',
    description: 'Assault',
    active: true,
    nomisCode: 'ASSAULTS3',
    hint: 'Includes fights and suspected assaults.',
  },
  ATTEMPTED_ESCAPE_FROM_PRISON_1: {
    familyCode: 'ATTEMPTED_ESCAPE_FROM_PRISON',
    description: 'Attempted escape from establishment',
    active: true,
    nomisCode: 'ATT_ESCAPE',
  },
  ATTEMPTED_ESCAPE_FROM_ESCORT_1: {
    familyCode: 'ATTEMPTED_ESCAPE_FROM_ESCORT',
    description: 'Attempted escape from escort',
    active: true,
    nomisCode: 'ATT_ESC_E',
  },
  BARRICADE_1: {
    familyCode: 'BARRICADE',
    description: 'Barricade',
    active: false,
    nomisCode: 'BARRICADE',
    activeTo: '2015-01-10',
  },
  BOMB_1: { familyCode: 'BOMB', description: 'Bomb explosion or threat', active: true, nomisCode: 'BOMB' },
  BREACH_OF_SECURITY_1: {
    familyCode: 'BREACH_OF_SECURITY',
    description: 'Breach or attempted breach of security',
    active: true,
    nomisCode: 'BREACH',
    hint: 'A person who breaches, or who attempts to breach, the secure perimeter of the establishment.',
  },
  BC_DISRUPT_3RD_PTY_1: {
    familyCode: 'BC_DISRUPT_3RD_PTY',
    description: 'Business Continuity - Disruption to 3rd party supplier',
    active: true,
    nomisCode: 'DIS_3RD_PTY',
  },
  BC_FUEL_SHORTAGE_1: {
    familyCode: 'BC_FUEL_SHORTAGE',
    description: 'Business Continuity - Fuel shortage',
    active: true,
    nomisCode: 'FUELSHORTAGE',
  },
  BC_LOSS_ACCESS_EGRESS_1: {
    familyCode: 'BC_LOSS_ACCESS_EGRESS',
    description: 'Business Continuity - Loss of access / egress',
    active: true,
    nomisCode: 'LOSS_EGRESS',
  },
  BC_LOSS_COMMS_1: {
    familyCode: 'BC_LOSS_COMMS',
    description: 'Business Continuity - Loss of communications & digital systems',
    active: true,
    nomisCode: 'LOSS_COMMS',
  },
  BC_LOSS_UTILS_1: {
    familyCode: 'BC_LOSS_UTILS',
    description: 'Business Continuity - Loss of utilities',
    active: true,
    nomisCode: 'LOSS_UTILS',
  },
  BC_SERV_WEATHER_1: {
    familyCode: 'BC_SERV_WEATHER',
    description: 'Business Continuity - Severe weather',
    active: true,
    nomisCode: 'SERV_WEATHER',
  },
  BC_STAFF_SHORTAGES_1: {
    familyCode: 'BC_STAFF_SHORTAGES',
    description: 'Business Continuity - Staff shortages',
    active: true,
    nomisCode: 'STF_SHORTAGE',
  },
  BC_WIDESPREAD_ILLNESS_1: {
    familyCode: 'BC_WIDESPREAD_ILLNESS',
    description: 'Business Continuity - Widespread illness',
    active: true,
    nomisCode: 'WSPR_ILLNESS',
  },
  CLOSE_DOWN_SEARCH_1: {
    familyCode: 'CLOSE_DOWN_SEARCH',
    description: 'Close down search',
    active: true,
    nomisCode: 'CLOSE_DOWN',
    hint: 'Any finds must be reported using the Find type.',
    // Close down search is decommissioned (no replacement) from 1 July 2026.
    activeTo: '2026-07-01',
  },
  CONCERTED_INDISCIPLINE_1: {
    familyCode: 'CONCERTED_INDISCIPLINE',
    description: 'Incident involving 2 or more prisioners acting together',
    active: false,
    nomisCode: 'CON_INDISC',
    activeTo: '2015-01-10',
  },
  DAMAGE_1: {
    familyCode: 'DAMAGE',
    description: 'Deliberate damage',
    active: false,
    nomisCode: 'DAMAGE',
    activeTo: '2024-11-11',
  },
  DEATH_PRISONER_1: {
    familyCode: 'DEATH_PRISONER',
    description: 'Death of prisoner',
    active: true,
    nomisCode: 'DEATH',
  },
  DEATH_OTHER_1: {
    familyCode: 'DEATH_OTHER',
    description: 'Death of other person',
    active: true,
    nomisCode: 'DEATH_NI',
  },
  DIRTY_PROTEST_1: {
    familyCode: 'DIRTY_PROTEST',
    description: 'Dirty protest',
    active: true,
    nomisCode: 'DIRTYPROTEST',
    hint: 'Deliberately defecating or urinating without a toilet or, throwing or smearing urine and/or faeces. An ongoing dirty protest is one incident.',
  },
  DISORDER_1: {
    familyCode: 'DISORDER',
    description: 'Disorder',
    active: false,
    nomisCode: 'DISORDER',
    activeTo: '2018-04-23',
  },
  DISORDER_2: {
    familyCode: 'DISORDER',
    description: 'Disorder',
    active: true,
    nomisCode: 'DISORDER1',
    hint: 'Includes barricade, concerted indiscipline, hostage, and incident at height.',
  },
  DRONE_SIGHTING_1: {
    familyCode: 'DRONE_SIGHTING',
    description: 'Drone sighting',
    active: false,
    nomisCode: 'DRONE',
    activeTo: '2017-01-04',
  },
  DRONE_SIGHTING_2: {
    familyCode: 'DRONE_SIGHTING',
    description: 'Drone sighting',
    active: false,
    nomisCode: 'DRONE1',
    activeTo: '2024-09-09',
  },
  DRONE_SIGHTING_3: {
    familyCode: 'DRONE_SIGHTING',
    description: 'Drone sighting',
    active: true,
    nomisCode: 'DRONE2',
    hint: 'Drones must have been seen by staff.',
  },
  DRUGS_1: {
    familyCode: 'DRUGS',
    description: 'Drugs',
    active: false,
    nomisCode: 'DRUGS',
    activeTo: '2015-01-10',
  },
  ESCAPE_FROM_PRISON_1: {
    familyCode: 'ESCAPE_FROM_PRISON',
    description: 'Escape from establishment',
    active: true,
    nomisCode: 'ESCAPE_EST',
  },
  ESCAPE_FROM_ESCORT_1: {
    familyCode: 'ESCAPE_FROM_ESCORT',
    description: 'Escape from escort',
    active: true,
    nomisCode: 'ESCAPE_ESC',
  },
  FIND_1: {
    familyCode: 'FIND',
    description: 'Find of illicit items',
    active: false,
    nomisCode: 'FINDS',
    activeTo: '2015-09-17',
  },
  FIND_2: {
    familyCode: 'FIND',
    description: 'Find of illicit items',
    active: false,
    nomisCode: 'FIND',
    activeTo: '2025-01-10',
  },
  FIND_3: {
    familyCode: 'FIND',
    description: 'Find of illicit items',
    active: false,
    nomisCode: 'FIND1',
    activeTo: '2025-01-04',
  },
  FIND_4: {
    familyCode: 'FIND',
    description: 'Find of illicit items',
    active: false,
    nomisCode: 'FIND0322',
    activeTo: '2022-03-29',
  },
  FIND_5: {
    familyCode: 'FIND',
    description: 'Find of illicit items',
    active: false,
    nomisCode: 'FINDS1',
    activeTo: '2022-04-20',
  },
  FIND_6: {
    familyCode: 'FIND',
    description: 'Find of illicit items',
    active: true,
    nomisCode: 'FIND0422',
    hint: 'Items must be recovered, not just seen.',
  },
  FIRE_1: { familyCode: 'FIRE', description: 'Fire', active: true, nomisCode: 'FIRE' },
  FIREARM_1: {
    familyCode: 'FIREARM',
    description: 'Firearm, ammunition or chemical incapacitant',
    active: false,
    nomisCode: 'FIREARM_ETC',
    activeTo: '2015-01-10',
  },
  FOOD_REFUSAL_1: {
    familyCode: 'FOOD_REFUSAL',
    description: 'Food or liquid refusal',
    active: true,
    nomisCode: 'FOOD_REF',
    // Family switch-over for 1 July 2026: Food refusal v1 retires as v2 begins.
    activeTo: '2026-07-01',
  },
  FOOD_REFUSAL_2: {
    familyCode: 'FOOD_REFUSAL',
    description: 'Food or liquid refusal',
    active: true,
    nomisCode: 'FOOD_REF2',
    activeFrom: '2026-07-01',
  },
  HOSTAGE_1: {
    familyCode: 'HOSTAGE',
    description: 'Hostage incident',
    active: false,
    nomisCode: 'HOSTAGE',
    activeTo: '2015-01-10',
  },
  INCIDENT_AT_HEIGHT_1: {
    familyCode: 'INCIDENT_AT_HEIGHT',
    description: 'Incident at height',
    active: false,
    nomisCode: 'ROOF_CLIMB',
    activeTo: '2015-01-10',
  },
  KEY_OR_LOCK_1: {
    familyCode: 'KEY_OR_LOCK',
    description: 'Key or lock compromise',
    active: false,
    nomisCode: 'KEY_LOCK',
    activeTo: '2013-08-03',
  },
  KEY_OR_LOCK_2: {
    familyCode: 'KEY_OR_LOCK',
    description: 'Key or lock compromise',
    active: true,
    nomisCode: 'KEY_LOCKNEW',
    // Key or lock switch-over for 1 August 2026: Key or lock v2 retires as v3 begins.
    activeTo: '2026-08-01',
  },
  KEY_OR_LOCK_3: {
    familyCode: 'KEY_OR_LOCK',
    description: 'Key or lock compromise',
    active: true,
    nomisCode: 'KEY_LOCK3',
    activeFrom: '2026-08-01',
  },
  MISCELLANEOUS_1: {
    familyCode: 'MISCELLANEOUS',
    description: 'Miscellaneous',
    active: true,
    nomisCode: 'MISC',
    hint: 'Includes any other incident type not listed.',
  },
  MOBILE_PHONE_1: {
    familyCode: 'MOBILE_PHONE',
    description: 'Mobile phone',
    active: false,
    nomisCode: 'MOBILES',
    activeTo: '2015-01-10',
  },
  RADIO_COMPROMISE_1: {
    familyCode: 'RADIO_COMPROMISE',
    description: 'Radio compromise',
    active: false,
    nomisCode: 'RADIO_COMP',
    activeTo: '2026-02-03',
  },
  RELEASE_IN_ERROR_1: {
    familyCode: 'RELEASE_IN_ERROR',
    description: 'Release in error',
    active: true,
    nomisCode: 'REL_ERROR',
    hint: 'A person released from HMPPS custody earlier than intended.',
  },
  SELF_HARM_1: {
    familyCode: 'SELF_HARM',
    description: 'Self-harm',
    active: true,
    nomisCode: 'SELF_HARM',
    hint: 'Includes suspected and reported self-harm. Do not use to report a noose, unless it’s around the neck or applying pressure.',
  },
  TEMPORARY_RELEASE_FAILURE_1: {
    familyCode: 'TEMPORARY_RELEASE_FAILURE',
    description: 'Temporary release failure',
    active: false,
    nomisCode: 'TRF',
    activeTo: '2017-01-04',
  },
  TEMPORARY_RELEASE_FAILURE_2: {
    familyCode: 'TEMPORARY_RELEASE_FAILURE',
    description: 'Temporary release failure',
    active: false,
    nomisCode: 'TRF1',
    activeTo: '2017-01-04',
  },
  TEMPORARY_RELEASE_FAILURE_3: {
    familyCode: 'TEMPORARY_RELEASE_FAILURE',
    description: 'Temporary release failure',
    active: false,
    nomisCode: 'TRF2',
    activeTo: '2017-03-16',
  },
  TEMPORARY_RELEASE_FAILURE_4: {
    familyCode: 'TEMPORARY_RELEASE_FAILURE',
    description: 'Temporary release failure',
    active: true,
    nomisCode: 'TRF3',
  },
  TOOL_LOSS_1: {
    familyCode: 'TOOL_LOSS',
    description: 'Tool or equipment loss',
    active: true,
    nomisCode: 'TOOL_LOSS',
    hint: 'Do not use for key or lock compromises. They are separate incident types.',
    // Tool loss switch-over for 1 August 2026: Tool loss v1 retires as v2 begins.
    activeTo: '2026-08-01',
  },
  TOOL_LOSS_2: {
    familyCode: 'TOOL_LOSS',
    description: 'Tool or equipment loss',
    active: true,
    nomisCode: 'TOOL_LOSS2',
    hint: 'Do not use for key or lock compromises. They are separate incident types.',
    activeFrom: '2026-08-01',
  },
  UNLAWFUL_DETENTION_1: {
    familyCode: 'UNLAWFUL_DETENTION',
    description: 'Unlawful detention',
    active: true,
    nomisCode: 'UNLAW_DET',
    hint: 'A person released from HMPPS custody later than intended.',
  },
})

/** Codes for types of reportable incidents */
export type Type = keyof typeof types

/** Code to description mapping for types of reportable incidents */
export const typesDescriptions: Record<Type, string> = Object.fromEntries(
  Object.entries(types).map(([typeCode, details]) => [typeCode, details.description]),
) as Record<Type, string>

/**
 * NOMIS codes for Types of reportable incidents
 * @deprecated
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const nomisCodes = Object.values(types).map(type => type.nomisCode)
export type NomisType = (typeof nomisCodes)[number]

/** Lookup for types of reportable incidents */
export function getTypeDetails(code: Type): TypeDetails | null {
  return types[code] ?? null
}
