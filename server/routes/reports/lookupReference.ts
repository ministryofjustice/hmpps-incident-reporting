import type { Request, Response } from 'express'
import { NotFound } from 'http-errors'

export async function lookupReference(req: Request, res: Response): Promise<void> {
  const { reference } = req.params
  const { permissions } = res.locals
  const { incidentReportingApi } = res.locals.apis

  const report = await incidentReportingApi.getReportByReference(reference)
  const allowedActions = permissions.allowedActionsOnReport(report)
  if (allowedActions.has('VIEW')) {
    res.redirect(`/reports/${report.id}`)
  } else {
    throw new NotFound()
  }
}
