import type { Request, Response, NextFunction } from 'express'

import { now } from '../testutils/fakeClock'
import { mockUser, unauthorisedUser, reportingUser, approverUser, hqUser } from '../data/testData/users'
import { Permissions, isPrisonActiveInService, setupPermissions, logoutIf } from './permissions'
import config from '../config'
import { roleReadOnly, roleReadWrite, roleApproveReject, rolePecs } from '../data/constants'
import { convertReportDates } from '../data/incidentReportingApiUtils'
import { mockReport } from '../data/testData/incidentReporting'
import { makeMockCaseload } from '../data/testData/frontendComponents'
import { mockPecsRegions, resetPecsRegions } from '../data/testData/pecsRegions'
import { brixton, leeds, moorland } from '../data/testData/prisonApi'

const granted = 'granted' as const
const denied = 'denied' as const

interface UserType {
  /** Most tests use this description since they are affected by roles and caseloads */
  description: string
  /** Some tests use this description since they are not affected by caseloads */
  descriptionIgnoringCaseload?: string
  user: Express.User
}

const notLoggedIn: UserType = {
  description: 'missing user',
  descriptionIgnoringCaseload: 'missing user',
  user: undefined,
}
const unauthorisedNotInLeeds: UserType = {
  description: 'user without roles or Leeds caseload',
  descriptionIgnoringCaseload: 'user without roles',
  user: unauthorisedUser,
}
const unauthorisedInLeeds: UserType = {
  description: 'user without roles but with Leeds caseload',
  user: mockUser([makeMockCaseload(leeds)]),
}
const reportingNotInLeeds: UserType = {
  description: 'reporting officer without Leeds caseload',
  descriptionIgnoringCaseload: 'reporting officer',
  user: reportingUser,
}
const reportingInLeeds: UserType = {
  description: 'reporting officer with Leeds caseload',
  user: mockUser([makeMockCaseload(leeds)], [roleReadWrite]),
}
const reportingInLeedsWithPecs: UserType = {
  description: 'reporting officer with Leeds caseload and PECS role',
  user: mockUser([makeMockCaseload(leeds)], [roleReadWrite, rolePecs]),
}
const approverNotInLeeds: UserType = {
  description: 'data warden without Leeds caseload',
  descriptionIgnoringCaseload: 'data warden',
  user: mockUser([makeMockCaseload(moorland)], [roleApproveReject, rolePecs]),
}
const approverInLeeds: UserType = { description: 'data warden with Leeds caseload', user: approverUser }
const approverInLeedsWithoutPecs: UserType = {
  description: 'data warden with Leeds caseload missing PECS role',
  user: mockUser([makeMockCaseload(leeds)], [roleApproveReject]),
}
const viewOnlyNotInLeeds: UserType = {
  description: 'HQ view-only user without Leeds caseload',
  descriptionIgnoringCaseload: 'HQ view-only user',
  user: mockUser([makeMockCaseload(moorland)], [roleReadOnly]),
}
const viewOnlyInLeeds: UserType = { description: 'HQ view-only user with Leeds caseload', user: hqUser }
const viewOnlyInLeedsWithPecs: UserType = {
  description: 'HQ view-only user with Leeds caseload and PECS role',
  user: mockUser([makeMockCaseload(moorland), makeMockCaseload(leeds)], [roleReadOnly, rolePecs]),
}

