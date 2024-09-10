import type { Locals, NextFunction, Request, Response } from 'express'

import protectRoute from './protectRoute'

describe('protectRoute', () => {
  const req = {} as unknown as jest.Mocked<Request>
  const res = {
    locals: { userHasRole: jest.fn() },
  } as unknown as jest.Mocked<Response<unknown, jest.Mocked<Locals>>>
  const next: jest.Mock<NextFunction> = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('when user is missing required role', () => {
    it('should call next with 403 forbidden error', () => {
      res.locals.userHasRole.mockReturnValue(false)
      protectRoute('required_role')(req, res, next)

      expect(next).toHaveBeenLastCalledWith(new Error("Forbidden. Missing role 'required_role'"))
      expect(next).toHaveBeenLastCalledWith(expect.objectContaining({ status: 403 }))
    })
  })

  describe('when user has required role', () => {
    it('should call next without error', () => {
      res.locals.userHasRole.mockReturnValue(true)
      protectRoute('required_role')(req, res, next)

      expect(next).toHaveBeenLastCalledWith()
    })
  })
})
