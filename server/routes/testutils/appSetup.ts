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
import { makeMockCaseload, mockCaseload } from '../../data/testData/frontendComponents'
import { leeds } from '../../data/testData/prisonApi'
import { roleReadOnly, roleReadWrite, roleApproveReject } from '../../data/constants'
import { IncidentReportingApi } from '../../data/incidentReportingApi'
import { OffenderSearchApi } from '../../data/offenderSearchApi'
import { PrisonApi } from '../../data/prisonApi'

/** Typical reporting officer with access to Moorland only */
export const user: Express.User = {
  name: 'JOHN SMITH',
  userId: 'id',
  token: 'token',
  username: 'user1',
  displayName: 'John Smith',
  active: true,
  activeCaseLoadId: 'MDI',
  authSource: 'NOMIS',
  roles: ['PRISON', roleReadWrite],
  // from frontend components middleware
  activeCaseLoad: mockCaseload,
  caseLoads: [mockCaseload],
}

/** Data warden with write access to Leeds and Moorland */
export const approverUser: Express.User = {
  ...user,
  roles: ['PRISON', roleApproveReject],
  caseLoads: [mockCaseload, makeMockCaseload(leeds, false)],
}

/** HQ user with read-only access to Leeds and Moorland */
export const hqUser: Express.User = {
  ...user,
  roles: ['PRISON', roleReadOnly],
  caseLoads: [mockCaseload, makeMockCaseload(leeds, false)],
}

/** General user Moorland without access */
export const unauthorisedUser: Express.User = {
  ...user,
  roles: ['PRISON'],
  caseLoads: [mockCaseload],
}

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
      apis: {
        incidentReportingApi: new IncidentReportingApi(systemToken),
        offenderSearchApi: new OffenderSearchApi(systemToken),
        prisonApi: new PrisonApi(systemToken),
      },
    })

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
  services = { applicationInfo: testAppInfo },
  userSupplier = () => user,
}: {
  production?: boolean
  services?: Partial<Services>
  userSupplier?: () => Express.User
}): Express {
  return appSetup(services as Services, production, userSupplier)
}
