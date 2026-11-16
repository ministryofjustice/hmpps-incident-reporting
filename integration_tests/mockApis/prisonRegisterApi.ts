import type { SuperAgentRequest } from 'superagent'

import { stubFor } from './wiremock'
import type { Agency } from '../../server/data/prisonRegisterApi'
import { pecsNorth, pecsSouth } from '../../server/data/testData/prisonRegister'

export default {
  /**
   * Stub getting details for an agency (a prison or a PECS region)
   */
  stubPrisonRegisterMockAgency: (agency: Agency): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPath: `/prisonRegisterApi/api/agencies/${agency.agencyId}`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: agency,
      },
    }),

  /**
   * Stub getting details for all mock PECS regions
   */
  stubPrisonRegisterMockPecsRegions: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPath: '/prisonRegisterApi/api/agencies/type/PECS',
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: [pecsNorth, pecsSouth],
      },
    }),

  /**
   * Health check
   */
  stubPrisonRegisterApiPing: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPath: '/prisonRegisterApi/health/ping',
      },
      response: {
        status: 200,
      },
    }),
}
