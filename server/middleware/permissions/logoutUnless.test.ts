import type { Request, Response, NextFunction } from 'express'

import { logoutUnless } from './logoutUnless'
import { Permissions } from './rulesClass'

describe('Conditional logout', () => {
  it('should send a forbidden 403 error to next request handler if condition evaluates to false', () => {
    const middleware = logoutUnless((permissions, res) => {
      expect(permissions).toBeInstanceOf(Permissions)
      expect(res.locals).toHaveProperty('user')
      return false
    })

    const req = {} as Request
    const res = { locals: { user: undefined } } as Response
    const next: NextFunction = jest.fn()

    Permissions.middleware(req, res, next)
    middleware(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: 'Forbidden', status: 403 }))
  })

  it('should forward to next request handler if condition evaluates to true', () => {
    const middleware = logoutUnless(permissions => {
      expect(permissions).toBeInstanceOf(Permissions)
      return true
    })

    const req = {} as Request
    const res = { locals: { user: undefined } } as Response
    const next: NextFunction = jest.fn()

    Permissions.middleware(req, res, next)
    middleware(req, res, next)

    expect(next).toHaveBeenCalledWith()
  })

  it('should fail if permissions class is not supplied', () => {
    const middleware = logoutUnless(() => true)

    const req = {} as Request
    const res = { locals: { user: undefined } } as Response
    const next: NextFunction = jest.fn()

    // pretend that Permissions.middleware was forgotten
    middleware(req, res, next)

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'logoutUnless() requires res.locals.permissions', status: 501 }),
    )
  })
})
