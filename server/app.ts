import flash from 'connect-flash'
import express from 'express'
import { NotFound } from 'http-errors'

import nunjucksSetup from './utils/nunjucksSetup'
import errorHandler from './errorHandler'
import authorisationMiddleware from './middleware/authorisationMiddleware'

import { Permissions } from './middleware/permissions'
import setApis from './middleware/setApis'
import setSystemToken from './middleware/setSystemToken'
import setUpAuthentication from './middleware/setUpAuthentication'
import setUpCsrf from './middleware/setUpCsrf'
import setUpCurrentUser from './middleware/setUpCurrentUser'
import setUpHealthChecks from './middleware/setUpHealthChecks'
import setUpPecsRegions from './middleware/setUpPecsRegions'
import setUpStaticResources from './middleware/setUpStaticResources'
import setUpWebRequestParsing from './middleware/setupRequestParsing'
import setUpWebSecurity from './middleware/setUpWebSecurity'
import setUpWebSession from './middleware/setUpWebSession'
import frontendComponents from './middleware/frontendComponents'

import config from './config'
import routes from './routes'
import type { Services } from './services'
import updateActiveAgencies from './middleware/updateActivePrisons'

export default function createApp(services: Services): express.Application {
  const app = express()

  app.set('json spaces', 2)
  app.set('trust proxy', true)
  app.set('port', process.env.PORT || 3000)

  app.use(updateActiveAgencies(services))
  app.use(setUpHealthChecks(services.applicationInfo))
  app.use(setUpWebSecurity())
  app.use(setUpWebSession())
  app.use(flash())
  app.use(setUpWebRequestParsing())
  app.use(setUpStaticResources())
  nunjucksSetup(app)
  app.use(setUpAuthentication())
  app.use(authorisationMiddleware())
  app.use(setUpCsrf())
  app.use(setUpCurrentUser(services))
  app.use(setSystemToken(services))
  app.use(setUpPecsRegions(services))
  app.use(setApis(services))
  app.use(frontendComponents(services))
  app.use(Permissions.middleware)

  app.use(routes(services))

  app.use((_req, _res, next) => next(new NotFound()))
  app.use(errorHandler(config.production))

  return app
}
