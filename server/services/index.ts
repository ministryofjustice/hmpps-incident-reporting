// import { createDprServices } from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/utils/CreateDprServices'
// TODO: Import from https://ministryofjustice.github.io/hmpps-digital-prison-reporting-frontend/integration-guides/integrating-the-fe-platform/#create-services
import { createDprServices } from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/createDprServices'
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
    // TODO: https://mojdt.slack.com/archives/C03FYCXFBQT/p1769086861912869?thread_ts=1769086216.185899&cid=C03FYCXFBQT
    // collections: true,
    // missingReports: true,
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
