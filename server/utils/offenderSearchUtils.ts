import { outsidePrisonId, transferPrisonId } from '../data/constants'
import type {
  OffenderSearchResult,
  OffenderSearchResultIn,
  OffenderSearchResultOut,
  OffenderSearchResultTransfer,
} from '../data/offenderSearchApi'

export function isBeingTransferred(prisoner: OffenderSearchResult): prisoner is OffenderSearchResultTransfer {
  return prisoner.prisonId === transferPrisonId
}

export function isOutside(prisoner: OffenderSearchResult): prisoner is OffenderSearchResultOut {
  return prisoner.prisonId === outsidePrisonId
}

export function isInPrison(prisoner: OffenderSearchResult): prisoner is OffenderSearchResultIn {
  return !isBeingTransferred(prisoner) && !isOutside(prisoner) && Boolean(prisoner.prisonId)
}
