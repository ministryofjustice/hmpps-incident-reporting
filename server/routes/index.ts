import { type RequestHandler, Router } from 'express'

import config from '../config'
import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import makeDebugRoutes from './debug'
import makeDownloadConfigRouter from './downloadReportConfig'
import createIncidentRouter from './createIncident'
import changeIncidentRouter from './changeIncident'
import genericRouter from './generic'

export default function routes(services: Services): Router {
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  const router = Router()

  get('/', (req, res) => {
    res.render('pages/index')
  })

  // No role-based authorisation exists; not adding unfinished routes in production
  if (config.environment !== 'prod') {
    // view-only debug pages
    const debugRoutes = makeDebugRoutes(services)
    get('/incidents', debugRoutes.incidentList)
    get('/incident/:id', debugRoutes.incidentDetails)
    get('/report/:id', debugRoutes.reportDetails)

    // proof-of-concept form wizard
    router.use('/create-incident', createIncidentRouter)
    router.use('/change-incident/:id/', changeIncidentRouter)
    router.use('/generic-route', genericRouter)
  }

  // NOMIS data dumps should be available in production
  router.use('/download-report-config', makeDownloadConfigRouter())

  return router
}
