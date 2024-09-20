import UserService from './userService'
import ManageUsersApiClient, { type User } from '../data/manageUsersApiClient'
import createUserToken from '../testutils/createUserToken'
import { NomisUserRolesApi } from '../data/nomisUserRolesApi'

jest.mock('../data/manageUsersApiClient')

describe('User service', () => {
  let manageUsersApiClient: jest.Mocked<ManageUsersApiClient>
  let nomisUserRolesApi: jest.Mocked<NomisUserRolesApi>
  let userService: UserService

  describe('getUser', () => {
    beforeEach(() => {
      manageUsersApiClient = new ManageUsersApiClient() as jest.Mocked<ManageUsersApiClient>
      nomisUserRolesApi = NomisUserRolesApi.prototype as jest.Mocked<NomisUserRolesApi>
      userService = new UserService(manageUsersApiClient)
    })

    it('Retrieves and formats user name', async () => {
      const token = createUserToken([])
      manageUsersApiClient.getUser.mockResolvedValue({ name: 'john smith' } as User)

      nomisUserRolesApi.getUserCaseloads.mockResolvedValue({
        activeCaseload: {
          id: 'MDI',
          name: 'Moorland (HMP & YOI)',
        },
        caseloads: [
          {
            id: 'MDI',
            name: 'Moorland (HMP & YOI)',
          },
        ],
      })
      const result = await userService.getUser(token)

      expect(result.displayName).toEqual('John Smith')
    })

    it('Retrieves and formats roles', async () => {
      const token = createUserToken(['ROLE_ONE', 'ROLE_TWO'])
      manageUsersApiClient.getUser.mockResolvedValue({ name: 'john smith' } as User)

      const result = await userService.getUser(token)

      expect(result.roles).toEqual(['ONE', 'TWO'])
    })

    it('Propagates error', async () => {
      const token = createUserToken([])
      manageUsersApiClient.getUser.mockRejectedValue(new Error('some error'))

      await expect(userService.getUser(token)).rejects.toEqual(new Error('some error'))
    })
  })
})
