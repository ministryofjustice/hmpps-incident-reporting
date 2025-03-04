import { randomUUID } from 'node:crypto'

import flash from 'connect-flash'
import cookieSession from 'cookie-session'
import express, { type Express } from 'express'
import { NotFound } from 'http-errors'

import routes from '../index'
import nunjucksSetup from '../../utils/nunjucksSetup'
import type { ApplicationInfo } from '../../applicationInfo'
import errorHandler from '../../errorHandler'
import type { Services } from '../../services'
import { reportingUser } from '../../data/testData/users'
import { setupPermissions } from '../../middleware/permissions'
import setApis from '../../middleware/setApis'

export const testAppInfo: ApplicationInfo = {
  applicationName: 'hmpps-incident-reporting',
  buildNumber: '1',
  gitRef: '9fb9f708131d3ff0251e0653ac25dc6d28a69247',
  gitShortHash: '9fb9f70',
  branchName: 'main',
  assetsPath: './assets',
}

function appSetup(services: Services, production: boolean, userSupplier: () => Express.User): Express {
  const app = express()

  const systemToken = 'test-system-token'

  app.use(cookieSession({ keys: [''] }))
  app.use(flash())
  nunjucksSetup(app)
  app.use((req, res, next) => {
    req.id = randomUUID()

    res.locals.csrfToken = 'csrf-token'

    req.user = userSupplier()
    Object.assign(res.locals, {
      user: { ...req.user },
      systemToken,
    })

    next()
  })
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(setApis())
  app.use(setupPermissions)

  app.use(routes(services))

  app.use((_req, _res, next) => next(new NotFound()))
  app.use(errorHandler(production))

  return app
}

export function appWithAllRoutes({
  production = false,
  services = { applicationInfo: testAppInfo },
  userSupplier = () => reportingUser,
}: {
  production?: boolean
  services?: Partial<Services>
  userSupplier?: () => Express.User
} = {}): Express {
  return appSetup(services as Services, production, userSupplier)
}
