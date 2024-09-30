import type { NextFunction, Request, Response } from 'express'
import nock from 'nock'

import config from '../config'
import { andrew } from '../data/testData/offenderSearch'
import { populatePrisoner } from './populatePrisoner'
import { OffenderSearchApi } from '../data/offenderSearchApi'

describe('prisoner-loading middleware', () => {
  let fakeApi: nock.Scope

  const next: NextFunction = jest.fn()

  beforeEach(() => {
    fakeApi = nock(config.apis.offenderSearchApi.url)
  })

  afterEach(() => {
    jest.resetAllMocks()
    nock.cleanAll()
  })

  it('should call next request handler if prisoner can be loaded', async () => {
    fakeApi.get('/prisoner/A1234BC').reply(200, andrew)

    const req = { params: { prisonerNumber: 'A1234BC' } } as unknown as Request
    const res = { locals: { apis: { offenderSearchApi: new OffenderSearchApi('token') } } } as Response
    await populatePrisoner()(req, res, next)

    expect(next).toHaveBeenCalledWith()
    expect(res.locals.prisoner).toEqual(andrew)
  })

  it('should forward error if prisoner cannot be loaded', async () => {
    fakeApi.get('/prisoner/A1234BC').reply(404)

    const req = { params: { prisonerNumber: 'A1234BC' } } as unknown as Request
    const res = { locals: { apis: { offenderSearchApi: new OffenderSearchApi('token') } } } as Response
    await populatePrisoner()(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: 'Not Found', status: 404 }))
    expect(res.locals.prisoner).toBeUndefined()
  })
})
