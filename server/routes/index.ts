import { type RequestHandler, Router } from 'express'

import config from '../config'
import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import makeDebugRoutes from './debug'
import makeDownloadNomisConfigRoutes from './downloadNomisConfig'

export default function routes(services: Services): Router {
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  const router = Router()

  get('/', (req, res) => {
    res.render('pages/index')
  })

  // No role-based authorisation exists; debug routes are not added in production
  if (config.environment !== 'prod') {
    const debugRoutes = makeDebugRoutes(services)
    get('/incidents', debugRoutes.incidentList)
    get('/incident/:id', debugRoutes.incidentDetails)
    get('/report/:id', debugRoutes.reportDetails)
  }

  // NOMIS data dumps should be available in production
  const downloadNomisConfigRoutes = makeDownloadNomisConfigRoutes()
  get('/nomis-report-config/incident-types.csv', downloadNomisConfigRoutes.incidentTypes)
  get('/nomis-report-config/incident-type/:type/questions.csv', downloadNomisConfigRoutes.incidentTypeQuestions)
  get(
    '/nomis-report-config/incident-type/:type/prisoner-roles.csv',
    downloadNomisConfigRoutes.incidentTypePrisonerRoles,
  )
  get('/nomis-report-config/staff-involvement-roles.csv', downloadNomisConfigRoutes.staffInvolvementRoles)
  get('/nomis-report-config/prisoner-involvement-roles.csv', downloadNomisConfigRoutes.prisonerInvolvementRoles)
  get('/nomis-report-config/prisoner-involvement-outcome.csv', downloadNomisConfigRoutes.prisonerInvolvementOutcome)

  return router
}
