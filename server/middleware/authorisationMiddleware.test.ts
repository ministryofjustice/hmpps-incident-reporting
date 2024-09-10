import type { Request, Response } from 'express'

import type { Services } from '../services'
import createUserToken from '../testutils/createUserToken'
import authorisationMiddleware from './authorisationMiddleware'

describe('authorisationMiddleware', () => {
  const services = {} as unknown as jest.Mocked<Services>
  const req = {
    session: {},
  } as unknown as jest.Mocked<Request>
  const next = jest.fn()

  function createResWithToken({ authorities }: { authorities: string[] }): Response {
    return {
      locals: {
        user: {
          token: createUserToken(authorities),
        },
      },
      redirect: jest.fn(),
    } as unknown as Response
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should return next when no required roles', () => {
    const res = createResWithToken({ authorities: [] })

    authorisationMiddleware(services)(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(res.redirect).not.toHaveBeenCalled()
  })

  it('should redirect when user has no authorised roles', () => {
    const res = createResWithToken({ authorities: [] })

    authorisationMiddleware(services, ['SOME_REQUIRED_ROLE'])(req, res, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledWith('/authError')
  })

  it('should return next when user has authorised role', () => {
    const res = createResWithToken({ authorities: ['ROLE_SOME_REQUIRED_ROLE'] })

    authorisationMiddleware(services, ['SOME_REQUIRED_ROLE'])(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(res.redirect).not.toHaveBeenCalled()
  })

  it('should return next when user has authorised role and middleware created with ROLE_ prefix', () => {
    const res = createResWithToken({ authorities: ['ROLE_SOME_REQUIRED_ROLE'] })

    authorisationMiddleware(services, ['ROLE_SOME_REQUIRED_ROLE'])(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(res.redirect).not.toHaveBeenCalled()
  })

  describe('attaches userHasRoles function to res.locals', () => {
    it('should return true when a user has given role', () => {
      const res = createResWithToken({ authorities: ['ROLE_ADMIN'] })
      res.locals.user.roles = ['ADMIN']

      authorisationMiddleware(services)(req, res, next)
      expect(res.locals.userHasRole('ADMIN')).toBe(true)
    })

    it('should return false when a user does not have given role', () => {
      const res = createResWithToken({ authorities: ['ROLE_VIEWER'] })
      res.locals.user.roles = ['VIEWER']

      authorisationMiddleware(services)(req, res, next)
      expect(res.locals.userHasRole('ADMIN')).toBe(false)
    })
  })
})
