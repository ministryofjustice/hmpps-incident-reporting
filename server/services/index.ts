import { dataAccess } from '../data'
import UserService from './userService'

export const services = () => {
  const { applicationInfo, manageUsersApiClient, frontendComponentsClient } = dataAccess()

  const userService = new UserService(manageUsersApiClient)

  return {
    applicationInfo,
    userService,
    frontendComponentsClient,
  }
}

export type Services = ReturnType<typeof services>
