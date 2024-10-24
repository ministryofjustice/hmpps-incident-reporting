import type { User } from '../manageUsersApiClient'

export function mockUser(username: string, name: string): User {
  return {
    staffId: 231232,
    username,
    active: true,
    name,
  }
}

/** The user who is performing actions during testing */
export const mockSharedUser: User = mockUser('user1', 'John Smith')
