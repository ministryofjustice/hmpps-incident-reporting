import { fromAgency, pecsRegions, type PecsRegion } from '../pecsRegions'
import { pecsNorth, pecsSouth } from './prisonApi'

export const pecsNorthRegion: PecsRegion = fromAgency(pecsNorth)
export const pecsSouthRegion: PecsRegion = fromAgency(pecsSouth)

export function mockPecsRegions() {
  pecsRegions.splice(0, pecsRegions.length, pecsNorthRegion, pecsSouthRegion)
}
