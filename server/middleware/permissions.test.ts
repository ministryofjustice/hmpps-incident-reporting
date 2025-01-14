import type { Request, Response, NextFunction } from 'express'

import { now } from '../testutils/fakeClock'
import { unauthorisedUser, user as reportingUser, approverUser, hqUser } from '../routes/testutils/appSetup'
import { Permissions, isPrisonActiveInService, setupPermissions } from './permissions'
import config from '../config'
import { convertReportDates } from '../data/incidentReportingApiUtils'
import { mockReport } from '../data/testData/incidentReporting'

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

    it.each([
      { action: deny, userType: 'missing user', user: undefined },
      { action: deny, userType: 'user without roles', user: unauthorisedUser },
      { action: grant, userType: 'reporting officer', user: reportingUser },
      { action: grant, userType: 'data warden', user: approverUser },
      { action: grant, userType: 'HQ read-only user', user: hqUser },
    ])('should $action access to the service for $userType', ({ action, user }) => {
      const permissions = new Permissions(user)
      expect(permissions.canAccessService).toBe(action === 'grant')
    })

    // mock reports in Leeds
    const mockReports = [true, false].map(withDetails =>
      convertReportDates(mockReport({ reportReference: '6543', reportDateAndTime: now, location: 'LEI', withDetails })),
    )

    it.each([
      { action: deny, userType: 'missing user', user: undefined },
      { action: deny, userType: 'user without roles or Leeds caseload', user: unauthorisedUser },
      { action: deny, userType: 'reporting officer without Leeds caseload', user: reportingUser },
      { action: grant, userType: 'data warden with Leeds caseload', user: approverUser },
      { action: grant, userType: 'HQ read-only user with Leeds caseload', user: hqUser },
    ])('should $action $userType viewing a report in Leeds', ({ action, user }) => {
      const permissions = new Permissions(user)
      expect(mockReports.every(report => permissions.canViewReport(report))).toBe(action === 'grant')
    })

    it.each([
      { action: deny, userType: 'missing user', user: undefined },
      { action: deny, userType: 'user without roles', user: unauthorisedUser },
      { action: grant, userType: 'reporting officer', user: reportingUser },
      { action: grant, userType: 'data warden', user: approverUser },
      { action: deny, userType: 'HQ read-only user', user: hqUser },
    ])('should $action $userType creating a new report', ({ action, user }) => {
      const permissions = new Permissions(user)
      expect(permissions.canCreateReport).toBe(action === 'grant')
    })

    it.each([
      { action: deny, userType: 'missing user', user: undefined },
      { action: deny, userType: 'user without roles or Leeds caseload', user: unauthorisedUser },
      { action: deny, userType: 'reporting officer without Leeds caseload', user: reportingUser },
      { action: grant, userType: 'data warden with Leeds caseload', user: approverUser },
      { action: deny, userType: 'HQ read-only user with Leeds caseload', user: hqUser },
    ])('should $action $userType editing a report in Leeds', ({ action, user }) => {
      const permissions = new Permissions(user)
      expect(mockReports.every(report => permissions.canEditReport(report))).toBe(action === 'grant')
    })

    it.each([
      { action: deny, userType: 'missing user', user: undefined },
      { action: deny, userType: 'user without roles or Leeds caseload', user: unauthorisedUser },
      { action: deny, userType: 'reporting officer without Leeds caseload', user: reportingUser },
      { action: grant, userType: 'data warden with Leeds caseload', user: approverUser },
      { action: deny, userType: 'HQ read-only user with Leeds caseload', user: hqUser },
    ])('should $action $userType approving or rejecting a report in Leeds', ({ action, user }) => {
      const permissions = new Permissions(user)
      expect(mockReports.every(report => permissions.canApproveOrRejectReport(report))).toBe(action === 'grant')
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
