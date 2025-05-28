import type { GrantAccess } from '../../middleware/permissions'

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
