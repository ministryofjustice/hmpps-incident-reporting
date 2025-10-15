import { fromAgency, pecsRegions, type PecsRegion } from '../pecsRegions'
import { pecsNou, pecsNorth, pecsSouth } from './prisonApi'

export const nouRegion: PecsRegion = fromAgency(pecsNou)
export const pecsNorthRegion: PecsRegion = fromAgency(pecsNorth)
export const pecsSouthRegion: PecsRegion = fromAgency(pecsSouth)

const backupPecsRegions: PecsRegion[] = []

export function mockPecsRegions() {
  backupPecsRegions.push(...pecsRegions)
  pecsRegions.splice(0, pecsRegions.length, nouRegion, pecsNorthRegion, pecsSouthRegion)
}

export function resetPecsRegions() {
  pecsRegions.splice(0, pecsRegions.length, ...backupPecsRegions)
}
