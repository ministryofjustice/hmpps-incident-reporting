import type { RequestHandler, Response } from 'express'
import { Forbidden, NotImplemented } from 'http-errors'

import { Permissions } from './rulesClass'
import type { UserAction } from './userActions'

/**
 * A condition function to check whether user is allowed to access a route using `logoutUnless` middleware.
 * Return true to *grant* access.
 */
interface AccessCondition {
  (permissions: Permissions, res: Response): boolean
}

/**
 * If condition evaluates to _false_, sends Forbidden (403) error to next request handler which logs user out.
 * Must come after Permissions.middleware().
 *
 * TODO: a better alternative could be to show them instructions about getting access
 */
export function logoutUnless(accessCondition: AccessCondition): RequestHandler {
  return (_req, res, next) => {
    const { permissions } = res.locals

    if (!(permissions instanceof Permissions)) {
      next(new NotImplemented('logoutUnless() requires res.locals.permissions'))
      return
    }

    if (!accessCondition(permissions, res)) {
      next(new Forbidden())
      return
    }

    next()
  }
}

/**
 * Access condition the requires ability to perform given action on report in locals
 * Relies on `populatePrison()` middleware.
 */
export function hasPermissionTo(userAction: UserAction): AccessCondition {
  return (_permissions, res) => {
    const { allowedActions } = res.locals
    return allowedActions.has(userAction)
  }
}
