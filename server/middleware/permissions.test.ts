import type { Request, Response, NextFunction } from 'express'

import { unauthorisedUser, user as reportingUser, approverUser, hqUser } from '../routes/testutils/appSetup'
import { Permissions, setupPermissions } from './permissions'

const grant = 'grant' as const
const deny = 'deny' as const

describe('Permissions', () => {
  describe('Class performs checks', () => {
    it.each([
      { action: deny, userType: 'missing user', user: undefined },
      { action: deny, userType: 'user without roles', user: unauthorisedUser },
      { action: grant, userType: 'reporting officer', user: reportingUser },
      { action: grant, userType: 'data warden', user: approverUser },
      { action: grant, userType: 'HQ read-only user', user: hqUser },
    ])('should $action access to the service for $userType', ({ action, user }) => {
      const permissions = new Permissions(user)
      if (action === 'grant') {
        expect(permissions.canAccessService).toBe(true)
      } else if (action === 'deny') {
        expect(permissions.canAccessService).toBe(false)
      } else {
        throw new Error('test setup error')
      }
    })

    it.each([
      { action: deny, userType: 'missing user', user: undefined },
      { action: deny, userType: 'user without roles or Leeds caseload', user: unauthorisedUser },
      { action: deny, userType: 'reporting officer without Leeds caseload', user: reportingUser },
      { action: grant, userType: 'data warden with Leeds caseload', user: approverUser },
      { action: grant, userType: 'HQ read-only user with Leeds caseload', user: hqUser },
      // TODO: add region and PECS checks once clarified
      // TODO: can approver access caseloads outside of their own set?
    ])('should $action $userType access to Leeds', ({ action, user }) => {
      const permissions = new Permissions(user)
      if (action === 'grant') {
        expect(permissions.canAccessCaseload('LEI')).toBe(true)
      } else if (action === 'deny') {
        expect(permissions.canAccessCaseload('LEI')).toBe(false)
      } else {
        throw new Error('test setup error')
      }
    })
  })

  describe('Middleware', () => {
    it.each([
      { userType: 'missing user', user: undefined },
      { userType: 'user without roles', user: unauthorisedUser },
      { userType: 'reporting officer', user: reportingUser },
      { userType: 'data warden', user: approverUser },
      { userType: 'HQ read-only user', user: hqUser },
    ])('should attach permissions class to locals for $userType', ({ user }) => {
      const req = {} as Request
      const res = { locals: { user } } as Response
      const next: NextFunction = jest.fn()
      setupPermissions(req, res, next)
      expect(next).toHaveBeenCalled()
      expect(res.locals.permissions).toBeInstanceOf(Permissions)
    })
  })
})
