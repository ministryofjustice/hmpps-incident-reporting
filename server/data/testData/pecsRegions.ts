import { fromAgency, pecsRegions, type PecsRegion } from '../pecsRegions'
import { pecsNou, pecsNorth, pecsSouth } from './prisonApi'

export const nouRegion: PecsRegion = fromAgency(pecsNou)
export const pecsNorthRegion: PecsRegion = fromAgency(pecsNorth)
export const pecsSouthRegion: PecsRegion = fromAgency(pecsSouth)

const backupPecsRegions: PecsRegion[] = []

export function mockPecsRegions(addNou: boolean = false) {
  backupPecsRegions.push(...pecsRegions)
  if (addNou) {
    pecsRegions.splice(0, pecsRegions.length, nouRegion, pecsNorthRegion, pecsSouthRegion)
  } else {
    pecsRegions.splice(0, pecsRegions.length, pecsNorthRegion, pecsSouthRegion)
  }
}

export function resetPecsRegions() {
  pecsRegions.splice(0, pecsRegions.length, ...backupPecsRegions)
}
