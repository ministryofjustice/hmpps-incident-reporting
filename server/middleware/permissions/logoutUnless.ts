import type { RequestHandler, Response } from 'express'
import { Forbidden, NotImplemented } from 'http-errors'

import { Permissions } from './rulesClass'

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
 * Used in `logoutUnless()` middleware to check that current user can view report in locals.
 * Relies on `populatePrison()` middleware.
 */
export const canViewReport: AccessCondition = (_permissions, res) => {
  const { allowedActions } = res.locals
  return allowedActions.has('view')
}

/**
 * Used in `logoutUnless()` middleware to check that current user can create a report in their active caseload.
 */
export const canCreateReportInActiveCaseload: AccessCondition = permissions => {
  return permissions.canCreateReportInActiveCaseload
}

/**
 * Used in `logoutUnless()` middleware to check that current user can edit report in locals.
 * Relies on `populatePrison()` middleware.
 */
export const canEditReport: AccessCondition = (_permissions, res) => {
  const { allowedActions } = res.locals
  return allowedActions.has('edit')
}

/**
 * Used in `logoutUnless()` middleware to check that current user can review and close report in locals.
 * Relies on `populatePrison()` middleware.
 */
export const canReviewReport: AccessCondition = (_permissions, res) => {
  const { allowedActions } = res.locals
  return allowedActions.has('close')
}
