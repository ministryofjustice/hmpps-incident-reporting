import { fromAgency, type PecsRegion } from '../pecsRegions'
import { pecsNorth, pecsSouth } from './prisonApi'

export const pecsNorthRegion: PecsRegion = fromAgency(pecsNorth)
export const pecsSouthRegion: PecsRegion = fromAgency(pecsSouth)
