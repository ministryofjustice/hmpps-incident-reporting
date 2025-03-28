import type { Response as SuperAgentResponse, SuperAgentRequest } from 'superagent'

import { stubFor } from './wiremock'
import { mockUser, mockSharedUser, mockPrisonUserSearchResult } from '../../server/data/testData/manageUsers'
import { staffBarry, staffMary } from '../../server/data/testData/prisonApi'
import ManageUsersApiClient, {
  type UsersSearchResponse,
  type UsersSearchResult,
} from '../../server/data/manageUsersApiClient'

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

  stubManageKnownPrisonUser: (user: UsersSearchResult): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPath: `/manage-users-api/prisonusers/${encodeURIComponent(user.username)}`,
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: user,
      },
    }),

  /** Search users */
  stubSearchUsers: ({
    query,
    results = [mockPrisonUserSearchResult],
    page = 0,
  }: {
    query: string
    results?: UsersSearchResult[]
    page?: number
  }): SuperAgentRequest => {
    const response: UsersSearchResponse = {
      content: results,
      number: page,
      totalPages: 1,
      totalElements: results.length,
      last: true,
    }

    return stubFor({
      request: {
        method: 'GET',
        urlPath: '/manage-users-api/prisonusers/search',
        queryParameters: {
          nameFilter: { equalTo: query },
          status: { equalTo: 'ACTIVE' },
          size: { equalTo: ManageUsersApiClient.PAGE_SIZE.toString() },
          page: { equalTo: page.toString() },
        },
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: response,
      },
    })
  },

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
