import path from 'node:path'

import compression from 'compression'
import express, { type Router } from 'express'
import noCache from 'nocache'

import config from '../config'

export default function setUpStaticResources(): Router {
  const router = express.Router()

  router.use(compression())

  //  Static Resources Configuration
  const staticResourcesConfig = { maxAge: config.staticResourceCacheDuration, redirect: false }

  // Static assets
  Array.of(
    '/dist/assets',
    '/node_modules/govuk-frontend/dist/govuk/assets',
    '/node_modules/govuk-frontend/dist',
    '/node_modules/@ministryofjustice/frontend/moj/assets',
    '/node_modules/@ministryofjustice/frontend',
    '/node_modules/accessible-autocomplete/dist',
  ).forEach(dir => {
    router.use('/assets', express.static(path.join(process.cwd(), dir), staticResourcesConfig))
  })

  // Don't cache dynamic resources
  router.use(noCache())

  return router
}
