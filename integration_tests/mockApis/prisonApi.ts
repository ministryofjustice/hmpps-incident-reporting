import type { SuperAgentRequest } from 'superagent'

import { stubFor } from './wiremock'

export default {
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
