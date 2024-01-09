import { dataAccess } from '../data'
import UserService from './userService'
import FrontendComponentsClient from '../data/frontendComponentsClient'

export const services = () => {
  const { applicationInfo, manageUsersApiClient } = dataAccess()

  const userService = new UserService(manageUsersApiClient)
  const frontendComponentsClient = new FrontendComponentsClient()

  return {
    applicationInfo,
    userService,
    frontendComponentsClient,
  }
}

export type Services = ReturnType<typeof services>
