import type { Type } from './types'

// TODO: this list is provisional and incomplete

/** Additional info to display  */
// eslint-disable-next-line import/prefer-default-export
export const typeHints: Partial<Record<Type, string>> = {
  ASSAULT_5: 'Includes fights and suspected assaults.',
  DISORDER_2: 'Includes barricade, concerted indiscipline, hostage, and incident at height.',
  CLOSE_DOWN_SEARCH_1: 'Any finds must be reported using the Find type.',
  MISCELLANEOUS_1:
    'Includes dirty protest, failure of IT or telephony, large scale evacuation, late release or unlawful detention, loss of essential services, public demonstration, secondary exposure to airborne contaminants and any other incident not listed.',
}
