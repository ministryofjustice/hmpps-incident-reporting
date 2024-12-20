import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import { logoutIfCannotAccessService } from '../middleware/permissions'
import type { Services } from '../services'
import { PrisonApi } from '../data/prisonApi'
import makeDebugRoutes from './debug'
import makeDownloadConfigRouter from './downloadReportConfig'
import { createReportRouter } from './reports/createReport'
import { updateDetailsRouter } from './reports/updateReportDetails'
import genericRouter from './generic'
import prisonerSearchRoutes from '../controllers/addPrisoner/prisonerSearch'
import addPrisonerRouter from './addPrisoner'
import questionsRouter from './questions/router'
import dashboard from './dashboard'
import viewReport from './viewReport'

export default function routes(services: Services): Router {
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  const router = Router()

  // require user to have necessary role for all routes
  // TODO: an alternative could be to show them instructions about getting access
  router.use(logoutIfCannotAccessService)

  get('/', (_req, res) => {
    res.render('pages/index')
  })

  // view-only debug pages
  const debugRoutes = makeDebugRoutes(services)
  get('/incidents/:id', debugRoutes.eventDetails)
  router.use('/reports', dashboard(services))
  router.use('/reports/:id', viewReport(services))

  // report pages
  router.use('/create-report', createReportRouter)
  router.use('/reports/:id/update-details', updateDetailsRouter)

  // TODO: WIP, proof-of-concept forms auto-generated from config
  router.use('/reports/:id/questions', questionsRouter)

  // proof-of-concept form wizard
  router.use('/reports/:id/prisoner-search', prisonerSearchRoutes())
  router.use('/reports/:id/add-prisoner/:prisonerNumber', addPrisonerRouter)

  router.use('/generic-route', genericRouter)

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

  // NOMIS data dumps used for updating constants in this repository
  router.use('/download-report-config', makeDownloadConfigRouter())

  return router
}
