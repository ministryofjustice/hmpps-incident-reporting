import { asSystem, RestClient } from '@ministryofjustice/hmpps-rest-client'
import config from '../config'
import { TransferPrisonId, OutsidePrisonId } from './constants'
import logger from '../../logger'

interface BaseOffenderSearchResult {
  prisonerNumber: string
  firstName: string
  lastName: string
  dateOfBirth: Date
}

type BaseOffenderSearchResultApi = Omit<BaseOffenderSearchResult, 'dateOfBirth'> & {
  dateOfBirth: string
}

export interface OffenderSearchResultIn extends BaseOffenderSearchResult {
  prisonId: string
  prisonName: string
  cellLocation: string
}

type OffenderSearchResultInApi = Omit<OffenderSearchResultIn, 'dateOfBirth'> & BaseOffenderSearchResultApi

export interface OffenderSearchResultTransfer extends BaseOffenderSearchResult {
  prisonId: TransferPrisonId
  prisonName: string
  locationDescription: string
}

type OffenderSearchResultTransferApi = Omit<OffenderSearchResultTransfer, 'dateOfBirth'> & BaseOffenderSearchResultApi

export interface OffenderSearchResultOut extends BaseOffenderSearchResult {
  prisonId: OutsidePrisonId
  prisonName: string
  locationDescription: string
}

type OffenderSearchResultOutApi = Omit<OffenderSearchResultOut, 'dateOfBirth'> & BaseOffenderSearchResultApi

export type OffenderSearchResult = OffenderSearchResultIn | OffenderSearchResultTransfer | OffenderSearchResultOut
type OffenderSearchResultApi = OffenderSearchResultInApi | OffenderSearchResultTransferApi | OffenderSearchResultOutApi

const ISO_DATE_ONLY_REGEX = /^\s*(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})\s*$/

function invalidIsoDate(input: string): Error {
  return new Error(`Invalid ISO date: ${input}`)
}

function parseIsoDateOnlyToLocalNoon(input: string): Date {
  const trimmed = input.trim()

  // Accept full ISO datetime strings by extracting the YYYY-MM-DD prefix.
  // Example: 1975-01-01T00:00:00.000Z -> 1975-01-01
  const dateOnly = trimmed.includes('T') ? trimmed.slice(0, 10) : trimmed

  const match = ISO_DATE_ONLY_REGEX.exec(dateOnly)
  if (!match?.groups) throw invalidIsoDate(input)

  const y = Number.parseInt(match.groups.year, 10)
  const m = Number.parseInt(match.groups.month, 10)
  const d = Number.parseInt(match.groups.day, 10)

  // Noon local time avoids DST / timezone edge cases when later formatting in Europe/London
  const date = new Date(y, m - 1, d, 12, 0, 0, 0)

  if (Number.isNaN(date.getTime()) || date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) {
    throw invalidIsoDate(input)
  }

  return date
}

function mapOffenderFromApi(offender: OffenderSearchResultApi): OffenderSearchResult {
  return {
    ...offender,
    dateOfBirth: parseIsoDateOnlyToLocalNoon(offender.dateOfBirth),
  }
}

export type OffenderSearchResults = {
  content: OffenderSearchResult[]
  totalElements: number
}

type OffenderSearchResultsApi = {
  content: OffenderSearchResultApi[]
  totalElements: number
}

export const sortOptions = ['lastName', 'firstName', 'prisonerNumber', 'cellLocation'] as const
export type Sort = (typeof sortOptions)[number]

export const orderOptions = ['ASC', 'DESC'] as const
export type Order = (typeof orderOptions)[number]

export type PrisonerGender = 'ALL' | 'M' | 'F' | 'NK' | 'NS'
export type PrisonerLocationStatus = 'ALL' | 'IN' | 'OUT'

type GlobalSearchFilters = {
  andWords?: string
  fuzzyMatch: boolean
  prisonIds: string[]
  gender?: PrisonerGender
  location?: PrisonerLocationStatus
  dateOfBirth?: string
  pagination?: {
    size: number
    page: number
  }
}

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
  async getPrisoner(prisonerNumber: string): Promise<OffenderSearchResult> {
    const prisoner = await this.get<OffenderSearchResultApi>(
      {
        path: `/prisoner/${encodeURIComponent(prisonerNumber)}`,
      },
      asSystem(),
    )
    return mapOffenderFromApi(prisoner)
  }

  /**
   * Find multiple people by prisoner number
   */
  async getPrisoners(prisonerNumbers: string[]): Promise<Record<string, OffenderSearchResult>> {
    const uniquePrisonerNumbers = [...new Set(prisonerNumbers)]
    if (uniquePrisonerNumbers.length === 0) {
      return {}
    }

    const prisoners = await this.post<OffenderSearchResultApi[]>(
      {
        path: '/prisoner-search/prisoner-numbers',
        data: {
          prisonerNumbers: uniquePrisonerNumbers,
        },
      },
      asSystem(),
    )

    const mapped = prisoners.map(mapOffenderFromApi)

    // Returns the prisoners in an object for easy access
    return Object.fromEntries(mapped.map(p => [p.prisonerNumber, p]))
  }

  /**
   * Search for people globally using a search term (which works with names and prisoner numbers)
   * NB: global search does not support sorting
   */
  async searchGlobally(filters: GlobalSearchFilters, page: number = 0): Promise<OffenderSearchResults> {
    const requestData = {
      ...filters,
      pagination: { size: OffenderSearchApi.PAGE_SIZE, page },
    }

    const results = await this.post<OffenderSearchResultsApi>(
      {
        path: '/keyword',
        data: requestData,
      },
      asSystem(),
    )

    return {
      ...results,
      content: results.content.map(mapOffenderFromApi),
    }
  }
}
