/* eslint-disable no-param-reassign */
import path from 'node:path'

import express from 'express'
import nunjucks from 'nunjucks'

import config from '../config'
import { ApplicationInfo } from '../applicationInfo'
import { initialiseName } from './utils'

export default function nunjucksSetup(app: express.Express, applicationInfo: ApplicationInfo): void {
  app.set('view engine', 'njk')

  app.locals.asset_path = '/assets/'
  app.locals.applicationName = 'Incident Reporting'
  app.locals.production = config.production
  app.locals.environment = config.environment

  app.locals.authUrl = config.apis.hmppsAuth.externalUrl
  app.locals.dpsUrl = config.dpsUrl
  app.locals.supportUrl = config.supportUrl

  // Cachebusting version string
  if (config.production) {
    // Version only changes with new commits
    app.locals.version = applicationInfo.gitShortHash
  } else {
    // Version changes every request
    app.use((req, res, next) => {
      res.locals.version = Date.now().toString()
      return next()
    })
  }

  const njkEnv = nunjucks.configure(
    [
      path.join(__dirname, '../../server/views'),
      'node_modules/govuk-frontend/dist',
      'node_modules/@ministryofjustice/frontend/',
    ],
    {
      autoescape: true,
      express: app,
    },
  )

  njkEnv.addFilter('initialiseName', initialiseName)
}
