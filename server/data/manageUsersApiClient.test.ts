import nock from 'nock'

import config from '../config'
import ManageUsersApiClient, { type UsersSearchResponse } from './manageUsersApiClient'

jest.mock('./tokenStore/redisTokenStore')

const token = { access_token: 'token-1', expires_in: 300 }

describe('manageUsersApiClient', () => {
  let fakeManageUsersApiClient: nock.Scope
  let manageUsersApiClient: ManageUsersApiClient

  beforeEach(() => {
    fakeManageUsersApiClient = nock(config.apis.manageUsersApi.url)
    manageUsersApiClient = new ManageUsersApiClient()
  })

  afterEach(() => {
    jest.resetAllMocks()
    nock.cleanAll()
  })

  describe('getUser()', () => {
    it('returns data from api', async () => {
      const response = { data: 'data' }

      fakeManageUsersApiClient
        .get('/users/me')
        .matchHeader('authorization', `Bearer ${token.access_token}`)
        .reply(200, response)

      const output = await manageUsersApiClient.getUser(token.access_token)
      expect(output).toEqual(response)
    })
  })

  describe('searchUsers()', () => {
    const mockResponse: UsersSearchResponse = {
      content: [
        {
          username: 'BSMITH_GEN',
          firstName: 'Bob',
          lastName: 'Smith',
          email: 'bsmith@example.com',
          activeCaseload: {
            id: 'MDI',
            name: 'Moorland (HMP & YOI)',
          },
        },
      ],
      number: 0,
      totalPages: 1,
      totalElements: 1,
      last: true,
    }

    it('returns the search results', async () => {
      fakeManageUsersApiClient
        .get('/prisonusers/search?nameFilter=bob%20smith&status=ACTIVE&size=20&page=0')
        .matchHeader('authorization', `Bearer ${token.access_token}`)
        .reply(200, mockResponse)

      const response = await manageUsersApiClient.searchUsers(token.access_token, 'bob smith')
      expect(response).toEqual(mockResponse)
    })

    it('trims the query', async () => {
      fakeManageUsersApiClient
        .get('/prisonusers/search?nameFilter=bob%20smith&status=ACTIVE&size=20&page=0')
        .matchHeader('authorization', `Bearer ${token.access_token}`)
        .reply(200, mockResponse)

      const response = await manageUsersApiClient.searchUsers(token.access_token, 'bob smith  ')
      expect(response).toEqual(mockResponse)
    })
  })
})
