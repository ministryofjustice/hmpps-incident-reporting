import type { Response } from 'express'
import type { Permissions } from '../../middleware/permissions'

export function cannotViewReport(permissions: Permissions, res: Response) {
  const { report } = res.locals
  return !permissions.canViewReport(report)
}

export function cannotEditReport(permissions: Permissions, res: Response): boolean {
  const { report } = res.locals
  return !permissions.canEditReport(report)
}

export function cannotApproveOrRejectReport(permissions: Permissions, res: Response): boolean {
  const { report } = res.locals
  return !permissions.canApproveOrRejectReport(report)
}
