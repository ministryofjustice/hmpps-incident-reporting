import { createDprServices } from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/utils/CreateDprServices'

import { dataAccess } from '../data'
import UserService from './userService'

export const services = () => {
  const {
    applicationInfo,
    hmppsAuthClient,
    manageUsersApiClient,
    frontendComponentsClient,
    // DPR
    reportingClient,
    dashboardClient,
    reportDataStore,
    featureFlagService,
    productCollectionClient,
    missingReportClient,
  } = dataAccess()

  const userService = new UserService(manageUsersApiClient)

  const dprClients = {
    reportingClient,
    dashboardClient,
    reportDataStore,
    featureFlagService,
    productCollectionClient,
    missingReportClient,
  }
  const featureConfig = {
    bookmarking: true, // Enables bookmarking feature
    download: true, // Enables download feature
    saveDefaults: true, // Enables save user defaults feature
  }
  const dprServices = createDprServices(dprClients, featureConfig)

  return {
    applicationInfo,
    hmppsAuthClient,
    userService,
    frontendComponentsClient,
    ...dprServices,
  }
}

export type Services = ReturnType<typeof services>
