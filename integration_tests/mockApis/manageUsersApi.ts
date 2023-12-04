import type { SuperAgentRequest } from 'superagent'

import { stubFor } from './wiremock'

export default {
  stubManageUser: (name: string = 'john smith'): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPath: '/manage-users-api/users/me',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: {
          staffId: 231232,
          username: 'USER1',
          active: true,
          name,
        },
      },
    }),
  stubManageUsersPing: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPath: '/manage-users-api/health/ping',
      },
      response: {
        status: 200,
      },
    }),
}
