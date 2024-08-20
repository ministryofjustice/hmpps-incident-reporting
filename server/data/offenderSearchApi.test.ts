import nock from 'nock'

import config from '../config'
import { OffenderSearchApi } from './offenderSearchApi'
import { andrew, barry, chris } from './testData/offenderSearch'

jest.mock('./tokenStore/redisTokenStore')

describe('offenderSearchApi', () => {
  let fakeApiClient: nock.Scope
  let apiClient: OffenderSearchApi

  beforeEach(() => {
    fakeApiClient = nock(config.apis.offenderSearchApi.url)
    apiClient = new OffenderSearchApi('token')
  })

  afterEach(() => {
    jest.resetAllMocks()
    nock.cleanAll()
  })

  describe('getPrisoners', () => {
    it('should de-duplicate input prisoner numbers', async () => {
      fakeApiClient.post('/prisoner-search/prisoner-numbers').reply(200, (_uri, requestBody) => {
        const request = requestBody as { prisonerNumbers: string[] }
        expect(request.prisonerNumbers).toHaveLength(3)
        return [chris, barry, andrew]
      })

      const responseFuture = apiClient.getPrisoners(['A1111AA', 'A2222BB', 'A1111AA', 'A3333CC'])
      await expect(responseFuture).resolves.toEqual({
        A1111AA: andrew,
        A2222BB: barry,
        A3333CC: chris,
      })
    })
  })
})
