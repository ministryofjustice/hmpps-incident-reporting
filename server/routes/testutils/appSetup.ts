import flash from 'connect-flash'
import cookieSession from 'cookie-session'
import express, { type Express } from 'express'
import { NotFound } from 'http-errors'

import routes from '../index'
import nunjucksSetup from '../../utils/nunjucksSetup'
import errorHandler from '../../errorHandler'
import type { Services } from '../../services'
import { IncidentReportingApi } from '../../data/incidentReportingApi'
import { OffenderSearchApi } from '../../data/offenderSearchApi'
import { PrisonApi } from '../../data/prisonApi'

export const user: Express.User = {
  name: 'FIRST LAST',
  userId: 'id',
  token: 'token',
  username: 'user1',
  displayName: 'First Last',
  active: true,
  activeCaseLoadId: 'MDI',
  authSource: 'NOMIS',
}

function appSetup(services: Services, production: boolean, userSupplier: () => Express.User): Express {
  const app = express()

  const systemToken = 'test-system-token'

  app.use(cookieSession({ keys: [''] }))
  app.use(flash())
  nunjucksSetup(app)
  app.use((req, res, next) => {
    req.user = userSupplier()
    res.locals = {
      user: { ...req.user },
      systemToken,
      apis: {
        incidentReportingApi: new IncidentReportingApi(systemToken),
        offenderSearchApi: new OffenderSearchApi(systemToken),
        prisonApi: new PrisonApi(systemToken),
      },
    }
    next()
  })
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(routes(services))
  app.use((req, res, next) => next(new NotFound()))
  app.use(errorHandler(production))

  return app
}

export function appWithAllRoutes({
  production = false,
  services = {},
  userSupplier = () => user,
}: {
  production?: boolean
  services?: Partial<Services>
  userSupplier?: () => Express.User
}): Express {
  return appSetup(services as Services, production, userSupplier)
}
