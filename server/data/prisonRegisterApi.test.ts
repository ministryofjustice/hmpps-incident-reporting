import nock from 'nock'

import config from '../config'
import { type Agency, PrisonRegisterApi } from './prisonRegisterApi'
import { moorland, pecsNorth, pecsSouth } from './testData/prisonRegister'

describe('prisonRegisterApi', () => {
  const systemToken = 'token'
  let fakeApiClient: nock.Scope
  let apiClient: PrisonRegisterApi

  beforeEach(() => {
    fakeApiClient = nock(config.apis.prisonRegisterApi.url)
    apiClient = new PrisonRegisterApi(systemToken)
  })

  afterEach(() => {
    jest.resetAllMocks()
    nock.cleanAll()
  })

  describe('getAgency', () => {
    const { agencyId: prisonId } = moorland
    const { agencyId: pecsRegion } = pecsNorth

    it('should return a prison', async () => {
      fakeApiClient
        .get(`/api/agencies/${prisonId}`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, moorland)

      const response = await apiClient.getAgency(prisonId)
      expect(response).toEqual(moorland)
    })

    it('should return a PECS region', async () => {
      fakeApiClient
        .get(`/api/agencies/${pecsRegion}`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, pecsNorth)

      const response = await apiClient.getAgency(pecsRegion)
      expect(response).toEqual(pecsNorth)
    })

    it('should return null if not found', async () => {
      fakeApiClient.get(`/api/agencies/${prisonId}`).matchHeader('authorization', `Bearer ${systemToken}`).reply(404)

      const response = await apiClient.getAgency(prisonId)
      expect(response).toBeNull()
    })

    it('should throw when it receives another error', async () => {
      fakeApiClient
        .get(`/api/agencies/${prisonId}`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .thrice()
        .reply(500)

      await expect(apiClient.getAgency(prisonId)).rejects.toThrow('Internal Server Error')
    })
  })

  describe('getPecsRegions', () => {
    it('should list active PECS regions by default', async () => {
      fakeApiClient
        .get('/api/agencies/type/PECS')
        .query({ activeOnly: 'true' })
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, [pecsNorth, pecsSouth] satisfies Agency[])

      await expect(apiClient.getPecsRegions()).resolves.toEqual<Agency[]>([pecsNorth, pecsSouth])
    })

    it('should list all PECS regions', async () => {
      fakeApiClient
        .get('/api/agencies/type/PECS')
        .query({ activeOnly: 'false' })
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, [pecsNorth, pecsSouth] satisfies Agency[])

      await expect(apiClient.getPecsRegions(false)).resolves.toEqual<Agency[]>([pecsNorth, pecsSouth])
    })
  })
})
