import { jwtDecode, type JwtPayload } from 'jwt-decode'

import { convertToTitleCase } from '../utils/utils'
import type { User } from '../data/manageUsersApiClient'
import ManageUsersApiClient from '../data/manageUsersApiClient'

export interface UserDetails extends User {
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
    const user = await this.manageUsersApiClient.getUser(token)
    return { ...user, roles: this.getUserRoles(token), displayName: convertToTitleCase(user.name) }
  }

  async getUsers(token: string, usernameList: Array<string>): Promise<Record<string, User>> {
    const uniqueUsernames = [...new Set(usernameList)]
    const users = [
      ...(
        await Promise.allSettled(
          uniqueUsernames.map(username => this.manageUsersApiClient.getNamedUser(token, username)),
        )
      )
        .map(promise => (promise.status === 'fulfilled' ? promise.value : null))
        .filter(user => user),
    ]
    return users.reduce((prev, user) => ({ ...prev, [user.username]: user }), {})
  }

  getUserRoles(token: string): string[] {
    const { authorities: roles = [] } = jwtDecode<AuthToken>(token)
    return roles.map(role => role.substring(role.indexOf('_') + 1))
  }
}
