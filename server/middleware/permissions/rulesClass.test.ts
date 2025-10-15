import type { Request, Response, NextFunction } from 'express'

import { now } from '../../testutils/fakeClock'
import {
  mockUser,
  mockDataWarden,
  mockReportingOfficer,
  mockHqViewer,
  mockUnauthorisedUser,
} from '../../data/testData/users'
import { roleReadOnly, roleReadWrite, roleApproveReject, rolePecs } from '../../data/constants'
import type { ReportBasic } from '../../data/incidentReportingApi'
import { convertReportDates } from '../../data/incidentReportingApiUtils'
import { mockReport } from '../../data/testData/incidentReporting'
import { makeMockCaseload } from '../../data/testData/frontendComponents'
import { mockPecsRegions, resetPecsRegions } from '../../data/testData/pecsRegions'
import { brixton, leeds, moorland } from '../../data/testData/prisonApi'
import { Permissions } from './rulesClass'
import type { UserAction } from './userActions'
import { setActiveAgencies } from '../../data/activeAgencies'

const granted = 'granted' as const
const denied = 'denied' as const

const leedsAndMoorland = [leeds.agencyId, moorland.agencyId]
const pecsCodes = ['NORTH', 'SOUTH']

interface Scenario {
  /** Most tests use this description since they are affected by roles and caseloads */
  description: string
  /** Some tests use this description since they are not affected by caseloads */
  descriptionIgnoringCaseload?: string
  user: Express.User
}

const notLoggedIn: Scenario = {
  description: 'unauthorised user',
  descriptionIgnoringCaseload: 'unauthorised user',
  user: undefined,
}
const unauthorisedNotInLeeds: Scenario = {
  description: 'user without roles or Leeds caseload',
  descriptionIgnoringCaseload: 'user without roles',
  user: mockUnauthorisedUser,
}
const unauthorisedInLeeds: Scenario = {
  description: 'user without roles but with Leeds caseload',
  user: mockUser([makeMockCaseload(leeds)]),
}
const reportingOfficerNotInLeeds: Scenario = {
  description: 'reporting officer without Leeds caseload',
  descriptionIgnoringCaseload: 'reporting officer',
  user: mockReportingOfficer,
}
const reportingOfficerInLeeds: Scenario = {
  description: 'reporting officer with Leeds caseload',
  user: mockUser([makeMockCaseload(leeds)], [roleReadWrite]),
}
const reportingOfficerInLeedsWithPecs: Scenario = {
  description: 'reporting officer with Leeds caseload and PECS role',
  user: mockUser([makeMockCaseload(leeds)], [roleReadWrite, rolePecs]),
}
const dataWardenNotInLeeds: Scenario = {
  description: 'data warden without Leeds caseload',
  descriptionIgnoringCaseload: 'data warden',
  user: mockUser([makeMockCaseload(moorland)], [roleApproveReject, rolePecs]),
}
const dataWardenInLeeds: Scenario = { description: 'data warden with Leeds caseload', user: mockDataWarden }
const dataWardenInLeedsWithoutPecs: Scenario = {
  description: 'data warden with Leeds caseload missing PECS role',
  user: mockUser([makeMockCaseload(leeds)], [roleApproveReject]),
}
const hqViewerNotInLeeds: Scenario = {
  description: 'HQ view-only user without Leeds caseload',
  descriptionIgnoringCaseload: 'HQ view-only user',
  user: mockUser([makeMockCaseload(moorland)], [roleReadOnly]),
}
const hqViewerInLeeds: Scenario = { description: 'HQ view-only user with Leeds caseload', user: mockHqViewer }
const hqViewerInLeedsWithPecs: Scenario = {
  description: 'HQ view-only user with Leeds caseload and PECS role',
  user: mockUser([makeMockCaseload(moorland), makeMockCaseload(leeds)], [roleReadOnly, rolePecs]),
}

