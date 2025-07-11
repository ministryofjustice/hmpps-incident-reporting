import type { Response as SuperAgentResponse, SuperAgentRequest } from 'superagent'

import { stubFor } from './wiremock'
import type { Agency } from '../../server/data/prisonApi'
import { leeds, moorland, pecsNorth, pecsSouth, staffBarry, staffMary } from '../../server/data/testData/prisonApi'

export default {
  /**
   * Stub getting details for a prison
   */
  stubPrisonApiMockPrison: (prison: Agency): SuperAgentRequest =>
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

  /**
   * Stub getting details for all mock prisons
   */
  stubPrisonApiMockPecsRegions: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPath: '/prisonApi/api/agencies/type/PECS',
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: [pecsNorth, pecsSouth],
      },
    }),

  /**
   * Stub endpoint to determine where service is active
   */
  stubPrisonApiMockAgencySwitches: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPath: '/prisonApi/api/agency-switches/INCIDENTS',
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: [
          {
            agencyId: moorland.agencyId,
            name: moorland.description,
          },
          {
            agencyId: leeds.agencyId,
            name: leeds.description,
          },
        ],
      },
    }),

  /**
   * Stub getting details for all mock staff
   */
  stubPrisonApiMockStaff: (): Promise<SuperAgentResponse[]> =>
    Promise.all(
      [staffBarry, staffMary].map(staff =>
        stubFor({
          request: {
            method: 'GET',
            urlPath: `/prisonApi/api/users/${staff.username}`,
          },
          response: {
            status: 200,
            headers: { 'Content-Type': 'application/json;charset=UTF-8' },
            jsonBody: staff,
          },
        }),
      ),
    ),
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
