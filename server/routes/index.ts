import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import { logoutIf } from '../middleware/permissions'
import type { Services } from '../services'
import { PrisonApi } from '../data/prisonApi'
import makeDebugRoutes from './debug'
import makeDownloadConfigRouter from './downloadReportConfig'
import { historyRouter } from './reports/history'
import { createReportRouter } from './reports/createReport'
import { prisonerInvolvementRouter } from './reports/prisoners'
import { staffInvolvementRouter } from './reports/staff'
import { questionsRouter } from './reports/questions'
import { updateDetailsRouter } from './reports/updateReportDetails'
import { viewReportRouter } from './reports/viewReport'
import prisonerSearchRoutes from '../controllers/addPrisoner/prisonerSearch'
import dashboard from './dashboard/dashboard'
import { dprRouter } from './dpr'

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
  get('/incidents/:eventId', debugRoutes.eventDetails)

  // report pages
  router.use('/reports', dashboard(services))
  router.use('/create-report', createReportRouter)
  router.use('/reports/:reportId', viewReportRouter(services))
  router.use('/reports/:reportId/history', historyRouter(services))
  router.use('/reports/:reportId/update-details', updateDetailsRouter)
  router.use('/reports/:reportId/prisoners', prisonerInvolvementRouter)
  router.use('/reports/:reportId/staff', staffInvolvementRouter)
  router.use('/reports/:reportId/questions', questionsRouter)

  // add people
  router.use('/reports/:reportId/prisoner-search', prisonerSearchRoutes())

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

  // Digital Prison Reporting
  router.use('/incident-reporting', dprRouter())

  return router
}
