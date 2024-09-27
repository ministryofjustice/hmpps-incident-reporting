import { dataAccess } from '../data'
import UserService from './userService'

export const services = () => {
  const { applicationInfo, hmppsAuthClient, manageUsersApiClient, frontendComponentsClient } = dataAccess()

  const userService = new UserService(manageUsersApiClient)

  return {
    applicationInfo,
    hmppsAuthClient,
    userService,
    frontendComponentsClient,
  }
}

export type Services = ReturnType<typeof services>
