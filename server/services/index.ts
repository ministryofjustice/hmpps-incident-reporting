import { dataAccess } from '../data'
import UserService from './userService'
import FrontendComponentsService from './frontendComponentsService'

export const services = () => {
  const { applicationInfo, hmppsAuthClient, manageUsersApiClient, frontendComponentsClient } = dataAccess()

  const userService = new UserService(manageUsersApiClient)
  const frontendComponentsService = new FrontendComponentsService(frontendComponentsClient)

  return {
    applicationInfo,
    hmppsAuthClient,
    userService,
    frontendComponentsClient,
    frontendComponentsService,
  }
}

export type Services = ReturnType<typeof services>
