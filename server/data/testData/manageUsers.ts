import type { PrisonUser, User } from '../manageUsersApiClient'

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

/** Same user as above returned from prison-specific endpoint that splits first names from surnames */
export const mockPrisonUser: PrisonUser = {
  username: 'user1',
  firstName: 'JOHN',
  lastName: 'SMITH',
}
