import { Router, type Request, type Response } from 'express'

import { jsonDownload } from './utils'

export default function makeDpsConfigRouter(): Router {
  const router = Router()

  ;[
    { method: 'types' as const },
    { method: 'statuses' as const },
    { method: 'informationSources' as const },
    { method: 'staffInvolvementRoles' as const },
    { method: 'prisonerInvolvementRoles' as const },
    { method: 'prisonerInvolvementOutcomes' as const },
    { method: 'errorCodes' as const },
  ].forEach(({ method }) => {
    router.get(`/${method}.json`, async (_req: Request, res: Response) => {
      const { incidentReportingApi } = res.locals.apis
      const constants = await incidentReportingApi.constants[method]()
      jsonDownload(res, method, constants)
    })
  })

  return router
}
