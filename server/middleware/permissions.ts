import { roleReadOnly, roleReadWrite, roleApproveReject } from '../data/constants'

/**
 * Per-request class to check whether the user is allowed to perform a given action/
 * Always available on res.locals.permissions even if user is not authenticated or is missing roles
 */
// eslint-disable-next-line import/prefer-default-export
export class Permissions {
  private caseloadIds: Set<string>

  private roles: Set<string>

  constructor(user: Express.User | undefined) {
    this.caseloadIds = new Set(user?.caseLoads?.map(caseLoad => caseLoad.caseLoadId) ?? [])
    this.roles = new Set(user?.roles ?? [])
  }

  /** Has role granting access to service */
  get canAccessService(): boolean {
    return [roleReadWrite, roleApproveReject, roleReadOnly].some(role => this.roles.has(role))
  }

  /** Caseload check. NB: not a role check! */
  canAccessCaseload(caseloadId: string): boolean {
    return (
      this.caseloadIds.has(caseloadId) ||
      // TODO: should data wardens have access to everything?
      this.roles.has(roleApproveReject)
    )
  }
}
