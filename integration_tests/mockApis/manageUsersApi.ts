import type { SuperAgentRequest } from 'superagent'

import { stubFor } from './wiremock'
import type { User } from '../../server/data/manageUsersApiClient'

export default {
  /** Current user */
  stubManageUserMe: (name: string = 'john smith'): SuperAgentRequest =>
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
        } satisfies User,
      },
    }),

  /** Another user, looked up by username */
  stubManageUserNamed: (username: string = 'jsmith', name: string = 'john smith'): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPath: `/manage-users-api/users/${encodeURIComponent(username)}`,
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
        } satisfies User,
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
