import type { SuperAgentRequest } from 'superagent'

import { stubFor } from './wiremock'

export default {
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
