import { Router } from 'express'

import makeDpsConfigRouter from './dps'

export default function makeDownloadConfigRouter(): Router {
  const router = Router()

  router.use('/dps', makeDpsConfigRouter())

  return router
}
