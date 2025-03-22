import { fromAgency, pecsRegions, type PecsRegion } from '../pecsRegions'
import { pecsNorth, pecsSouth } from './prisonApi'

export const pecsNorthRegion: PecsRegion = fromAgency(pecsNorth)
export const pecsSouthRegion: PecsRegion = fromAgency(pecsSouth)

const backupPecsRegions: PecsRegion[] = []

export function mockPecsRegions() {
  backupPecsRegions.push(...pecsRegions)
  pecsRegions.splice(0, pecsRegions.length, pecsNorthRegion, pecsSouthRegion)
}

export function resetPecsRegions() {
  pecsRegions.splice(0, pecsRegions.length, ...backupPecsRegions)
}
