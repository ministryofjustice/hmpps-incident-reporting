import { Router } from 'express'

import makeNomisConfigRouter from './nomis'

export default function makeDownloadConfigRouter(): Router {
  const router = Router()

  router.use('/nomis', makeNomisConfigRouter())

  return router
}
