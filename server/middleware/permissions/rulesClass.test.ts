import type { Request, Response, NextFunction } from 'express'

import { now } from '../../testutils/fakeClock'
import {
  mockUser,
  mockDataWarden,
  mockReportingOfficer,
  mockHqViewer,
  mockUnauthorisedUser,
} from '../../data/testData/users'
import config from '../../config'
import { roleReadOnly, roleReadWrite, roleApproveReject, rolePecs } from '../../data/constants'
import { convertReportDates } from '../../data/incidentReportingApiUtils'
import { mockReport } from '../../data/testData/incidentReporting'
import { makeMockCaseload } from '../../data/testData/frontendComponents'
import { mockPecsRegions, resetPecsRegions } from '../../data/testData/pecsRegions'
import { brixton, leeds, moorland } from '../../data/testData/prisonApi'
import { Permissions } from './rulesClass'

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
  user: mockUnauthorisedUser,
}
const unauthorisedInLeeds: UserType = {
  description: 'user without roles but with Leeds caseload',
  user: mockUser([makeMockCaseload(leeds)]),
}
const reportingOfficerNotInLeeds: UserType = {
  description: 'reporting officer without Leeds caseload',
  descriptionIgnoringCaseload: 'reporting officer',
  user: mockReportingOfficer,
}
const reportingOfficerInLeeds: UserType = {
  description: 'reporting officer with Leeds caseload',
  user: mockUser([makeMockCaseload(leeds)], [roleReadWrite]),
}
const reportingOfficerInLeedsWithPecs: UserType = {
  description: 'reporting officer with Leeds caseload and PECS role',
  user: mockUser([makeMockCaseload(leeds)], [roleReadWrite, rolePecs]),
}
const dataWardenNotInLeeds: UserType = {
  description: 'data warden without Leeds caseload',
  descriptionIgnoringCaseload: 'data warden',
  user: mockUser([makeMockCaseload(moorland)], [roleApproveReject, rolePecs]),
}
const dataWardenInLeeds: UserType = { description: 'data warden with Leeds caseload', user: mockDataWarden }
const dataWardenInLeedsWithoutPecs: UserType = {
  description: 'data warden with Leeds caseload missing PECS role',
  user: mockUser([makeMockCaseload(leeds)], [roleApproveReject]),
}
const hqViewerNotInLeeds: UserType = {
  description: 'HQ view-only user without Leeds caseload',
  descriptionIgnoringCaseload: 'HQ view-only user',
  user: mockUser([makeMockCaseload(moorland)], [roleReadOnly]),
}
const hqViewerInLeeds: UserType = { description: 'HQ view-only user with Leeds caseload', user: mockHqViewer }
const hqViewerInLeedsWithPecs: UserType = {
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
        { userType: reportingOfficerNotInLeeds, action: granted },
        { userType: dataWardenNotInLeeds, action: granted },
        { userType: hqViewerNotInLeeds, action: granted },
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
          { userType: reportingOfficerNotInLeeds, action: denied },
          { userType: reportingOfficerInLeeds, action: granted },
          { userType: reportingOfficerInLeedsWithPecs, action: granted },
          { userType: dataWardenNotInLeeds, action: denied },
          { userType: dataWardenInLeeds, action: granted },
          { userType: dataWardenInLeedsWithoutPecs, action: granted },
          { userType: hqViewerNotInLeeds, action: denied },
          { userType: hqViewerInLeeds, action: granted },
          { userType: hqViewerInLeedsWithPecs, action: granted },
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
          { userType: reportingOfficerNotInLeeds, action: denied },
          { userType: reportingOfficerInLeeds, action: denied },
          { userType: reportingOfficerInLeedsWithPecs, action: granted },
          { userType: dataWardenNotInLeeds, action: granted },
          { userType: dataWardenInLeeds, action: granted },
          { userType: dataWardenInLeedsWithoutPecs, action: denied },
          { userType: hqViewerNotInLeeds, action: denied },
          { userType: hqViewerInLeeds, action: denied },
          { userType: hqViewerInLeedsWithPecs, action: granted },
        ])('should be $action to $userType.description', ({ userType: { user }, action }) => {
          const permissions = new Permissions(user)
          expect(mockPecsReports.every(report => permissions.canViewReport(report))).toBe(action === granted)
        })
      })
    })

    describe('Creating a new report', () => {
      describe('in Leeds', () => {
        it.each([
          { userType: notLoggedIn, action: denied },
          { userType: unauthorisedNotInLeeds, action: denied },
          { userType: unauthorisedInLeeds, action: denied },
          { userType: reportingOfficerNotInLeeds, action: denied },
          { userType: reportingOfficerInLeeds, action: granted },
          { userType: reportingOfficerInLeedsWithPecs, action: granted },
          { userType: dataWardenNotInLeeds, action: denied },
          { userType: dataWardenInLeeds, action: denied },
          { userType: dataWardenInLeedsWithoutPecs, action: denied },
          { userType: hqViewerNotInLeeds, action: denied },
          { userType: hqViewerInLeeds, action: denied },
          { userType: hqViewerInLeedsWithPecs, action: denied },
        ])('should be $action to $userType.description', ({ userType: { user }, action }) => {
          const permissions = new Permissions(user)
          expect(permissions.canCreateReportInLocation('LEI')).toBe(action === granted)
        })

        it.each([
          { userType: notLoggedIn, action: denied },
          { userType: unauthorisedNotInLeeds, action: denied },
          { userType: unauthorisedInLeeds, action: denied },
          { userType: reportingOfficerNotInLeeds, action: denied },
          { userType: reportingOfficerInLeeds, action: granted },
          { userType: reportingOfficerInLeedsWithPecs, action: granted },
          { userType: dataWardenNotInLeeds, action: denied },
          { userType: dataWardenInLeeds, action: denied },
          { userType: dataWardenInLeedsWithoutPecs, action: denied },
          { userType: hqViewerNotInLeeds, action: denied },
          { userType: hqViewerInLeeds, action: denied },
          { userType: hqViewerInLeedsWithPecs, action: denied },
        ])(
          'should be $action to $userType.description only in NOMIS when Leeds is inactive in DPS',
          ({ userType: { user }, action }) => {
            config.activePrisons = ['MDI']

            const permissions = new Permissions(user)
            expect(permissions.canCreateReportInLocation('LEI')).toBe(false)
            expect(permissions.canCreateReportInLocationInNomisOnly('LEI')).toBe(action === granted)
          },
        )
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
          { userType: hqViewerNotInLeeds, action: denied },
        ])('should be $action to $userType.descriptionIgnoringCaseload', ({ userType: { user }, action }) => {
          const permissions = new Permissions(user)
          expect(permissions.canCreateReportInActiveCaseload).toBe(action === granted)
        })

        it.each([
          { userType: notLoggedIn, action: denied },
          { userType: unauthorisedNotInLeeds, action: denied },
          { userType: reportingOfficerNotInLeeds, action: granted },
          { userType: dataWardenNotInLeeds, action: denied },
          { userType: hqViewerNotInLeeds, action: denied },
        ])(
          'should be $action to $userType.descriptionIgnoringCaseload only in NOMIS when active casload is inactive in DPS',
          ({ userType: { user }, action }) => {
            config.activePrisons = []

            const permissions = new Permissions(user)
            expect(permissions.canCreateReportInActiveCaseload).toBe(false)
            expect(permissions.canCreateReportInActiveCaseloadInNomisOnly).toBe(action === granted)
          },
        )
      })

      describe('in a PECS region', () => {
        it.each([
          { userType: notLoggedIn, action: denied },
          { userType: unauthorisedNotInLeeds, action: denied },
          { userType: unauthorisedInLeeds, action: denied },
          { userType: reportingOfficerNotInLeeds, action: denied },
          { userType: reportingOfficerInLeeds, action: denied },
          { userType: reportingOfficerInLeedsWithPecs, action: denied },
          { userType: dataWardenNotInLeeds, action: granted },
          { userType: dataWardenInLeeds, action: granted },
          { userType: dataWardenInLeedsWithoutPecs, action: denied },
          { userType: hqViewerNotInLeeds, action: denied },
          { userType: hqViewerInLeeds, action: denied },
          { userType: hqViewerInLeedsWithPecs, action: denied },
        ])('should be $action to $userType.description', ({ userType: { user }, action }) => {
          const permissions = new Permissions(user)
          expect(permissions.canCreateReportInLocation('NORTH')).toBe(action === granted)
        })

        it.each([
          { userType: notLoggedIn, action: denied },
          { userType: unauthorisedNotInLeeds, action: denied },
          { userType: unauthorisedInLeeds, action: denied },
          { userType: reportingOfficerNotInLeeds, action: denied },
          { userType: reportingOfficerInLeeds, action: denied },
          { userType: reportingOfficerInLeedsWithPecs, action: denied },
          { userType: dataWardenNotInLeeds, action: granted },
          { userType: dataWardenInLeeds, action: granted },
          { userType: dataWardenInLeedsWithoutPecs, action: denied },
          { userType: hqViewerNotInLeeds, action: denied },
          { userType: hqViewerInLeeds, action: denied },
          { userType: hqViewerInLeedsWithPecs, action: denied },
        ])(
          'should be $action to $userType.description only in NOMIS when PECS reports are inactive in DPS',
          ({ userType: { user }, action }) => {
            config.activeForPecsRegions = false

            const permissions = new Permissions(user)
            expect(permissions.canCreateReportInLocation('NORTH')).toBe(false)
            expect(permissions.canCreateReportInLocationInNomisOnly('NORTH')).toBe(action === granted)
          },
        )
      })
    })

    describe('Editing a report', () => {
      describe('in Leeds', () => {
        it.each([
          { userType: notLoggedIn, action: denied },
          { userType: unauthorisedNotInLeeds, action: denied },
          { userType: unauthorisedInLeeds, action: denied },
          { userType: reportingOfficerNotInLeeds, action: denied },
          { userType: reportingOfficerInLeeds, action: granted },
          { userType: reportingOfficerInLeedsWithPecs, action: granted },
          { userType: dataWardenNotInLeeds, action: denied },
          { userType: dataWardenInLeeds, action: denied },
          { userType: dataWardenInLeedsWithoutPecs, action: denied },
          { userType: hqViewerNotInLeeds, action: denied },
          { userType: hqViewerInLeeds, action: denied },
          { userType: hqViewerInLeedsWithPecs, action: denied },
        ])('should be $action to $userType.description', ({ userType: { user }, action }) => {
          const permissions = new Permissions(user)
          expect(mockReports.every(report => permissions.canEditReport(report))).toBe(action === granted)
        })

        it.each([
          { userType: notLoggedIn, action: denied },
          { userType: unauthorisedNotInLeeds, action: denied },
          { userType: unauthorisedInLeeds, action: denied },
          { userType: reportingOfficerNotInLeeds, action: denied },
          { userType: reportingOfficerInLeeds, action: granted },
          { userType: reportingOfficerInLeedsWithPecs, action: granted },
          { userType: dataWardenNotInLeeds, action: denied },
          { userType: dataWardenInLeeds, action: denied },
          { userType: dataWardenInLeedsWithoutPecs, action: denied },
          { userType: hqViewerNotInLeeds, action: denied },
          { userType: hqViewerInLeeds, action: denied },
          { userType: hqViewerInLeedsWithPecs, action: denied },
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
          { userType: reportingOfficerNotInLeeds, action: denied },
          { userType: reportingOfficerInLeeds, action: denied },
          { userType: reportingOfficerInLeedsWithPecs, action: denied },
          { userType: dataWardenNotInLeeds, action: granted },
          { userType: dataWardenInLeeds, action: granted },
          { userType: dataWardenInLeedsWithoutPecs, action: denied },
          { userType: hqViewerNotInLeeds, action: denied },
          { userType: hqViewerInLeeds, action: denied },
          { userType: hqViewerInLeedsWithPecs, action: denied },
        ])('should be $action to $userType.description', ({ userType: { user }, action }) => {
          const permissions = new Permissions(user)
          expect(mockPecsReports.every(report => permissions.canEditReport(report))).toBe(action === granted)
        })

        it.each([
          { userType: notLoggedIn, action: denied },
          { userType: unauthorisedNotInLeeds, action: denied },
          { userType: unauthorisedInLeeds, action: denied },
          { userType: reportingOfficerNotInLeeds, action: denied },
          { userType: reportingOfficerInLeeds, action: denied },
          { userType: reportingOfficerInLeedsWithPecs, action: denied },
          { userType: dataWardenNotInLeeds, action: granted },
          { userType: dataWardenInLeeds, action: granted },
          { userType: dataWardenInLeedsWithoutPecs, action: denied },
          { userType: hqViewerNotInLeeds, action: denied },
          { userType: hqViewerInLeeds, action: denied },
          { userType: hqViewerInLeedsWithPecs, action: denied },
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
          { userType: reportingOfficerNotInLeeds, action: denied },
          { userType: reportingOfficerInLeeds, action: denied },
          { userType: reportingOfficerInLeedsWithPecs, action: denied },
          { userType: dataWardenNotInLeeds, action: denied },
          { userType: dataWardenInLeeds, action: granted },
          { userType: dataWardenInLeedsWithoutPecs, action: granted },
          { userType: hqViewerNotInLeeds, action: denied },
          { userType: hqViewerInLeeds, action: denied },
          { userType: hqViewerInLeedsWithPecs, action: denied },
        ])('should be $action to $userType.description', ({ userType: { user }, action }) => {
          const permissions = new Permissions(user)
          expect(mockReports.every(report => permissions.canApproveOrRejectReport(report))).toBe(action === granted)
        })

        it.each([
          { userType: notLoggedIn, action: denied },
          { userType: unauthorisedNotInLeeds, action: denied },
          { userType: unauthorisedInLeeds, action: denied },
          { userType: reportingOfficerNotInLeeds, action: denied },
          { userType: reportingOfficerInLeeds, action: denied },
          { userType: reportingOfficerInLeedsWithPecs, action: denied },
          { userType: dataWardenNotInLeeds, action: denied },
          { userType: dataWardenInLeeds, action: granted },
          { userType: dataWardenInLeedsWithoutPecs, action: granted },
          { userType: hqViewerNotInLeeds, action: denied },
          { userType: hqViewerInLeeds, action: denied },
          { userType: hqViewerInLeedsWithPecs, action: denied },
        ])(
          'should be $action to $userType.description only in NOMIS when Leeds is inactive in DPS',
          ({ userType: { user }, action }) => {
            config.activePrisons = ['MDI']

            const permissions = new Permissions(user)
            expect(mockReports.every(report => permissions.canApproveOrRejectReport(report))).toBe(false)
            expect(mockReports.every(report => permissions.canApproveOrRejectReportInNomisOnly(report))).toBe(
              action === granted,
            )
          },
        )
      })

      describe('in a PECS region', () => {
        it.each([
          { userType: notLoggedIn, action: denied },
          { userType: unauthorisedNotInLeeds, action: denied },
          { userType: unauthorisedInLeeds, action: denied },
          { userType: reportingOfficerNotInLeeds, action: denied },
          { userType: reportingOfficerInLeeds, action: denied },
          { userType: reportingOfficerInLeedsWithPecs, action: denied },
          { userType: dataWardenNotInLeeds, action: granted },
          { userType: dataWardenInLeeds, action: granted },
          { userType: dataWardenInLeedsWithoutPecs, action: denied },
          { userType: hqViewerNotInLeeds, action: denied },
          { userType: hqViewerInLeeds, action: denied },
          { userType: hqViewerInLeedsWithPecs, action: denied },
        ])('should be $action to $userType.description', ({ userType: { user }, action }) => {
          const permissions = new Permissions(user)
          expect(mockPecsReports.every(report => permissions.canApproveOrRejectReport(report))).toBe(action === granted)
        })

        it.each([
          { userType: notLoggedIn, action: denied },
          { userType: unauthorisedNotInLeeds, action: denied },
          { userType: unauthorisedInLeeds, action: denied },
          { userType: reportingOfficerNotInLeeds, action: denied },
          { userType: reportingOfficerInLeeds, action: denied },
          { userType: reportingOfficerInLeedsWithPecs, action: denied },
          { userType: dataWardenNotInLeeds, action: granted },
          { userType: dataWardenInLeeds, action: granted },
          { userType: dataWardenInLeedsWithoutPecs, action: denied },
          { userType: hqViewerNotInLeeds, action: denied },
          { userType: hqViewerInLeeds, action: denied },
          { userType: hqViewerInLeedsWithPecs, action: denied },
        ])(
          'should be $action to $userType.description only in NOMIS when active casload is inactive in DPS',
          ({ userType: { user }, action }) => {
            config.activeForPecsRegions = false

            const permissions = new Permissions(user)
            expect(mockPecsReports.every(report => permissions.canApproveOrRejectReport(report))).toBe(false)
            expect(mockPecsReports.every(report => permissions.canApproveOrRejectReportInNomisOnly(report))).toBe(
              action === granted,
            )
          },
        )
      })
    })
  })

  describe('Middleware', () => {
    it.each([
      notLoggedIn,
      unauthorisedNotInLeeds,
      reportingOfficerNotInLeeds,
      dataWardenNotInLeeds,
      hqViewerNotInLeeds,
    ])('should attach permissions class to locals for $descriptionIgnoringCaseload', ({ user }) => {
      const req = {} as Request
      const res = { locals: { user } } as Response
      const next: NextFunction = jest.fn()
      Permissions.middleware(req, res, next)
      expect(next).toHaveBeenCalledWith()
      expect(res.locals.permissions).toBeInstanceOf(Permissions)
    })
  })
})
