import { RequestHandler } from 'express'
import { IncidentReportingApi } from '../data/incidentReportingApi'
import { PrisonApi } from '../data/prisonApi'
import { OffenderSearchApi } from '../data/offenderSearchApi'

export default function setApis(): RequestHandler {
  return async (req, res, next) => {
    const { systemToken } = res.locals

    res.locals.apis = {
      incidentReportingApi: new IncidentReportingApi(systemToken),
      prisonApi: new PrisonApi(systemToken),
      offenderSearchApi: new OffenderSearchApi(systemToken),
    }

    next()
  }
}
