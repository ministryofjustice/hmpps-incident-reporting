import { Request, Response, NextFunction } from 'express'
import nock from 'nock'
import { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'

import { ApplicationInfo } from '../applicationInfo'
import updateActiveAgencies, { activeAgenciesCache } from './updateActiveAgencies'
import { Services } from '../services'
import { ActiveAgency } from '../data/prisonApi'
import { brixton, moorland } from '../data/testData/prisonApi'
import config from '../config'
import logger from '../../logger'
import { activeAgencies, SERVICE_ALL_AGENCIES } from '../data/activeAgencies'

const fakeApiServer: nock.Scope = nock(config.apis.hmppsPrisonApi.url)
const fakeAuthServer: nock.Scope = nock(config.apis.hmppsAuth.url)
const systemToken = 'system-token'

describe('updateActiveAgencies', () => {
  const applicationInfo: ApplicationInfo = {
    // other fields omitted
    additionalFields: {
      activeAgencies: [],
    },
  } as unknown as ApplicationInfo

  const hmppsAuthClient = new AuthenticationClient(config.apis.hmppsAuth, logger)

  const middleware = updateActiveAgencies({
    hmppsAuthClient,
    applicationInfo,
  } as unknown as Services)

  const req = {} as Request
  const res = {} as Response

  let activeAgenciesResponse = [
    { agencyId: moorland.agencyId, name: moorland.description },
    { agencyId: brixton.agencyId, name: brixton.description },
  ]
  let newActiveAgencies = activeAgenciesResponse.map(agency => agency.agencyId)

  beforeEach(() => {
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

    activeAgenciesCache.reset()
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it('updates activeAgencies and applicationInfo singletons', async () => {
    // Mock Prison API request **once**
    mockAgenciesSwitchesRequest(activeAgenciesResponse)

    const next: NextFunction = jest.fn()

    // Check initial state
    expect(activeAgencies).toEqual([])
    expect(applicationInfo.additionalFields.activeAgencies).toEqual([])

    await middleware(req, res, next)

    // Check activeAgencies was update
    expect(activeAgencies).toEqual(newActiveAgencies)
    expect(applicationInfo.additionalFields.activeAgencies).toEqual(newActiveAgencies)
    expect(next).toHaveBeenNthCalledWith(1)
  })

  it('uses cache', async () => {
    // Mock Prison API request **once**
    mockAgenciesSwitchesRequest(activeAgenciesResponse)

    const next: NextFunction = jest.fn()

    // Recent middleware invocation
    await middleware(req, res, next)

    // Invoke middleware again to check caching
    await middleware(req, res, next)

    // NOTE: Here the test is that the nock's Prison API mock (mocked **once**)
    // didn't receive a 2nd request (that would throw an exception)

    // activeAgencies still the same
    expect(activeAgencies).toEqual(newActiveAgencies)
    expect(applicationInfo.additionalFields.activeAgencies).toEqual(newActiveAgencies)
    expect(next).toHaveBeenNthCalledWith(2)
  })

  it("converts '*ALL*' to '***' in applicationInfo", async () => {
    activeAgenciesResponse = [
      { agencyId: moorland.agencyId, name: moorland.description },
      { agencyId: brixton.agencyId, name: brixton.description },
      { agencyId: SERVICE_ALL_AGENCIES, name: 'Service active in all agencies' },
    ]
    newActiveAgencies = activeAgenciesResponse.map(agency => agency.agencyId)

    // Mock Prison API request **once**
    mockAgenciesSwitchesRequest(activeAgenciesResponse)

    const next: NextFunction = jest.fn()

    await middleware(req, res, next)

    // activeAgencies updated to contain only `'*ALL*'`
    expect(activeAgencies).toEqual([SERVICE_ALL_AGENCIES])
    // applicationInfo's activeAgencies updated to contain only `'***'`
    expect(applicationInfo.additionalFields.activeAgencies).toEqual(['***'])
    expect(next).toHaveBeenNthCalledWith(1)
  })

  it('handles failure to get a fresh activeAgencies list gracefully', async () => {
    // Mock API error
    fakeApiServer
      .get('/api/agency-switches/INCIDENTS')
      .matchHeader('authorization', `Bearer ${systemToken}`)
      .replyWithError('503 SERVICE UNAVAILABLE')

    const next: NextFunction = jest.fn()

    // Check initial state (activeAgencies was populated before)
    expect(activeAgencies.length).toBeGreaterThan(0)
    expect(applicationInfo.additionalFields.activeAgencies.length).toBeGreaterThan(0)

    await middleware(req, res, next)

    expect(next).toHaveBeenNthCalledWith(1)
  })
})

function mockAgenciesSwitchesRequest(activeAgenciesResponse: ActiveAgency[]) {
  fakeApiServer
    .get('/api/agency-switches/INCIDENTS')
    .matchHeader('authorization', `Bearer ${systemToken}`)
    .reply(200, activeAgenciesResponse satisfies ActiveAgency[])
}
