import type { SuperAgentRequest } from 'superagent'

import { stubFor } from './wiremock'

export default {
  stubIncidentReportingApiPing: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPath: '/incidentReportingApi/health/ping',
      },
      response: {
        status: 200,
      },
    }),
}
