import type { Request, Response, NextFunction } from 'express'

import { now } from '../testutils/fakeClock'
import { mockUser, unauthorisedUser, reportingUser, approverUser, hqUser } from '../data/testData/users'
import { Permissions, isPrisonActiveInService, setupPermissions, logoutIf } from './permissions'
import config from '../config'
import { roleReadOnly, roleReadWrite, roleApproveReject } from '../data/constants'
import { convertReportDates } from '../data/incidentReportingApiUtils'
import { mockReport } from '../data/testData/incidentReporting'
import { makeMockCaseload } from '../data/testData/frontendComponents'
import { leeds, moorland } from '../data/testData/prisonApi'

interface UserType {
  description: string
  user: Express.User
}

const notLoggedIn: UserType = { description: 'missing user', user: undefined }
const unauthorisedNotInLeeds: UserType = {
  description: 'user without roles or Leeds caseload',
  user: unauthorisedUser,
}
const unauthorisedInLeeds: UserType = {
  description: 'user without roles but with Leeds caseload',
  user: mockUser([makeMockCaseload(leeds)]),
}
const reportingNotInLeeds: UserType = {
  description: 'reporting officer without Leeds caseload',
  user: reportingUser,
}
const reportingInLeeds: UserType = {
  description: 'reporting officer with Leeds caseload',
  user: mockUser([makeMockCaseload(leeds)], [roleReadWrite]),
}
const approverNotInLeeds: UserType = {
  description: 'data warden without Leeds caseload',
  user: mockUser([makeMockCaseload(moorland)], [roleApproveReject]),
}
const approverInLeeds: UserType = { description: 'data warden with Leeds caseload', user: approverUser }
const viewOnlyNotInLeeds: UserType = {
  description: 'HQ view-only user without Leeds caseload',
  user: mockUser([makeMockCaseload(moorland)], [roleReadOnly]),
}
const viewOnlyInLeeds: UserType = { description: 'HQ view-only user with Leeds caseload', user: hqUser }

