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

/**
 * Display location of a prisoner in prison, during transfer and outside/released
 */
export function prisonerLocation(prisoner: OffenderSearchResult): string {
  if (isBeingTransferred(prisoner)) {
    return 'N/A'
  }
  if (isOutside(prisoner)) {
    return prisoner.locationDescription || 'Outside'
  }
  return prisoner.prisonName || 'Not known'
}
