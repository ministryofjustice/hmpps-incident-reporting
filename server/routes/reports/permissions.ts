import type { LogoutCondition } from '../../middleware/permissions'

/**
 * Used in `logoutIf()` middleware to check that current user can view report in locals.
 * Replies on `populatePrison()` middleware.
 */
export const cannotViewReport: LogoutCondition = (permissions, res) => {
  const { report } = res.locals
  return !permissions.canViewReport(report)
}

/**
 * Used in `logoutIf()` middleware to check that current user can create a report in their active caseload.
 */
export const cannotCreateReportInActiveCaseload: LogoutCondition = permissions => {
  return !permissions.canCreateReportInActiveCaseload
}

/**
 * Used in `logoutIf()` middleware to check that current user can edit report in locals.
 * Replies on `populatePrison()` middleware.
 */
export const cannotEditReport: LogoutCondition = (permissions, res) => {
  const { report } = res.locals
  return !permissions.canEditReport(report)
}

/**
 * Used in `logoutIf()` middleware to check that current user can approve or reject report in locals.
 * Replies on `populatePrison()` middleware.
 */
export const cannotApproveOrRejectReport: LogoutCondition = (permissions, res) => {
  const { report } = res.locals
  return !permissions.canApproveOrRejectReport(report)
}
