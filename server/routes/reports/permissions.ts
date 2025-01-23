import type { Response } from 'express'

import { Permissions } from '../../middleware/permissions'

/**
 * Used in `logoutIf()` middleware to check that current user can view report in locals.
 * Replies on `populatePrison()` middleware.
 */
export function cannotViewReport(permissions: Permissions, res: Response) {
  const { report } = res.locals
  return !permissions.canViewReport(report)
}

/**
 * Used in `logoutIf()` middleware to check that current user can create a report in their active caseload.
 */
export function cannotCreateReportInActiveCaseload(permissions: Permissions): boolean {
  return !permissions.canCreateReportInActiveCaseload
}

/**
 * Used in `logoutIf()` middleware to check that current user can edit report in locals.
 * Replies on `populatePrison()` middleware.
 */
export function cannotEditReport(permissions: Permissions, res: Response): boolean {
  const { report } = res.locals
  return !permissions.canEditReport(report)
}

/**
 * Used in `logoutIf()` middleware to check that current user can approve or reject report in locals.
 * Replies on `populatePrison()` middleware.
 */
export function cannotApproveOrRejectReport(permissions: Permissions, res: Response): boolean {
  const { report } = res.locals
  return !permissions.canApproveOrRejectReport(report)
}
