import nock from 'nock'

import config from '../config'
import { OffenderSearchApi, type OffenderSearchPrisoner } from './offenderSearchApi'

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
    it('should de-duplicate prisoner numbers', () => {
      fakeApiClient.post('/prisoner-search/prisoner-numbers').reply(200, (_uri, requestBody) => {
        const request = requestBody as { prisonerNumbers: string[] }
        expect(request.prisonerNumbers).toHaveLength(3)
        const response: OffenderSearchPrisoner[] = [
          {
            prisonerNumber: 'A3333CC',
            firstName: 'DAVID',
            lastName: 'JONES',
          },
          {
            prisonerNumber: 'A2222BB',
            firstName: 'FRED',
            lastName: 'MILLS',
          },
          {
            prisonerNumber: 'A1111AA',
            firstName: 'ANDREW',
            lastName: 'BROWN',
          },
        ]
        return response
      })

      const responseFuture = apiClient.getPrisoners(['A1111AA', 'A2222BB', 'A1111AA', 'A3333CC'])
      expect(responseFuture).resolves.toEqual({
        A1111AA: {
          prisonerNumber: 'A1111AA',
          firstName: 'ANDREW',
          lastName: 'BROWN',
        },
        A2222BB: {
          prisonerNumber: 'A2222BB',
          firstName: 'FRED',
          lastName: 'MILLS',
        },
        A3333CC: {
          prisonerNumber: 'A3333CC',
          firstName: 'DAVID',
          lastName: 'JONES',
        },
      })
    })
  })
})
