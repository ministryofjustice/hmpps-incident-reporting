/* eslint-disable import/first */
/*
 * Do appinsights first as it does some magic instrumentation work, i.e. it affects other 'require's
 * In particular, applicationinsights automatically collects bunyan logs
 */
import { AuthenticationClient, InMemoryTokenStore, RedisTokenStore } from '@ministryofjustice/hmpps-auth-clients'
// TODO: Worked in v4
// import { initDprReportingClients } from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/data/dprReportingClient'
// TODO: import from https://ministryofjustice.github.io/hmpps-digital-prison-reporting-frontend/integration-guides/integrating-the-fe-platform/#initialise-data-clients
import { initDprReportingClients } from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/initDprReportingClients'

import { initialiseAppInsights, buildAppInsightsClient } from '../utils/azureAppInsights'
import applicationInfoSupplier from '../applicationInfo'

const applicationInfo = applicationInfoSupplier()
initialiseAppInsights()
buildAppInsightsClient(applicationInfo)

import config from '../config'
import { createRedisClient } from './redisClient'
import ManageUsersApiClient from './manageUsersApiClient'
import FrontendComponentsClient from './frontendComponentsClient'
import logger from '../../logger'

const {
  reportingClient,
  dashboardClient,
  reportDataStore,
  productCollectionClient,
  missingReportClient,
  featureFlagService,
} = initDprReportingClients(config.apis.dpr, createRedisClient())

export type RestClientBuilder<T> = (token: string) => T

export const dataAccess = () => ({
  applicationInfo,
  hmppsAuthClient: new AuthenticationClient(
    config.apis.hmppsAuth,
    logger,
    config.redis.enabled ? new RedisTokenStore(createRedisClient()) : new InMemoryTokenStore(),
  ),
  manageUsersApiClient: new ManageUsersApiClient(),
  frontendComponentsClient: new FrontendComponentsClient(),
  // DPR
  reportingClient,
  dashboardClient,
  reportDataStore,
  productCollectionClient,
  missingReportClient,
  featureFlagService,
})

export type DataAccess = ReturnType<typeof dataAccess>
