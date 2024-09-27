import type { Response, SuperAgentRequest } from 'superagent'

import { stubFor } from './wiremock'
import type { OffenderSearchResult } from '../../server/data/offenderSearchApi'
import { andrew, barry, chris } from '../../server/data/testData/offenderSearch'

export default {
  /**
   * Stub getting details for all mock prisoners
   */
  stubOffenderSearchMockPrisoners: (): Promise<Response[]> =>
    Promise.all(
      [andrew, barry, chris].map(prisoner =>
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
   * Stub searching for pisoner numbers
   */
  stubOffenderSearchByNumber: (prisoners: OffenderSearchResult[]) =>
    stubFor({
      request: {
        method: 'POST',
        urlPath: '/prisoner-search/prisoner-numbers',
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: prisoners,
      },
    }),

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
