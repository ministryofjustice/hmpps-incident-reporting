import { Router } from 'express'
import config from '../../config'

export function dprRouter(router: Router): Router {
  router.get('/management-reporting', async (req, res) => {
    res.render('pages/managementReporting/index', { dprUrl: config.dprUrl })
  })
  return router
}
