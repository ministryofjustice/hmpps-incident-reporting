import type { RequestHandler, Response } from 'express'
import { Forbidden, NotImplemented } from 'http-errors'

import { Permissions } from './rulesClass'

/**
 * A condition function to check whether user is allowed to access a route.
 * Return true to *grant* access.
 */
interface GrantAccess {
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

/**
 * Used in `logoutUnless()` middleware to check that current user can view report in locals.
 * Relies on `populatePrison()` middleware.
 */
export const canViewReport: GrantAccess = (permissions, res) => {
  const { report } = res.locals
  return permissions.canViewReport(report)
}

/**
 * Used in `logoutUnless()` middleware to check that current user can create a report in their active caseload.
 */
export const canCreateReportInActiveCaseload: GrantAccess = permissions => {
  return permissions.canCreateReportInActiveCaseload
}

/**
 * Used in `logoutUnless()` middleware to check that current user can edit report in locals.
 * Relies on `populatePrison()` middleware.
 */
export const canEditReport: GrantAccess = (permissions, res) => {
  const { report } = res.locals
  return permissions.canEditReport(report)
}

/**
 * Used in `logoutUnless()` middleware to check that current user can approve or reject report in locals.
 * Relies on `populatePrison()` middleware.
 */
export const canApproveOrRejectReport: GrantAccess = (permissions, res) => {
  const { report } = res.locals
  return permissions.canApproveOrRejectReport(report)
}
