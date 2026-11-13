import type { Request, Response } from 'express'
import { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'

import { RegisterAgencyType } from '../data/constants'
import { PrisonRegisterApi } from '../data/prisonRegisterApi'
import { type PecsRegion, pecsRegions } from '../data/pecsRegions'
import { mockErrorResponse } from '../data/testData/incidentReporting'
import { nouRegion, pecsNorthRegion, pecsSouthRegion } from '../data/testData/pecsRegions'
import { pecsNorth, pecsNou, pecsSouth } from '../data/testData/prisonRegister'
import { mockThrownError } from '../data/testData/thrownErrors'
import type { Services } from '../services'
import setUpPecsRegions from './setUpPecsRegions'

jest.mock('@ministryofjustice/hmpps-auth-clients')
jest.mock('../data/prisonRegisterApi')

const hmppsAuthClient = AuthenticationClient.prototype as jest.Mocked<AuthenticationClient>
const prisonRegisterApi = PrisonRegisterApi.prototype as jest.Mocked<PrisonRegisterApi>

describe('Loading PECS regions', () => {
  let previousPecsRegions: PecsRegion[]

  beforeAll(() => {
    previousPecsRegions = pecsRegions.splice(0, pecsRegions.length)
  })

  afterAll(() => {
    pecsRegions.splice(0, pecsRegions.length, ...previousPecsRegions)
  })

  beforeEach(() => {
    hmppsAuthClient.getToken.mockResolvedValueOnce('test-system-token')
    prisonRegisterApi.getPecsRegions.mockResolvedValueOnce([pecsNorth, pecsSouth, pecsNou])
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should load data from Prison Register', done => {
    // clear all cached regions
    pecsRegions.splice(0, pecsRegions.length)

    const middleware = setUpPecsRegions({ hmppsAuthClient } as unknown as Services)
    const req = {} as Request
    const res = {} as Response
    middleware(req, res, (...nextArgs) => {
      expect(nextArgs).toHaveLength(0) // next function called with no args
      expect(prisonRegisterApi.getPecsRegions).toHaveBeenCalledWith(false)
      expect(pecsRegions).toEqual([pecsNorthRegion, pecsSouthRegion, nouRegion])

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
      expect(prisonRegisterApi.getPecsRegions).not.toHaveBeenCalled()
      expect(pecsRegions).toEqual([pecsNorthRegion, pecsSouthRegion])

      done()
    })
  })

  it('should sort loaded regions with active ones coming first', done => {
    // clear all cached regions
    pecsRegions.splice(0, pecsRegions.length)

    // return an unordered region set
    prisonRegisterApi.getPecsRegions.mockReset()
    prisonRegisterApi.getPecsRegions.mockResolvedValueOnce([
      {
        agencyId: 'P4',
        description: 'PECS 4',
        agencyType: RegisterAgencyType.PECS,
        active: true,
      },
      {
        agencyId: 'P3',
        description: 'PECS 3',
        agencyType: RegisterAgencyType.PECS,
        active: false,
      },
      {
        agencyId: 'P2',
        description: 'PECS 2',
        agencyType: RegisterAgencyType.PECS,
        active: true,
      },
      {
        agencyId: 'P1',
        description: 'PECS 1',
        agencyType: RegisterAgencyType.PECS,
        active: false,
      },
    ])

    const middleware = setUpPecsRegions({ hmppsAuthClient } as unknown as Services)
    const req = {} as Request
    const res = {} as Response
    middleware(req, res, (...nextArgs) => {
      expect(nextArgs).toHaveLength(0) // next function called with no args
      expect(prisonRegisterApi.getPecsRegions).toHaveBeenCalledWith(false)
      expect(pecsRegions.map(pecsRegion => pecsRegion.code)).toEqual(['P2', 'P4', 'P1', 'P3'])

      done()
    })
  })

  it('should forward errors as 503 service unavailable', done => {
    // clear all cached regions
    pecsRegions.splice(0, pecsRegions.length)

    const error = mockThrownError(mockErrorResponse({ status: 500, message: 'External problem' }), 500)
    prisonRegisterApi.getPecsRegions.mockReset()
    prisonRegisterApi.getPecsRegions.mockRejectedValueOnce(error)

    const middleware = setUpPecsRegions({ hmppsAuthClient } as unknown as Services)
    const req = {} as Request
    const res = {} as Response
    middleware(req, res, (...nextArgs) => {
      // next function called with error
      expect(nextArgs).toEqual([expect.objectContaining({ message: 'Service Unavailable', status: 503 })])

      expect(prisonRegisterApi.getPecsRegions).toHaveBeenCalledWith(false)
      expect(pecsRegions).toEqual([])

      done()
    })
  })
})
