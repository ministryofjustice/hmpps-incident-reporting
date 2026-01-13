import { roleReadOnly, roleReadWrite, roleApproveReject, rolePecs, roleAdmin } from '../constants'
import type { CaseLoad } from '../frontendComponentsClient'
import { makeMockCaseload } from './frontendComponents'
import { leeds, moorland } from './prisonApi'

// mock users here are of type Express.User which are made from a combination of sources including
// manage-users and frontend micro-components apis and the user token

/** Makes a mock users as seen in application once all middleware has completed */
export function mockUser(caseloads: CaseLoad[], roles: string[] = []): Express.User {
  const activeCaseload = { ...caseloads[0], currentlyActive: true }
  return {
    name: 'JOHN SMITH',
    userId: 'id',
    token: 'token',
    username: 'user1',
    displayName: 'John Smith',
    active: true,
    authSource: 'NOMIS',
    roles: ['PRISON', ...roles],
    activeCaseLoadId: activeCaseload.caseLoadId,
    activeCaseLoad: activeCaseload,
    caseLoads: [activeCaseload, ...caseloads.slice(1).map(caseload => ({ ...caseload, currentlyActive: false }))],
  }
}

/** Typical reporting officer with access to Moorland only */
export const mockReportingOfficer = mockUser([makeMockCaseload(moorland)], [roleReadWrite])

/** Data warden with write access to Leeds, Moorland and PECS regions */
export const mockDataWarden = mockUser(
  [makeMockCaseload(moorland), makeMockCaseload(leeds)],
  [roleApproveReject, rolePecs, roleAdmin],
)

/** HQ user with read-only access to Leeds and Moorland */
export const mockHqViewer = mockUser([makeMockCaseload(moorland), makeMockCaseload(leeds)], [roleReadOnly])

/** General DPS user in Moorland without access */
export const mockUnauthorisedUser = mockUser([makeMockCaseload(moorland)])
