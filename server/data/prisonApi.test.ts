import nock from 'nock'

import config from '../config'
import { PrisonApi, type Prison } from './prisonApi'
import { leeds, moorland } from './testData/prisonApi'

jest.mock('./tokenStore/redisTokenStore')

describe('offenderSearchApi', () => {
  let fakeApiClient: nock.Scope
  let apiClient: PrisonApi

  beforeEach(() => {
    fakeApiClient = nock(config.apis.hmppsPrisonApi.url)
    apiClient = new PrisonApi('token')
  })

  afterEach(() => {
    jest.resetAllMocks()
    nock.cleanAll()
  })

  describe('getPrisons', () => {
    it('should create a map of prisons from api', async () => {
      fakeApiClient.get('/api/agencies/prisons').reply(200, [moorland, leeds] satisfies Prison[])

      await expect(apiClient.getPrisons()).resolves.toEqual<Record<string, Prison>>({
        LEI: leeds,
        MDI: moorland,
      })
    })
  })
})
