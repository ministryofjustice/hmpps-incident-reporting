import type { NextFunction, Request, Response } from 'express'
import nock from 'nock'

import config from '../config'
import { mockPrisonUser } from '../data/testData/manageUsers'
import { populateStaffMember } from './populateStaffMember'

describe('staff-member-loading middleware', () => {
  let fakeApi: nock.Scope

  beforeEach(() => {
    fakeApi = nock(config.apis.manageUsersApi.url)
  })

  afterEach(() => {
    jest.resetAllMocks()
    nock.cleanAll()
  })

  it('should call next request handler if staff member can be loaded', async () => {
    const { username } = mockPrisonUser
    fakeApi.get(`/prisonusers/${username}`).reply(200, mockPrisonUser)

    const req = { params: { username } } as unknown as Request
    const res = { locals: { systemToken: 'tk1' } } as Response
    const next: NextFunction = jest.fn()

    await populateStaffMember()(req, res, next)

    expect(res.locals.staffMember).toEqual(mockPrisonUser)
    expect(next).toHaveBeenCalledWith()
  })

  it('should forward error if staff member cannot be loaded', async () => {
    const { username } = mockPrisonUser
    fakeApi.get(`/prisonusers/${username}`).reply(404)

    const req = { params: { username } } as unknown as Request
    const res = { locals: { systemToken: 'tk1' } } as Response
    const next: NextFunction = jest.fn()

    await populateStaffMember()(req, res, next)

    expect(res.locals.staffMember).toBeUndefined()
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: 'Not Found', status: 404 }))
  })

  it('should fail if staff member username parameter is not supplied', async () => {
    const req = { params: {} } as unknown as Request
    const res = { locals: { systemToken: 'tk1' } } as Response
    const next: NextFunction = jest.fn()

    await populateStaffMember()(req, res, next)

    expect(res.locals.staffMember).toBeUndefined()
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'populateStaffMember() requires req.params.username', status: 501 }),
    )
  })
})