describe('Permissions', () => {
  let previousActivePrisons: string[]

  beforeAll(() => {
    previousActivePrisons = config.activePrisons
  })

  afterEach(() => {
    config.activePrisons = previousActivePrisons
  })

  describe('Class performs checks', () => {
    const grant = 'grant' as const
    const deny = 'deny' as const

    beforeEach(() => {
      config.activePrisons = ['MDI', 'LEI']
    })

    // mock reports in Leeds
    const mockReports = [true, false].map(withDetails =>
      convertReportDates(mockReport({ reportReference: '6543', reportDateAndTime: now, location: 'LEI', withDetails })),
    )

    it.each([
      { userType: notLoggedIn, action: deny },
      { userType: unauthorisedNotInLeeds, action: deny },
      { userType: reportingNotInLeeds, action: grant },
      { userType: approverNotInLeeds, action: grant },
      { userType: viewOnlyNotInLeeds, action: grant },
    ])('should $action access to the service for $userType.description', ({ userType: { user }, action }) => {
      const permissions = new Permissions(user)
      expect(permissions.canAccessService).toBe(action === 'grant')
    })

    it.each([
      { userType: notLoggedIn, action: deny },
      { userType: unauthorisedNotInLeeds, action: deny },
      { userType: unauthorisedInLeeds, action: deny },
      { userType: reportingNotInLeeds, action: deny },
      { userType: reportingInLeeds, action: grant },
      { userType: approverNotInLeeds, action: deny },
      { userType: approverInLeeds, action: grant },
      { userType: viewOnlyNotInLeeds, action: deny },
      { userType: viewOnlyInLeeds, action: grant },
    ])('should $action $userType.description viewing a report in Leeds', ({ userType: { user }, action }) => {
      const permissions = new Permissions(user)
      expect(mockReports.every(report => permissions.canViewReport(report))).toBe(action === 'grant')
    })

    it.each([
      { userType: notLoggedIn, action: deny },
      { userType: unauthorisedNotInLeeds, action: deny },
      { userType: reportingNotInLeeds, action: grant },
      { userType: approverNotInLeeds, action: grant },
      { userType: viewOnlyNotInLeeds, action: deny },
    ])('should $action $userType.description creating a new report', ({ userType: { user }, action }) => {
      const permissions = new Permissions(user)
      expect(permissions.canCreateReport).toBe(action === 'grant')
    })

    it.each([
      { userType: notLoggedIn, action: deny },
      { userType: unauthorisedNotInLeeds, action: deny },
      { userType: unauthorisedInLeeds, action: deny },
      { userType: reportingNotInLeeds, action: deny },
      { userType: reportingInLeeds, action: grant },
      { userType: approverNotInLeeds, action: deny },
      { userType: approverInLeeds, action: grant },
      { userType: viewOnlyNotInLeeds, action: deny },
      { userType: viewOnlyInLeeds, action: deny },
    ])('should $action $userType.description editing a report in Leeds', ({ userType: { user }, action }) => {
      const permissions = new Permissions(user)
      expect(mockReports.every(report => permissions.canEditReport(report))).toBe(action === 'grant')
    })

    it.each([
      { userType: notLoggedIn, action: deny },
      { userType: unauthorisedNotInLeeds, action: deny },
      { userType: unauthorisedInLeeds, action: deny },
      { userType: reportingNotInLeeds, action: deny },
      { userType: reportingInLeeds, action: deny },
      { userType: approverNotInLeeds, action: deny },
      { userType: approverInLeeds, action: grant },
      { userType: viewOnlyNotInLeeds, action: deny },
      { userType: viewOnlyInLeeds, action: deny },
    ])(
      'should $action $userType.description approving or rejecting a report in Leeds',
      ({ userType: { user }, action }) => {
        const permissions = new Permissions(user)
        expect(mockReports.every(report => permissions.canApproveOrRejectReport(report))).toBe(action === 'grant')
      },
    )
  })

  describe('Middleware', () => {
    it.each([notLoggedIn, unauthorisedNotInLeeds, reportingNotInLeeds, approverNotInLeeds, viewOnlyNotInLeeds])(
      'should attach permissions class to locals for $description',
      ({ user }) => {
        const req = {} as Request
        const res = { locals: { user } } as Response
        const next: NextFunction = jest.fn()
        setupPermissions(req, res, next)
        expect(next).toHaveBeenCalledWith()
        expect(res.locals.permissions).toBeInstanceOf(Permissions)
      },
    )

    describe('Conditional logout', () => {
      it('should send a forbidden 403 error to next request handler if condition evaluates to true', () => {
        const middleware = logoutIf((permissions, res) => {
          expect(permissions).toBeInstanceOf(Permissions)
          expect(res.locals).toHaveProperty('user')
          return true
        })
        const req = {} as Request
        const res = { locals: { user: undefined } } as Response
        const next: NextFunction = jest.fn()
        setupPermissions(req, res, next)
        middleware(req, res, next)
        expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: 'Forbidden', status: 403 }))
      })

      it('should forward to next request handler if condition evaluates to false', () => {
        const middleware = logoutIf(permissions => {
          expect(permissions).toBeInstanceOf(Permissions)
          return false
        })
        const req = {} as Request
        const res = { locals: { user: undefined } } as Response
        const next: NextFunction = jest.fn()
        setupPermissions(req, res, next)
        middleware(req, res, next)
        expect(next).toHaveBeenCalledWith()
      })
    })
  })

  describe('Active prison helper function', () => {
    it('should always return true if all prisons are permitted', () => {
      config.activePrisons = ['***']

      const prisons = [undefined, null, '', 'MDI', 'LEI']
      for (const prison of prisons) {
        expect(isPrisonActiveInService(prison)).toBe(true)
      }
    })

    it('should always return false if no prisons are permitted', () => {
      config.activePrisons = []

      const prisons = [undefined, null, '', 'MDI', 'LEI']
      for (const prison of prisons) {
        expect(isPrisonActiveInService(prison)).toBe(false)
      }
    })

    it('should check prison against configured list', () => {
      config.activePrisons = ['BXI', 'LEI']

      expect(isPrisonActiveInService(undefined)).toBe(false)
      expect(isPrisonActiveInService(null)).toBe(false)
      expect(isPrisonActiveInService('')).toBe(false)
      expect(isPrisonActiveInService('BXI')).toBe(true)
      expect(isPrisonActiveInService('LEI')).toBe(true)
      expect(isPrisonActiveInService('MDI')).toBe(false)
      expect(isPrisonActiveInService('OWI')).toBe(false)
    })
  })
})