describe('Permissions', () => {
  let previousActivePrisons: string[]
  let previousActiveForPecsRegions: boolean

  beforeAll(() => {
    previousActivePrisons = config.activePrisons
    previousActiveForPecsRegions = config.activeForPecsRegions
    mockPecsRegions()
  })

  afterAll(() => {
    resetPecsRegions()
  })

  afterEach(() => {
    config.activePrisons = previousActivePrisons
    config.activeForPecsRegions = previousActiveForPecsRegions
  })

  describe('Class performs checks', () => {
    beforeEach(() => {
      config.activePrisons = ['MDI', 'LEI']
      config.activeForPecsRegions = true
    })

    // mock reports in Leeds
    const mockReports = [true, false].map(withDetails =>
      convertReportDates(mockReport({ reportReference: '6543', reportDateAndTime: now, location: 'LEI', withDetails })),
    )
    // mock reports in a PECS region
    const mockPecsReports = [true, false].map(withDetails =>
      convertReportDates(
        mockReport({ reportReference: '6544', reportDateAndTime: now, location: 'NORTH', withDetails }),
      ),
    )

    describe('Access to the service', () => {
      it.each([
        { userType: notLoggedIn, action: denied },
        { userType: unauthorisedNotInLeeds, action: denied },
        { userType: reportingNotInLeeds, action: granted },
        { userType: approverNotInLeeds, action: granted },
        { userType: viewOnlyNotInLeeds, action: granted },
      ])('should be $action to $userType.descriptionIgnoringCaseload', ({ userType: { user }, action }) => {
        const permissions = new Permissions(user)
        expect(permissions.canAccessService).toBe(action === granted)
      })
    })

    describe('Viewing a report', () => {
      describe('in Leeds', () => {
        it.each([
          { userType: notLoggedIn, action: denied },
          { userType: unauthorisedNotInLeeds, action: denied },
          { userType: unauthorisedInLeeds, action: denied },
          { userType: reportingNotInLeeds, action: denied },
          { userType: reportingInLeeds, action: granted },
          { userType: reportingInLeedsWithPecs, action: granted },
          { userType: approverNotInLeeds, action: denied },
          { userType: approverInLeeds, action: granted },
          { userType: approverInLeedsWithoutPecs, action: granted },
          { userType: viewOnlyNotInLeeds, action: denied },
          { userType: viewOnlyInLeeds, action: granted },
          { userType: viewOnlyInLeedsWithPecs, action: granted },
        ])('should be $action to $userType.description', ({ userType: { user }, action }) => {
          const permissions = new Permissions(user)
          expect(mockReports.every(report => permissions.canViewReport(report))).toBe(action === granted)
        })
      })

      describe('in a PECS region', () => {
        it.each([
          { userType: notLoggedIn, action: denied },
          { userType: unauthorisedNotInLeeds, action: denied },
          { userType: unauthorisedInLeeds, action: denied },
          { userType: reportingNotInLeeds, action: denied },
          { userType: reportingInLeeds, action: denied },
          { userType: reportingInLeedsWithPecs, action: granted },
          { userType: approverNotInLeeds, action: granted },
          { userType: approverInLeeds, action: granted },
          { userType: approverInLeedsWithoutPecs, action: denied },
          { userType: viewOnlyNotInLeeds, action: denied },
          { userType: viewOnlyInLeeds, action: denied },
          { userType: viewOnlyInLeedsWithPecs, action: granted },
        ])('should be $action to $userType.description', ({ userType: { user }, action }) => {
          const permissions = new Permissions(user)
          expect(mockPecsReports.every(report => permissions.canViewReport(report))).toBe(action === granted)
        })
      })
    })

    describe('Creating a new report', () => {
      describe('ignoring caseloads', () => {
        it.each([
          { userType: notLoggedIn, action: denied },
          { userType: unauthorisedNotInLeeds, action: denied },
          { userType: reportingNotInLeeds, action: granted },
          { userType: approverNotInLeeds, action: granted },
          { userType: viewOnlyNotInLeeds, action: denied },
        ])('should by $action to $userType.descriptionIgnoringCaseload', ({ userType: { user }, action }) => {
          const permissions = new Permissions(user)
          expect(permissions.canCreateReport).toBe(action === granted)
        })
      })

      describe('in Leeds', () => {
        it.each([
          { userType: notLoggedIn, action: denied },
          { userType: unauthorisedNotInLeeds, action: denied },
          { userType: unauthorisedInLeeds, action: denied },
          { userType: reportingNotInLeeds, action: denied },
          { userType: reportingInLeeds, action: granted },
          { userType: reportingInLeedsWithPecs, action: granted },
          { userType: approverNotInLeeds, action: denied },
          { userType: approverInLeeds, action: denied },
          { userType: approverInLeedsWithoutPecs, action: denied },
          { userType: viewOnlyNotInLeeds, action: denied },
          { userType: viewOnlyInLeeds, action: denied },
          { userType: viewOnlyInLeedsWithPecs, action: denied },
        ])('should be $action to $userType.description', ({ userType: { user }, action }) => {
          const permissions = new Permissions(user)
          expect(permissions.canCreateReportInLocation('LEI')).toBe(action === granted)
        })
      })

      describe('in active caseload', () => {
        it.each([
          { userType: notLoggedIn, action: denied },
          { userType: unauthorisedNotInLeeds, action: denied },
          {
            userType: {
              descriptionIgnoringCaseload: 'reporting officer whose active caseload is active in the service',
              user: mockUser([makeMockCaseload(leeds), makeMockCaseload(brixton)], [roleReadWrite]),
            },
            action: granted,
          },
          {
            userType: {
              descriptionIgnoringCaseload: 'reporting officer whose active caseload is inactive in the service',
              user: mockUser([makeMockCaseload(brixton), makeMockCaseload(leeds)], [roleReadWrite]),
            },
            action: denied,
          },
          {
            userType: {
              descriptionIgnoringCaseload: 'data warden whose active caseload is active in the service',
              user: mockUser([makeMockCaseload(leeds), makeMockCaseload(brixton)], [roleApproveReject, rolePecs]),
            },
            action: denied,
          },
          {
            userType: {
              descriptionIgnoringCaseload: 'data warden whose active caseload is inactive in the service',
              user: mockUser([makeMockCaseload(brixton), makeMockCaseload(leeds)], [roleApproveReject, rolePecs]),
            },
            action: denied,
          },
          { userType: viewOnlyNotInLeeds, action: denied },
        ])('should be $action to $userType.descriptionIgnoringCaseload', ({ userType: { user }, action }) => {
          const permissions = new Permissions(user)
          expect(permissions.canCreateReportInActiveCaseload).toBe(action === granted)
        })
      })

      describe('in a PECS region', () => {
        it.each([
          { userType: notLoggedIn, action: denied },
          { userType: unauthorisedNotInLeeds, action: denied },
          { userType: unauthorisedInLeeds, action: denied },
          { userType: reportingNotInLeeds, action: denied },
          { userType: reportingInLeeds, action: denied },
          { userType: reportingInLeedsWithPecs, action: denied },
          { userType: approverNotInLeeds, action: granted },
          { userType: approverInLeeds, action: granted },
          { userType: approverInLeedsWithoutPecs, action: denied },
          { userType: viewOnlyNotInLeeds, action: denied },
          { userType: viewOnlyInLeeds, action: denied },
          { userType: viewOnlyInLeedsWithPecs, action: denied },
        ])('should be $action to $userType.description', ({ userType: { user }, action }) => {
          const permissions = new Permissions(user)
          expect(permissions.canCreateReportInLocation('NORTH')).toBe(action === granted)
        })
      })
    })

    describe('Editing a report', () => {
      describe('in Leeds', () => {
        it.each([
          { userType: notLoggedIn, action: denied },
          { userType: unauthorisedNotInLeeds, action: denied },
          { userType: unauthorisedInLeeds, action: denied },
          { userType: reportingNotInLeeds, action: denied },
          { userType: reportingInLeeds, action: granted },
          { userType: reportingInLeedsWithPecs, action: granted },
          { userType: approverNotInLeeds, action: denied },
          { userType: approverInLeeds, action: denied },
          { userType: approverInLeedsWithoutPecs, action: denied },
          { userType: viewOnlyNotInLeeds, action: denied },
          { userType: viewOnlyInLeeds, action: denied },
          { userType: viewOnlyInLeedsWithPecs, action: denied },
        ])('should be $action to $userType.description', ({ userType: { user }, action }) => {
          const permissions = new Permissions(user)
          expect(mockReports.every(report => permissions.canEditReport(report))).toBe(action === granted)
        })

        it.each([
          { userType: notLoggedIn, action: denied },
          { userType: unauthorisedNotInLeeds, action: denied },
          { userType: unauthorisedInLeeds, action: denied },
          { userType: reportingNotInLeeds, action: denied },
          { userType: reportingInLeeds, action: granted },
          { userType: reportingInLeedsWithPecs, action: granted },
          { userType: approverNotInLeeds, action: denied },
          { userType: approverInLeeds, action: granted },
          { userType: approverInLeedsWithoutPecs, action: granted },
          { userType: viewOnlyNotInLeeds, action: denied },
          { userType: viewOnlyInLeeds, action: denied },
          { userType: viewOnlyInLeedsWithPecs, action: denied },
        ])(
          'should be $action to $userType.description only in NOMIS when Leeds is inactive in DPS',
          ({ userType: { user }, action }) => {
            config.activePrisons = ['MDI']

            const permissions = new Permissions(user)
            expect(mockReports.every(report => permissions.canEditReport(report))).toBe(false)
            expect(mockReports.every(report => permissions.canEditReportInNomisOnly(report))).toBe(action === granted)
          },
        )
      })

      describe('in a PECS region', () => {
        it.each([
          { userType: notLoggedIn, action: denied },
          { userType: unauthorisedNotInLeeds, action: denied },
          { userType: unauthorisedInLeeds, action: denied },
          { userType: reportingNotInLeeds, action: denied },
          { userType: reportingInLeeds, action: denied },
          { userType: reportingInLeedsWithPecs, action: denied },
          { userType: approverNotInLeeds, action: granted },
          { userType: approverInLeeds, action: granted },
          { userType: approverInLeedsWithoutPecs, action: denied },
          { userType: viewOnlyNotInLeeds, action: denied },
          { userType: viewOnlyInLeeds, action: denied },
          { userType: viewOnlyInLeedsWithPecs, action: denied },
        ])('should be $action to $userType.description', ({ userType: { user }, action }) => {
          const permissions = new Permissions(user)
          expect(mockPecsReports.every(report => permissions.canEditReport(report))).toBe(action === granted)
        })

        it.each([
          { userType: notLoggedIn, action: denied },
          { userType: unauthorisedNotInLeeds, action: denied },
          { userType: unauthorisedInLeeds, action: denied },
          { userType: reportingNotInLeeds, action: denied },
          { userType: reportingInLeeds, action: denied },
          { userType: reportingInLeedsWithPecs, action: denied },
          { userType: approverNotInLeeds, action: granted },
          { userType: approverInLeeds, action: granted },
          { userType: approverInLeedsWithoutPecs, action: denied },
          { userType: viewOnlyNotInLeeds, action: denied },
          { userType: viewOnlyInLeeds, action: denied },
          { userType: viewOnlyInLeedsWithPecs, action: denied },
        ])(
          'should be $action to $userType.description only in NOMIS when PECS reports are inactive in DPS',
          ({ userType: { user }, action }) => {
            config.activeForPecsRegions = false

            const permissions = new Permissions(user)
            expect(mockPecsReports.every(report => permissions.canEditReport(report))).toBe(false)
            expect(mockPecsReports.every(report => permissions.canEditReportInNomisOnly(report))).toBe(
              action === granted,
            )
          },
        )
      })
    })

    describe('Approving or rejecting a report', () => {
      describe('in Leeds', () => {
        it.each([
          { userType: notLoggedIn, action: denied },
          { userType: unauthorisedNotInLeeds, action: denied },
          { userType: unauthorisedInLeeds, action: denied },
          { userType: reportingNotInLeeds, action: denied },
          { userType: reportingInLeeds, action: denied },
          { userType: reportingInLeedsWithPecs, action: denied },
          { userType: approverNotInLeeds, action: denied },
          { userType: approverInLeeds, action: granted },
          { userType: approverInLeedsWithoutPecs, action: granted },
          { userType: viewOnlyNotInLeeds, action: denied },
          { userType: viewOnlyInLeeds, action: denied },
          { userType: viewOnlyInLeedsWithPecs, action: denied },
        ])('should be $action to $userType.description', ({ userType: { user }, action }) => {
          const permissions = new Permissions(user)
          expect(mockReports.every(report => permissions.canApproveOrRejectReport(report))).toBe(action === granted)
        })
      })

      describe('in a PECS region', () => {
        it.each([
          { userType: notLoggedIn, action: denied },
          { userType: unauthorisedNotInLeeds, action: denied },
          { userType: unauthorisedInLeeds, action: denied },
          { userType: reportingNotInLeeds, action: denied },
          { userType: reportingInLeeds, action: denied },
          { userType: reportingInLeedsWithPecs, action: denied },
          { userType: approverNotInLeeds, action: granted },
          { userType: approverInLeeds, action: granted },
          { userType: approverInLeedsWithoutPecs, action: denied },
          { userType: viewOnlyNotInLeeds, action: denied },
          { userType: viewOnlyInLeeds, action: denied },
          { userType: viewOnlyInLeedsWithPecs, action: denied },
        ])('should be $action to $userType.description', ({ userType: { user }, action }) => {
          const permissions = new Permissions(user)
          expect(mockPecsReports.every(report => permissions.canApproveOrRejectReport(report))).toBe(action === granted)
        })
      })
    })
  })

  describe('Middleware', () => {
    it.each([notLoggedIn, unauthorisedNotInLeeds, reportingNotInLeeds, approverNotInLeeds, viewOnlyNotInLeeds])(
      'should attach permissions class to locals for $descriptionIgnoringCaseload',
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
