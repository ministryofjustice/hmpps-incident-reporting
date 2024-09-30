import type { Response as SuperAgentResponse, SuperAgentRequest } from 'superagent'

import { stubFor } from './wiremock'
import { OffenderSearchApi, type OffenderSearchResult } from '../../server/data/offenderSearchApi'
import { andrew, barry, chris, donald, ernie, fred } from '../../server/data/testData/offenderSearch'

export default {
  /**
   * Stub getting details for all mock prisoners
   */
  stubOffenderSearchMockPrisoners: (): Promise<SuperAgentResponse[]> =>
    Promise.all(
      [andrew, barry, chris, donald, ernie, fred].map(prisoner =>
        stubFor({
          request: {
            method: 'GET',
            urlPath: `/offenderSearchApi/prisoner/${encodeURIComponent(prisoner.prisonerNumber)}`,
          },
          response: {
            status: 200,
            headers: { 'Content-Type': 'application/json;charset=UTF-8' },
            jsonBody: prisoner,
          },
        }),
      ),
    ),

  /**
   * Stub searching for prisoner numbers
   */
  stubOffenderSearchByNumber: (prisoners: OffenderSearchResult[]): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'POST',
        urlPath: '/offenderSearchApi/prisoner-search/prisoner-numbers',
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: prisoners,
      },
    }),

  /**
   * Stub searching for a prisoner in a prison
   */
  stubOffenderSearchInPrison: ({
    prisonId,
    term,
    results,
    page = 0,
    totalElements = undefined,
  }: {
    prisonId: string
    term: string
    results: OffenderSearchResult[]
    page: number
    totalElements: number | undefined
  }): SuperAgentRequest => {
    const queryRegex = [`term=${encodeURIComponent(term)}`, `size=${OffenderSearchApi.PAGE_SIZE}`, `page=${page}`].join(
      '&',
    )
    return stubFor({
      request: {
        method: 'GET',
        urlPattern: `/offenderSearchApi/prison/${encodeURIComponent(prisonId)}/prisoners\\?.*${queryRegex}.*`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          content: results,
          totalElements: totalElements ?? results.length,
        },
      },
    })
  },

  /**
   * Stub searching for a prisoner globally
   * NB: this stub ignores filters so all searches would match
   */
  stubOffenderSearchGlobally: ({
    results,
    page = 0,
    totalElements = undefined,
  }: {
    results: OffenderSearchResult[]
    page: number
    totalElements: number | undefined
  }): SuperAgentRequest => {
    const queryRegex = [`size=${OffenderSearchApi.PAGE_SIZE}`, `page=${page}`].join('&')
    return stubFor({
      request: {
        method: 'POST',
        urlPattern: `/offenderSearchApi/global-search\\?.*${queryRegex}.*`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          content: results,
          totalElements: totalElements ?? results.length,
        },
      },
    })
  },

  stubOffenderSearchApiPing: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPath: '/offenderSearchApi/health/ping',
      },
      response: {
        status: 200,
      },
    }),
}
