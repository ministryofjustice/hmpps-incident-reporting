import { outsidePrisonId, transferPrisonId } from '../data/constants'
import type {
  OffenderSearchResult,
  OffenderSearchResultOut,
  OffenderSearchResultTransfer,
} from '../data/offenderSearchApi'

function isBeingTransferred(prisoner: OffenderSearchResult): prisoner is OffenderSearchResultTransfer {
  return prisoner.prisonId === transferPrisonId
}

function isOutside(prisoner: OffenderSearchResult): prisoner is OffenderSearchResultOut {
  return prisoner.prisonId === outsidePrisonId
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
