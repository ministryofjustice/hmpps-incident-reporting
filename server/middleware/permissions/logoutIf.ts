import type { RequestHandler, Response } from 'express'
import { Forbidden, NotImplemented } from 'http-errors'

import { Permissions } from './rulesClass'

/** A condition function to check whether user is allowed to access a route */
export interface LogoutCondition {
  (permissions: Permissions, res: Response): boolean
}

/**
 * If condition evaluates to _true_, sends Forbidden (403) error to next request handler which logs user out.
 * Must come after Permissions.middleware().
 *
 * TODO: a better alternative could be to show them instructions about getting access
 */
export function logoutIf(condition: LogoutCondition): RequestHandler {
  return (_req, res, next) => {
    const { permissions } = res.locals

    if (!(permissions instanceof Permissions)) {
      next(new NotImplemented('logoutIf() requires res.locals.permissions'))
      return
    }

    if (condition(permissions, res)) {
      next(new Forbidden())
      return
    }

    next()
  }
}
