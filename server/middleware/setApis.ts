import type { RequestHandler } from 'express'

import { IncidentReportingApi } from '../data/incidentReportingApi'
import { PrisonApi } from '../data/prisonApi'
import { OffenderSearchApi } from '../data/offenderSearchApi'
import type { Services } from '../services'

export default function setApis({ userService }: Services): RequestHandler {
  return (_req, res, next) => {
    const { systemToken } = res.locals

    res.locals.apis = {
      userService,
      incidentReportingApi: new IncidentReportingApi(systemToken),
      prisonApi: new PrisonApi(systemToken),
      offenderSearchApi: new OffenderSearchApi(systemToken),
    }

    next()
  }
}
