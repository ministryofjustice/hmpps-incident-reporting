import path from 'node:path'

import compression from 'compression'
import express, { type Router } from 'express'
import noCache from 'nocache'

import config from '../config'

export default function setUpStaticResources(): Router {
  const router = express.Router()

  router.use(compression())

  /** Add a static asset route */
  function staticRoute(assetUrl: string, assetPath: string): void {
    router.use(
      assetUrl,
      express.static(path.join(process.cwd(), assetPath), {
        maxAge: config.staticResourceCacheDuration,
        redirect: false,
      }),
    )
  }

  // Application assets
  Array.of(
    '/dist/assets',
    '/node_modules/govuk-frontend/dist/govuk/assets',
    '/node_modules/govuk-frontend/dist',
    '/node_modules/@ministryofjustice/frontend/moj/assets',
    '/node_modules/@ministryofjustice/frontend',
    '/node_modules/@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/assets',
    '/node_modules/@ministryofjustice/hmpps-digital-prison-reporting-frontend',
    '/node_modules/accessible-autocomplete/dist',
    '/node_modules/chart.js/dist/chart.umd.js',
  ).forEach(dir => staticRoute('/assets', dir))
  // Don't cache dynamic resources
  router.use(noCache())

  return router
}
