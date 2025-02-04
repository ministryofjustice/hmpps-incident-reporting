import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import { logoutIf } from '../middleware/permissions'
import type { Services } from '../services'
import { PrisonApi } from '../data/prisonApi'
import makeDebugRoutes from './debug'
import makeDownloadConfigRouter from './downloadReportConfig'
import { createReportRouter } from './reports/createReport'
import { questionsRouter } from './reports/questions'
import { updateDetailsRouter } from './reports/updateReportDetails'
import { viewReportRouter } from './reports/viewReport'
import prisonerSearchRoutes from '../controllers/addPrisoner/prisonerSearch'
import addPrisonerRouter from './addPrisoner'
import dashboard from './dashboard/dashboard'

export default function routes(services: Services): Router {
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  const router = Router()

  // require user to have necessary role for *all* routes
  router.use(logoutIf(permissions => !permissions.canAccessService))

  get('/', (_req, res) => {
    res.render('pages/index')
  })

  // view-only debug pages
  const debugRoutes = makeDebugRoutes(services)
  get('/incidents/:id', debugRoutes.eventDetails)

  // report pages
  router.use('/reports', dashboard(services))
  router.use('/create-report', createReportRouter)
  router.use('/reports/:id', viewReportRouter(services))
  router.use('/reports/:id/update-details', updateDetailsRouter)
  router.use('/reports/:id/questions', questionsRouter)

  // add people
  router.use('/reports/:id/prisoner-search', prisonerSearchRoutes())
  router.use('/reports/:id/add-prisoner/:prisonerNumber', addPrisonerRouter)

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
