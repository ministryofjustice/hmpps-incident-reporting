import { reportingUser } from '../../../data/testData/users'
import { ReportBasic } from '../../../data/incidentReportingApi'
import { roleApproveReject, rolePecs, roleReadOnly, roleReadWrite } from '../../../data/constants'
import { isPecsRegionCode } from '../../../data/pecsRegions'

// interface TestInput {
//   user: Express.User | undefined
//
//   caseloadIds: Set<string>
//   roles: Set<string>
//
//   report?: Pick<ReportBasic, 'location' | 'status'>
// }

type TestInput = Express.Locals

interface Test {
  (input: TestInput): boolean
}

function allOf(...tests: Test[]): Test {
  return (...args) => tests.every(test => test(...args))
}

function anyOf(...tests: Test[]): Test {
  return (...args) => tests.some(test => test(...args))
}

function hasAnyOfTheseRoles(...roles: readonly string[]): Test {
  return function test({ user }) {
    const userRoles = new Set(user?.roles ?? [])
    return roles.some(role => userRoles.has(role))
  }
}

function isReportingOfficer(): Test {
  return function test({ user }) {
    const userRoles = new Set(user?.roles ?? [])
    return userRoles.has(roleReadWrite) && !userRoles.has(roleApproveReject)
  }
}

function isDataWarden(): Test {
  return function test({ user }) {
    const userRoles = new Set(user?.roles ?? [])
    return userRoles.has(roleApproveReject) && !userRoles.has(roleReadWrite)
  }
}

function canAccessLocation(): Test {
  return function test({ user, report }) {
    const location = report?.location
    if (!location) {
      throw new Error('`canAccessLocation` requires report.location')
    }
    if (isPecsRegionCode(location)) {
      // if PECS region then user needs PECS role
      return Boolean(user?.roles?.includes(rolePecs))
    }
    // otherwise must have caseload
    return Boolean(user?.caseLoads?.some(caseload => caseload.caseLoadId === location))
  }
}

export const accessService = hasAnyOfTheseRoles(roleReadOnly, roleReadWrite, roleApproveReject)
export const createReport = allOf(canAccessLocation(), anyOf(isReportingOfficer(), isDataWarden()))
export const editReport = allOf(canAccessLocation(), anyOf(isReportingOfficer(), isDataWarden()))

export const permissions = { accessService, createReport, editReport } as const
