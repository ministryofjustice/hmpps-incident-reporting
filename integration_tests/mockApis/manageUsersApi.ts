import type { SuperAgentRequest } from 'superagent'

import { stubFor } from './wiremock'
import { mockUser } from '../../server/data/testData/manageUsers'

export default {
  /** Current user */
  stubManageUserMe: (name: string = 'John Smith'): SuperAgentRequest =>
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
        jsonBody: mockUser('user1', name),
      },
    }),

  /** Another user, looked up by username */
  stubManageUserNamed: ({
    username = 'jsmith',
    name = 'john smith',
  }: { username?: string; name?: string } = {}): SuperAgentRequest =>
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
        jsonBody: mockUser(username, name),
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
