import type { Type } from './types'

/** Additional info to display  */
// eslint-disable-next-line import/prefer-default-export
export const typeHints: Partial<Record<Type, string>> = {
  ASSAULT_5: 'Includes fights and suspected assaults.',
  CLOSE_DOWN_SEARCH_1: 'Any finds must be reported using the Find type.',
  DISORDER_2: 'Includes barricade, concerted indiscipline, hostage, and incident at height.',
  DRONE_SIGHTING_3: 'Drones must have been seen by staff.',
  FIND_6: 'Items must be recovered, not just seen.',
  MISCELLANEOUS_1:
    'Includes dirty protest, failure of IT or telephony, large scale evacuation, late release or unlawful detention, loss of essential services, public demonstration, secondary exposure to airborne contaminants and any other incident not listed.',
  SELF_HARM_1:
    'Includes suspected and reported self-harm. Do not use to report a noose, unless it’s around the neck or applying pressure.',
  TOOL_LOSS_1: 'Do not use for radio and key or lock compromises. They are separate incident types.',
}