describe('Permissions class', () => {
  beforeAll(() => {
    mockPecsRegions(true)
  })

  afterAll(() => {
    resetPecsRegions()
  })

  beforeEach(() => {
    setActiveAgencies([...leedsAndMoorland, ...pecsCodes])
  })

  describe('User types', () => {
    it.each([dataWardenNotInLeeds, dataWardenNotInLeeds, dataWardenInLeedsWithoutPecs])(
      'should categorise $description',
      ({ user }) => {
        const permissions = new Permissions(user)
        expect(permissions.userType).toEqual('DATA_WARDEN')
        expect(permissions.isDataWarden).toBe(true)
        expect(permissions.isReportingOfficer).toBe(false)
        expect(permissions.isHqViewer).toBe(false)
      },
    )

    it.each([reportingOfficerNotInLeeds, reportingOfficerInLeeds, reportingOfficerInLeedsWithPecs])(
      'should categorise $description',
      ({ user }) => {
        const permissions = new Permissions(user)
        expect(permissions.userType).toEqual('REPORTING_OFFICER')
        expect(permissions.isDataWarden).toBe(false)
        expect(permissions.isReportingOfficer).toBe(true)
        expect(permissions.isHqViewer).toBe(false)
      },
    )

    it.each([hqViewerNotInLeeds, hqViewerInLeeds, hqViewerInLeedsWithPecs])(
      'should categorise $description',
      ({ user }) => {
        const permissions = new Permissions(user)
        expect(permissions.userType).toEqual('HQ_VIEWER')
        expect(permissions.isDataWarden).toBe(false)
        expect(permissions.isReportingOfficer).toBe(false)
        expect(permissions.isHqViewer).toBe(true)
      },
    )

    it.each([notLoggedIn, unauthorisedNotInLeeds, unauthorisedInLeeds])(
      'should categorise $description',
      ({ user }) => {
        const permissions = new Permissions(user)
        expect(permissions.userType).toBeNull()
        expect(permissions.isDataWarden).toBe(false)
        expect(permissions.isReportingOfficer).toBe(false)
        expect(permissions.isHqViewer).toBe(false)
        expect(permissions.hasPecsAccess).toBe(false)
      },
    )

    it.each([dataWardenNotInLeeds, dataWardenNotInLeeds, reportingOfficerInLeedsWithPecs, hqViewerInLeedsWithPecs])(
      'should grant PECS access to $description',
      ({ user }) => {
        const permissions = new Permissions(user)
        expect(permissions.hasPecsAccess).toBe(true)
      },
    )

    it.each([dataWardenInLeedsWithoutPecs, reportingOfficerInLeeds, hqViewerInLeeds])(
      'should deny PECS access to $description',
      ({ user }) => {
        const permissions = new Permissions(user)
        expect(permissions.hasPecsAccess).toBe(false)
      },
    )
  })

  describe('Allowed actions and transitions', () => {
    interface Expectation {
      permissions: Permissions
      userActions: UserAction[]
      all: 'granted' | 'denied'
      onlyInNomis?: true
    }

    function expectActionsOnReports(
      reports: ReportBasic[],
      { permissions, userActions, all, onlyInNomis }: Expectation,
    ) {
      for (const report of reports) {
        const allowedActions = permissions.allowedActionsOnReport(report, onlyInNomis ? 'nomis' : 'dps')
        expect(userActions.every(userAction => allowedActions.has(userAction))).toBe(all === granted)

        if (!onlyInNomis && all === 'granted') {
          const transitions = permissions.possibleTransitions(report)
          userActions
            .filter(userAction => userAction !== 'VIEW')
            .forEach(userAction => {
              expect(transitions).toHaveProperty(userAction)
              // not checking for absence if action is denied because transitions object does not consider report locations
            })
        }
      }
    }

    // mock reports in Leeds
    const mockReports = [true, false].map(withDetails =>
      convertReportDates(mockReport({ reportReference: '6543', reportDateAndTime: now, location: 'LEI', withDetails })),
    )
    function expectActionsOnPrisonReports(expectation: Expectation) {
      expectActionsOnReports(mockReports, expectation)
    }

    // mock reports in a PECS region
    const mockPecsReports = [true, false].map(withDetails =>
      convertReportDates(
        mockReport({ reportReference: '6544', reportDateAndTime: now, location: 'NORTH', withDetails }),
      ),
    )
    function expectActionsOnPecsReports(expectation: Expectation) {
      expectActionsOnReports(mockPecsReports, expectation)
    }

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
          expectActionsOnPrisonReports({
            permissions,
            userActions: ['VIEW'],
            all: action,
          })
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
          expectActionsOnPecsReports({
            permissions,
            userActions: ['VIEW'],
            all: action,
          })
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
            setActiveAgencies(['MDI'])
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
            setActiveAgencies([])
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
          expect(permissions.canCreatePecsReport).toBe(action === granted)
        })

        describe('in a PECS region a DW', () => {
          it.each([
            { userType: dataWardenNotInLeeds, action: granted },
            { userType: dataWardenInLeeds, action: granted },
          ])('should be $action to $userType.description', ({ userType: { user }, action }) => {
            const permissions = new Permissions(user)
            expect(permissions.canCreateReportInLocation('NOU')).toBe(action === denied)
            expect(permissions.canCreateReportInLocation('NORTH')).toBe(action === granted)
            expect(permissions.canCreateReportInLocation('SOUTH')).toBe(action === granted)
            expect(permissions.canCreatePecsReport).toBe(action === granted)
          })
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
            setActiveAgencies(leedsAndMoorland)
            const permissions = new Permissions(user)
            expect(permissions.canCreateReportInLocation('NOU')).toBe(false)
            expect(permissions.canCreateReportInLocationInNomisOnly('NOU')).toBe(action === granted)
            expect(permissions.canCreateReportInLocation('NORTH')).toBe(false)
            expect(permissions.canCreateReportInLocationInNomisOnly('NORTH')).toBe(action === granted)
            expect(permissions.canCreateReportInLocation('SOUTH')).toBe(false)
            expect(permissions.canCreateReportInLocationInNomisOnly('SOUTH')).toBe(action === granted)
            expect(permissions.canCreatePecsReport).toBe(false)
            expect(permissions.canCreatePecsReportInNomisOnly).toBe(action === granted)
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
          expectActionsOnPrisonReports({
            permissions,
            userActions: ['EDIT'],
            all: action,
          })
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
            setActiveAgencies(['MDI'])
            const permissions = new Permissions(user)
            expectActionsOnPrisonReports({
              permissions,
              userActions: ['EDIT'],
              all: denied,
            })
            expectActionsOnPrisonReports({
              permissions,
              userActions: ['EDIT'],
              all: action,
              onlyInNomis: true,
            })
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
          expectActionsOnPecsReports({
            permissions,
            userActions: ['EDIT'],
            all: action,
          })
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
            setActiveAgencies([])
            const permissions = new Permissions(user)
            expectActionsOnPecsReports({
              permissions,
              userActions: ['EDIT'],
              all: denied,
            })
            expectActionsOnPecsReports({
              permissions,
              userActions: ['EDIT'],
              all: action,
              onlyInNomis: true,
            })
          },
        )
      })
    })

    describe('Approving or rejecting a report', () => {
      describe('in Leeds', () => {
        beforeAll(() => {
          mockReports.forEach(r => {
            // eslint-disable-next-line no-param-reassign
            r.status = 'AWAITING_REVIEW'
          })
        })
        afterAll(() => {
          mockReports.forEach(r => {
            // eslint-disable-next-line no-param-reassign
            r.status = 'DRAFT'
          })
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
        ])('should be $action to $userType.description', ({ userType: { user }, action }) => {
          const permissions = new Permissions(user)
          expectActionsOnPrisonReports({
            permissions,
            userActions: ['CLOSE', 'MARK_DUPLICATE', 'MARK_NOT_REPORTABLE'],
            all: action,
          })
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
            setActiveAgencies(['MDI'])
            const permissions = new Permissions(user)
            expectActionsOnPrisonReports({
              permissions,
              userActions: ['CLOSE', 'MARK_DUPLICATE', 'MARK_NOT_REPORTABLE'],
              all: denied,
            })
            expectActionsOnPrisonReports({
              permissions,
              userActions: ['CLOSE', 'MARK_DUPLICATE', 'MARK_NOT_REPORTABLE'],
              all: action,
              onlyInNomis: true,
            })
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
          expectActionsOnPecsReports({
            permissions,
            userActions: ['CLOSE'],
            all: action,
          })
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
            setActiveAgencies(leedsAndMoorland)
            const permissions = new Permissions(user)
            expectActionsOnPecsReports({
              permissions,
              userActions: ['CLOSE'],
              all: denied,
            })
            expectActionsOnPecsReports({
              permissions,
              userActions: ['CLOSE'],
              all: action,
              onlyInNomis: true,
            })
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
