import type { PrisonUser, User, UsersSearchResult } from '../manageUsersApiClient'
import { moorland } from './prisonApi'

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

/** The user who is modifying reports during testing */
export const mockSharedUser2: User = mockUser('user2', 'Mary Johnson')

/** Same user as above returned from prison-specific endpoint that splits first names from surnames */
export const mockPrisonUser: PrisonUser = {
  username: 'user1',
  firstName: 'JOHN',
  lastName: 'SMITH',
}

/** Again, same as user above but returned from a prison-specific search endpoint that returns a different response shapge */
export const mockPrisonUserSearchResult: UsersSearchResult = {
  ...mockPrisonUser,
  email: 'user1@localhost',
  activeCaseload: {
    id: moorland.agencyId,
    name: moorland.description,
  },
}
