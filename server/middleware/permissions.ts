import type { Request, Response, NextFunction } from 'express'
import { Forbidden } from 'http-errors'

import config from '../config'
import { roleReadOnly, roleReadWrite, roleApproveReject } from '../data/constants'

/**
 * Per-request class to check whether the user is allowed to perform a given action/
 * Always available on res.locals.permissions even if user is not authenticated or is missing roles
 */
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

/**
 * Whether given prison should have full access to incident report on DPS, ie. the service has been rolled out there.
 * Otherwise, they are expected to continue using NOMIS.
 */
export function isPrisonActiveInService(prisonId: string): boolean {
  // empty list permits none
  if (config.activePrisons.length === 0) {
    return false
  }
  // list with only "***" permits all
  if (config.activePrisons.length === 1 && config.activePrisons[0] === '***') {
    return true
  }
  // otherwise actually check
  return config.activePrisons.includes(prisonId)
}

export function setupPermissions(_req: Request, res: Response, next: NextFunction): void {
  res.locals.permissions = new Permissions(res.locals.user)
  next()
}

export function logoutIfCannotAccessService(_req: Request, res: Response, next: NextFunction): void {
  if (!res.locals.permissions.canAccessService) {
    next(new Forbidden())
    return
  }
  next()
}
