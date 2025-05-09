import { asSystem } from '@ministryofjustice/hmpps-rest-client'
import logger from '../../logger'
import config from '../config'
import ConcreteRestClient from './concreteRestClient'

export interface User {
  username: string
  name?: string
  active?: boolean
  authSource?: string
  uuid?: string
  userId?: string
  staffId?: number // deprecated, use userId
  activeCaseLoadId?: string // deprecated, use user roles api
}

export interface PrisonUser {
  username: string
  firstName: string
  lastName: string
  primaryEmail?: string
}

export interface UsersSearchResponse {
  content: UsersSearchResult[]

  /** current page number (zero-based) */
  number: number
  totalPages: number
  totalElements: number
  /** is last page? */
  last: boolean
}

export interface UsersSearchResult {
  username: string
  firstName: string
  lastName: string
  email?: string
  activeCaseload?: null | {
    id: string
    name: string
  }
}

export default class ManageUsersApiClient {
  static readonly PAGE_SIZE = 20

  private static restClient(token: string): ConcreteRestClient {
    return new ConcreteRestClient('Manage Users Api Client', config.apis.manageUsersApi, logger, {
      getToken: async () => token,
    })
  }

  /**
   * Get current user details
   */
  getUser(token: string): Promise<User> {
    logger.info('Getting user details: calling HMPPS Manage Users Api')
    return ManageUsersApiClient.restClient(token).get<User>({ path: '/users/me' }, asSystem())
  }

  /**
   * Get a user by username
   */
  getNamedUser(token: string, username: string): Promise<User> {
    logger.info(`Getting ${username} user details: calling HMPPS Manage Users Api`)
    return ManageUsersApiClient.restClient(token).get<User>({ path: `/users/${username}` }, asSystem())
  }

  /**
   * Get a NOMIS/DPS user by username
   */
  getPrisonUser(token: string, username: string): Promise<PrisonUser> {
    return ManageUsersApiClient.restClient(token).get(
      {
        path: `/prisonusers/${encodeURIComponent(username)}`,
      },
      asSystem(),
    )
  }

  /**
   * Search for NOMIS users matching on partial first name, surname, username or email
   *
   * Requires role ROLE_MAINTAIN_ACCESS_ROLES_ADMIN
   */
  searchUsers(token: string, query: string, page: number = 0): Promise<UsersSearchResponse> {
    type Status = 'ACTIVE' | 'INACTIVE' | 'ALL'
    const status: Status = 'ACTIVE'

    return ManageUsersApiClient.restClient(token).get(
      {
        path: '/prisonusers/search',
        query: {
          nameFilter: query?.trim(),
          status,
          size: ManageUsersApiClient.PAGE_SIZE,
          page,
        },
      },
      asSystem(),
    )
  }
}
