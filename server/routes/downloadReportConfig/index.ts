import { Router } from 'express'

import makeDpsConfigRouter from './dps'
import makeNomisConfigRouter from './nomis'

export default function makeDownloadConfigRouter(): Router {
  const router = Router()

  router.use('/dps', makeDpsConfigRouter())
  router.use('/nomis', makeNomisConfigRouter())

  return router
}
