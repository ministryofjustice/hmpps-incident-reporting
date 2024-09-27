import type { SuperAgentRequest } from 'superagent'

import { stubFor } from './wiremock'
import type { Prison } from '../../server/data/prisonApi'
import { leeds, moorland } from '../../server/data/testData/prisonApi'

export default {
  /**
   * Stub getting details for a prison
   */
  stubPrisonApiMockPrison: (prison: Prison): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPath: `/prisonApi/api/agencies/${prison.agencyId}`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: prison,
      },
    }),

  /**
   * Stub getting details for all mock prisons
   */
  stubPrisonApiMockPrisons: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPath: '/prisonApi/api/agencies/prisons',
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: [leeds, moorland],
      },
    }),

  stubPrisonApiPing: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPath: '/prisonApi/health/ping',
      },
      response: {
        status: 200,
      },
    }),
}
