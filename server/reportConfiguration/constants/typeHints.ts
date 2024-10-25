import type { Type } from './types'

// TODO: this list is provisional and incomplete

/** Additional info to display  */
// eslint-disable-next-line import/prefer-default-export
export const typeHints: Partial<Record<Type, string>> = {
  ASSAULT: 'Includes fights and suspected assaults.',
  DISORDER: 'Includes barricade, concerted indiscipline, hostage, and incident at height.',
  FULL_CLOSE_DOWN_SEARCH: 'Any finds must be reported using the Find type.',
  MISCELLANEOUS:
    'Includes dirty protest, failure of IT or telephony, large scale evacuation, late release or unlawful detention, loss of essential services, public demonstration, secondary exposure to airborne contaminants and any other incident not listed.',
}
