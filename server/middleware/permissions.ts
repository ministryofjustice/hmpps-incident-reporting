import { roleReadOnly, roleReadWrite, roleApproveReject } from '../data/constants'

/**
 * Per-request class to check whether the user is allowed to perform a given action/
 * Always available on res.locals.permissions even if user is not authenticated or is missing roles
 */
// eslint-disable-next-line import/prefer-default-export
export class Permissions {
  private roles: Set<string>

  constructor(user: Express.User | undefined) {
    this.roles = new Set(user?.roles ?? [])
  }

  get canAccessHomePage(): boolean {
    return [roleReadWrite, roleApproveReject, roleReadOnly].some(role => this.roles.has(role))
  }
}
