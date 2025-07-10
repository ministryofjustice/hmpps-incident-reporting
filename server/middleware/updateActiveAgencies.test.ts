import { Request, Response, NextFunction } from 'express'
import nock from 'nock'
import { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'

import { ApplicationInfo } from '../applicationInfo'
import updateActiveAgencies from './updateActiveAgencies'
import { Services } from '../services'
import { ActiveAgency } from '../data/prisonApi'
import { brixton, moorland } from '../data/testData/prisonApi'
import config from '../config'
import logger from '../../logger'
import { activeAgencies, SERVICE_ALL_AGENCIES } from '../data/activeAgencies'

const fakeApiServer: nock.Scope = nock(config.apis.hmppsPrisonApi.url)
const fakeAuthServer: nock.Scope = nock(config.apis.hmppsAuth.url)

const systemToken = 'system-token'
const hmppsAuthClient = new AuthenticationClient(config.apis.hmppsAuth, logger)

const activeAgenciesResponse = [
  { agencyId: moorland.agencyId, name: moorland.description },
  { agencyId: brixton.agencyId, name: brixton.description },
  { agencyId: SERVICE_ALL_AGENCIES, name: 'Service active in all agencies' },
]

const applicationInfo: ApplicationInfo = {
  // other fields omitted
  additionalFields: {
    activeAgencies: [],
  },
} as unknown as ApplicationInfo

describe('updateActiveAgencies', () => {
  beforeAll(() => {
    // Mock HMPPS Auth token request **once**
    fakeAuthServer
      .post('/oauth/token', 'grant_type=client_credentials')
      .basicAuth({
        user: config.apis.hmppsAuth.systemClientId,
        pass: config.apis.hmppsAuth.systemClientSecret,
      })
      .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
      // Force AuthenticationClient to not cache token
      .reply(200, { access_token: systemToken, expires_in: 0 })

    // Mock Prison API request **once**
    fakeApiServer
      .get('/api/agency-switches/INCIDENTS')
      .matchHeader('authorization', `Bearer ${systemToken}`)
      .reply(200, activeAgenciesResponse satisfies ActiveAgency[])
  })

  it('updates activeAgencies and applicationInfo singletons', async () => {
    const middleware = updateActiveAgencies({
      hmppsAuthClient,
      applicationInfo,
    } as unknown as Services)

    const req = {} as Request
    const res = {} as Response
    const next: NextFunction = jest.fn()

    // Check initial state
    expect(activeAgencies).toEqual([])
    expect(applicationInfo.additionalFields.activeAgencies).toEqual([])
    const newActiveAgencies = activeAgenciesResponse.map(agency => agency.agencyId)

    await middleware(req, res, next)

    // Check activeAgencies was update
    expect(activeAgencies).toEqual(newActiveAgencies)
    expect(applicationInfo.additionalFields.activeAgencies).toEqual(['***'])
    expect(next).toHaveBeenCalledWith()

    // // Invoke middleware again to check caching
    // await middleware(req, res, next)

    // // activeAgencies still the same
    // expect(activeAgencies).toEqual(newActiveAgencies)
    // expect(applicationInfo.additionalFields.activeAgencies).toEqual(newActiveAgencies)
    // expect(next).toHaveBeenCalledWith()
  })
})
