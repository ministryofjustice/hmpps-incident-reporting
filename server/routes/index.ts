import { type RequestHandler, Router } from 'express'

import config from '../config'
import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import makeDebugRoutes from './debug'

export default function routes(services: Services): Router {
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  const router = Router()

  get('/', (req, res, next) => {
    res.render('pages/index')
  })

  // No role-based authorisation exists; debug routes are not added in production
  if (config.environment !== 'prod') {
    const debugRoutes = makeDebugRoutes(services)
    get('/incidents', debugRoutes.incidentList)
    get('/incident/:id', debugRoutes.incidentDetails)
    get('/report/:id', debugRoutes.reportDetails)
  }

  return router
}
