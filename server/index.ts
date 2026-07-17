import { buildAppInsightsClient } from './utils/azureAppInsights'
import applicationInfoSupplier from './applicationInfo'

import createApp from './app'
import { services } from './services'

const applicationInfo = applicationInfoSupplier()
buildAppInsightsClient(applicationInfo)

export const app = createApp(services())
