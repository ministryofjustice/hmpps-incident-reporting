import type { RequestHandler, Response } from 'express'
import { Forbidden, NotImplemented } from 'http-errors'

import { Permissions } from './rulesClass'

/**
 * A condition function to check whether user is allowed to access a route.
 * Return true to *grant* access.
 */
export interface GrantAccess {
  (permissions: Permissions, res: Response): boolean
}

/**
 * If condition evaluates to _false_, sends Forbidden (403) error to next request handler which logs user out.
 * Must come after Permissions.middleware().
 *
 * TODO: a better alternative could be to show them instructions about getting access
 */
export function logoutUnless(grantAccess: GrantAccess): RequestHandler {
  return (_req, res, next) => {
    const { permissions } = res.locals

    if (!(permissions instanceof Permissions)) {
      next(new NotImplemented('logoutUnless() requires res.locals.permissions'))
      return
    }

    if (!grantAccess(permissions, res)) {
      next(new Forbidden())
      return
    }

    next()
  }
}
