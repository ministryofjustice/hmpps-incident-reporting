import { jwtDecode, type JwtPayload } from 'jwt-decode'

import { convertToTitleCase } from '../utils/utils'
import type { User } from '../data/manageUsersApiClient'
import ManageUsersApiClient from '../data/manageUsersApiClient'

export interface UserDetails extends User {
  displayName: string
  roles: string[]
  /** Created by HMPPS Auth and identifies the person across all auth sources */
  userUuid?: string
}

export interface AuthToken extends JwtPayload {
  client_id?: string
  auth_source?: string
  grant_type?: string
  user_name?: string
  user_id?: string
  user_uuid?: string
  authorities?: string[]
  scope?: string[]
}

export default class UserService {
  constructor(private readonly manageUsersApiClient: ManageUsersApiClient) {}

  async getUser(token: string): Promise<UserDetails> {
    const user = await this.manageUsersApiClient.getUser(token)
    const { user_id: userId, user_uuid: userUuid } = jwtDecode<AuthToken>(token)
    return {
      ...user,
      userId: userId ?? user.userId,
      userUuid,
      roles: this.getUserRoles(token),
      displayName: convertToTitleCase(user.name),
    }
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

    return users.reduce((prev, user) => ({ ...prev, [user!.username]: user }), {})
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
