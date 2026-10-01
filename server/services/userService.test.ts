import jwt from 'jsonwebtoken'

import UserService from './userService'
import ManageUsersApiClient, { type User } from '../data/manageUsersApiClient'
import createUserToken from '../testutils/createUserToken'

jest.mock('../data/manageUsersApiClient')

describe('User service', () => {
  let manageUsersApiClient: jest.Mocked<ManageUsersApiClient>
  let userService: UserService

  describe('getUser', () => {
    beforeEach(() => {
      manageUsersApiClient = new ManageUsersApiClient() as jest.Mocked<ManageUsersApiClient>
      userService = new UserService(manageUsersApiClient)
    })

    it('Retrieves and formats user name', async () => {
      const token = createUserToken([])
      manageUsersApiClient.getUser.mockResolvedValue({ name: 'John Smith' } as User)

      const result = await userService.getUser(token)

      expect(result.displayName).toEqual('John Smith')
    })

    it('Retrieves and formats roles', async () => {
      const token = createUserToken(['ROLE_ONE', 'ROLE_TWO'])
      manageUsersApiClient.getUser.mockResolvedValue({ name: 'John Smith' } as User)

      const result = await userService.getUser(token)

      expect(result.roles).toEqual(['ONE', 'TWO'])
    })

    it('Takes the user id and UUID from the token', async () => {
      const token = createUserToken([])
      manageUsersApiClient.getUser.mockResolvedValue({ name: 'John Smith', userId: 'manage-users-id' } as User)

      const result = await userService.getUser(token)

      expect(result.userId).toEqual('231232')
      expect(result.userUuid).toEqual('11111111-1111-1111-1111-111111111111')
    })

    it('Falls back to the manage users id and leaves the UUID unset when the token lacks them', async () => {
      const token = jwt.sign({ user_name: 'user1', authorities: [] }, 'secret')
      manageUsersApiClient.getUser.mockResolvedValue({ name: 'John Smith', userId: 'manage-users-id' } as User)

      const result = await userService.getUser(token)

      expect(result.userId).toEqual('manage-users-id')
      expect(result.userUuid).toBeUndefined()
    })

    it('Propagates error', async () => {
      const token = createUserToken([])
      manageUsersApiClient.getUser.mockRejectedValue(new Error('some error'))

      await expect(userService.getUser(token)).rejects.toEqual(new Error('some error'))
    })
  })
})
