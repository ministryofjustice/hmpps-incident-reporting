import type { Response as SuperAgentResponse, SuperAgentRequest } from 'superagent'

import { stubFor } from './wiremock'
import { mockUser, mockSharedUser } from '../../server/data/testData/manageUsers'
import { staffBarry, staffMary } from '../../server/data/testData/prisonApi'

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

  /** Add all known users from test data */
  stubManageKnownUsers: (
    users: { username: string; name?: string }[] = [mockSharedUser, staffBarry, staffMary],
  ): Promise<SuperAgentResponse[]> =>
    Promise.all(
      users.map(user =>
        stubFor({
          request: {
            method: 'GET',
            urlPath: `/manage-users-api/users/${encodeURIComponent(user.username)}`,
          },
          response: {
            status: 200,
            headers: {
              'Content-Type': 'application/json;charset=UTF-8',
            },
            jsonBody: mockUser(user.username, user.name),
          },
        }),
      ),
    ),

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
