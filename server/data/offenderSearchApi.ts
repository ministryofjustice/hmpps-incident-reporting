import { asSystem, RestClient } from '@ministryofjustice/hmpps-rest-client'
import config from '../config'
import { TransferPrisonId, OutsidePrisonId, transferPrisonId, outsidePrisonId } from './constants'
import logger from '../../logger'

interface BaseOffenderSearchResult {
  prisonerNumber: string
  firstName: string
  lastName: string
  dateOfBirth: string
}

export interface OffenderSearchResultIn extends BaseOffenderSearchResult {
  prisonId: string
  prisonName: string
  cellLocation: string
}

export interface OffenderSearchResultTransfer extends BaseOffenderSearchResult {
  prisonId: TransferPrisonId
  prisonName: string
  locationDescription: string
}

export interface OffenderSearchResultOut extends BaseOffenderSearchResult {
  prisonId: OutsidePrisonId
  prisonName: string
  locationDescription: string
}

export type OffenderSearchResult = OffenderSearchResultIn | OffenderSearchResultTransfer | OffenderSearchResultOut

export function isBeingTransferred(prisoner: OffenderSearchResult): prisoner is OffenderSearchResultTransfer {
  return prisoner.prisonId === transferPrisonId
}

export function isOutside(prisoner: OffenderSearchResult): prisoner is OffenderSearchResultOut {
  return prisoner.prisonId === outsidePrisonId
}

export function isInPrison(prisoner: OffenderSearchResult): prisoner is OffenderSearchResultIn {
  return Boolean(!isBeingTransferred(prisoner) && !isOutside(prisoner) && prisoner.prisonId)
}

export type OffenderSearchResults = {
  content: OffenderSearchResult[]
  totalElements: number
}

export const sortOptions = ['lastName', 'firstName', 'prisonerNumber', 'cellLocation'] as const
export type Sort = (typeof sortOptions)[number]

export const orderOptions = ['ASC', 'DESC'] as const
export type Order = (typeof orderOptions)[number]

export class OffenderSearchApi extends RestClient {
  static readonly PAGE_SIZE = 20

  constructor(systemToken: string) {
    super('HMPPS Offender Search API', config.apis.offenderSearchApi, logger, {
      getToken: async () => systemToken,
    })
  }

  /**
   * Find a single person by prisoner number
   */
  getPrisoner(prisonerNumber: string): Promise<OffenderSearchResult> {
    return this.get<OffenderSearchResult>(
      {
        path: `/prisoner/${encodeURIComponent(prisonerNumber)}`,
      },
      asSystem(),
    )
  }

  /**
   * Find multiple people by prisoner number
   */
  async getPrisoners(prisonerNumbers: string[]): Promise<Record<string, OffenderSearchResult>> {
    const uniquePrisonerNumbers = [...new Set(prisonerNumbers)]
    if (uniquePrisonerNumbers.length === 0) {
      return {}
    }

    const prisoners = await this.post<OffenderSearchResult[]>(
      {
        path: '/prisoner-search/prisoner-numbers',
        data: {
          prisonerNumbers: uniquePrisonerNumbers,
        },
      },
      asSystem(),
    )

    // Returns the prisoners in an object for easy access
    return prisoners.reduce((prev, prisonerInfo) => ({ ...prev, [prisonerInfo.prisonerNumber]: prisonerInfo }), {})
  }

  /**
   * Search for people in a given prison using a search term (which works with names and prisoner numbers)
   */
  searchInPrison(
    prisonId: string,
    term: string,
    page: number = 0,
    sort: Sort = 'lastName',
    order: Order = 'ASC',
  ): Promise<OffenderSearchResults> {
    return this.get<OffenderSearchResults>(
      {
        path: `/prison/${encodeURIComponent(prisonId)}/prisoners`,
        query: {
          term,
          size: OffenderSearchApi.PAGE_SIZE,
          page,
          sort: `${sort},${order}`,
        },
      },
      asSystem(),
    )
  }

  /**
   * Search for people globally using a search term (which works with names and prisoner numbers)
   * NB: global search does not support sorting
   */
  searchGlobally(
    filters: {
      prisonerIdentifier?: string
      firstName?: string
      lastName?: string
      location?: 'ALL' | 'IN' | 'OUT'
      includeAliases?: boolean
    },
    page: number = 0,
  ): Promise<OffenderSearchResults> {
    if (!('location' in filters)) {
      // eslint-disable-next-line no-param-reassign
      filters.location = 'ALL'
    }
    if (!('includeAliases' in filters)) {
      // eslint-disable-next-line no-param-reassign
      filters.includeAliases = true
    }
    return this.post<OffenderSearchResults>(
      {
        path: '/global-search',
        query: {
          size: OffenderSearchApi.PAGE_SIZE,
          page: encodeURIComponent(page),
        },
        data: filters,
      },
      asSystem(),
    )
  }
}
