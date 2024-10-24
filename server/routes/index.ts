import { type RequestHandler, Router } from 'express'

import config from '../config'
import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import { PrisonApi } from '../data/prisonApi'
import makeDebugRoutes from './debug'
import makeDownloadConfigRouter from './downloadReportConfig'
import createReportRouter from './reports/createReport'
import changeIncidentRouter from './changeIncident'
import genericRouter from './generic'
import prisonerSearchRoutes from '../controllers/addPrisoner/prisonerSearch'
import addPrisonerRouter from './addPrisoner'
import questionsRouter from './questions/router'

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
    get('/incidents', debugRoutes.eventList)
    get('/incidents/:id', debugRoutes.eventDetails)
    get('/reports/:id', debugRoutes.reportDetails)

    router.use('/create-report', createReportRouter)
    // TODO: WIP, proof-of-concept forms auto-generated from config
    router.use('/:reportType/questions', questionsRouter)

    // proof-of-concept form wizard
    router.use('/reports/:id/change', changeIncidentRouter)
    router.use('/reports/:id/prisoner-search', prisonerSearchRoutes())
    router.use('/reports/:id/add-prisoner/:prisonerNumber', addPrisonerRouter)

    router.use('/generic-route', genericRouter)
  }

  // Auxiliary routes
  get('/prisoner/:prisonerNumber/photo.jpeg', async (req, res) => {
    const { user } = res.locals
    const { prisonerNumber } = req.params

    const prisonApi = new PrisonApi(user.token)
    const photoData = await prisonApi.getPhoto(prisonerNumber)

    const oneDay = 86400 as const
    res.setHeader('Cache-Control', `private, max-age=${oneDay}`)
    res.setHeader('Content-Type', 'image/jpeg')

    if (!photoData) {
      res.sendFile('images/prisoner.jpeg', { root: services.applicationInfo.assetsPath })
    } else {
      res.send(photoData)
    }
  })

  // NOMIS data dumps should be available in production
  router.use('/download-report-config', makeDownloadConfigRouter())

  return router
}
