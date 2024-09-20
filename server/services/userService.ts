import { jwtDecode, type JwtPayload } from 'jwt-decode'

import { convertToTitleCase } from '../utils/utils'
import type { User } from '../data/manageUsersApiClient'
import ManageUsersApiClient from '../data/manageUsersApiClient'
import { NomisUserRolesApi, type UserCaseloads } from '../data/nomisUserRolesApi'

export interface UserDetails extends User, UserCaseloads {
  displayName: string
  roles: string[]
}

export interface AuthToken extends JwtPayload {
  client_id?: string
  auth_source?: string
  grant_type?: string
  user_name?: string
  authorities?: string[]
  scope?: string[]
}

export default class UserService {
  constructor(private readonly manageUsersApiClient: ManageUsersApiClient) {}

  async getUser(token: string): Promise<UserDetails> {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const user = await this.manageUsersApiClient.getUser(token).then(user => {
      const nomisUserRolesApi = new NomisUserRolesApi(token)

      return nomisUserRolesApi.getUserCaseloads().then(uc => {
        return {
          ...user,
          displayName: convertToTitleCase(user.name),
          caseloads: uc.caseloads,
          activeCaseload: uc.activeCaseload,
        }
      })
    })
    return { ...user, roles: this.getUserRoles(token), displayName: convertToTitleCase(user.name) }
  }

  async getUsers(token: string, usernameList: Array<string>): Promise<Record<string, User>> {
    const uniqueUsernames = [...new Set(usernameList)]
    if (uniqueUsernames.length === 0) {
      return {}
    }

    const users = (
      await Promise.allSettled(uniqueUsernames.map(username => this.manageUsersApiClient.getNamedUser(token, username)))
    )
      .map(promise => (promise.status === 'fulfilled' ? promise.value : null))
      .filter(user => user)

    return users.reduce((prev, user) => ({ ...prev, [user.username]: user }), {})
  }

  /**
   * Extracts roles from oauth jwt token, stripping ROLE_ prefix.
   * Returns an empty list if cannot be decoded.
   */
  getUserRoles(token: string): string[] {
    const { authorities: roles = [] } = jwtDecode<AuthToken>(token)
    return roles.map(role => (role.startsWith('ROLE_') ? role.substring(5) : role))
  }
}
