import type { Request, Response } from 'express'
import { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'

import { PrisonApi } from '../data/prisonApi'
import { type PecsRegion, pecsRegions } from '../data/pecsRegions'
import { mockErrorResponse } from '../data/testData/incidentReporting'
import { pecsNorthRegion, pecsSouthRegion } from '../data/testData/pecsRegions'
import { pecsNorth, pecsSouth } from '../data/testData/prisonApi'
import { mockThrownError } from '../data/testData/thrownErrors'
import type { Services } from '../services'
import setUpPecsRegions from './setUpPecsRegions'

jest.mock('@ministryofjustice/hmpps-auth-clients')
jest.mock('../data/prisonApi')

describe('Loading PECS regions', () => {
  let previousPecsRegions: PecsRegion[]

  beforeAll(() => {
    previousPecsRegions = pecsRegions.splice(0, pecsRegions.length)
  })

  afterAll(() => {
    pecsRegions.splice(0, pecsRegions.length, ...previousPecsRegions)
  })

  let hmppsAuthClient: jest.Mocked<AuthenticationClient>
  let prisonApi: jest.Mocked<PrisonApi>

  beforeEach(() => {
    hmppsAuthClient = AuthenticationClient.prototype as jest.Mocked<AuthenticationClient>
    hmppsAuthClient.getToken.mockResolvedValueOnce('test-system-token')

    prisonApi = PrisonApi.prototype as jest.Mocked<PrisonApi>
    prisonApi.getPecsRegions.mockResolvedValueOnce({
      [pecsNorth.agencyId]: pecsNorth,
      [pecsSouth.agencyId]: pecsSouth,
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should load data from prison-api', done => {
    // clear all cached regions
    pecsRegions.splice(0, pecsRegions.length)

    const middleware = setUpPecsRegions({ hmppsAuthClient } as unknown as Services)
    const req = {} as Request
    const res = {} as Response
    middleware(req, res, (...nextArgs) => {
      expect(nextArgs).toHaveLength(0) // next function called with no args
      expect(prisonApi.getPecsRegions).toHaveBeenCalledWith(false)
      expect(pecsRegions).toEqual([pecsNorthRegion, pecsSouthRegion])

      done()
    })
  })

  it('should not load data once regions are set up', done => {
    // set previously cached regions
    pecsRegions.splice(0, pecsRegions.length, pecsNorthRegion, pecsSouthRegion)

    const middleware = setUpPecsRegions({ hmppsAuthClient } as unknown as Services)
    const req = {} as Request
    const res = {} as Response
    middleware(req, res, (...nextArgs) => {
      expect(nextArgs).toHaveLength(0) // next function called with no args
      expect(hmppsAuthClient.getToken).not.toHaveBeenCalled()
      expect(prisonApi.getPecsRegions).not.toHaveBeenCalled()
      expect(pecsRegions).toEqual([pecsNorthRegion, pecsSouthRegion])

      done()
    })
  })

  it('should forward errors as 503 service unavailable', done => {
    // clear all cached regions
    pecsRegions.splice(0, pecsRegions.length)

    const error = mockThrownError(mockErrorResponse({ status: 500, message: 'External problem' }), 500)
    prisonApi.getPecsRegions.mockReset()
    prisonApi.getPecsRegions.mockRejectedValueOnce(error)

    const middleware = setUpPecsRegions({ hmppsAuthClient } as unknown as Services)
    const req = {} as Request
    const res = {} as Response
    middleware(req, res, (...nextArgs) => {
      // next function called with error
      expect(nextArgs).toEqual([expect.objectContaining({ message: 'Service Unavailable', status: 503 })])

      expect(prisonApi.getPecsRegions).toHaveBeenCalledWith(false)
      expect(pecsRegions).toEqual([])

      done()
    })
  })
})
