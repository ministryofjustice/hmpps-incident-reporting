import { outsidePrisonId, transferPrisonId } from '../constants'
import type {
  OffenderSearchResult,
  OffenderSearchResultIn,
  OffenderSearchResultOut,
  OffenderSearchResultTransfer,
} from '../offenderSearchApi'
import { leeds, moorland } from './prisonApi'

/** A1111AA in Moorland */
export const andrew: OffenderSearchResultIn = {
  prisonerNumber: 'A1111AA',
  firstName: 'ANDREW',
  lastName: 'ARNOLD',
  prisonId: moorland.agencyId,
  prisonName: moorland.description,
  cellLocation: '1-1-001',
}

/** A2222BB in Moorland */
export const barry: OffenderSearchResultIn = {
  prisonerNumber: 'A2222BB',
  firstName: 'BARRY',
  lastName: 'BENJAMIN',
  prisonId: moorland.agencyId,
  prisonName: moorland.description,
  cellLocation: '1-1-002',
}

/** A3333CC in Leeds */
export const chris: OffenderSearchResultIn = {
  prisonerNumber: 'A3333CC',
  firstName: 'CHRIS',
  lastName: 'COOPER',
  prisonId: leeds.agencyId,
  prisonName: leeds.description,
  cellLocation: '2-A-021',
}

/** A4444DD in transfer */
export const donald: OffenderSearchResultTransfer = {
  prisonerNumber: 'A4444DD',
  firstName: 'DONALD',
  lastName: 'DAVIDSON',
  prisonId: transferPrisonId,
  prisonName: 'Transfer',
  locationDescription: 'Transfer',
}

/** A5555EE outside */
export const ernie: OffenderSearchResultOut = {
  prisonerNumber: 'A5555EE',
  firstName: 'ERNIE',
  lastName: 'EAST',
  prisonId: outsidePrisonId,
  prisonName: 'Outside',
  locationDescription: 'Outside - released from Moorland (HMP)',
}

/** A6666FF in unknown location */
export const fred: OffenderSearchResult = {
  prisonerNumber: 'A6666FF',
  firstName: 'FRED',
  lastName: 'FOGG',
  prisonId: undefined,
  prisonName: undefined,
  cellLocation: undefined,
}
