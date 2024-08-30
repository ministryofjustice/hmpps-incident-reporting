/* eslint-disable no-param-reassign */
import fs from 'node:fs'
import path from 'node:path'

import express from 'express'
import nunjucks from 'nunjucks'
import { isFunction } from 'lodash'

import logger from '../../logger'
import config from '../config'
import {
  convertToTitleCase,
  findFieldInErrorSummary,
  govukSelectInsertDefault,
  govukSelectSetSelected,
  initialiseName,
  nameOfPerson,
  reversedNameOfPerson,
} from './utils'
import format from './format'

export default function nunjucksSetup(app: express.Express): void {
  app.set('view engine', 'njk')

  app.locals.asset_path = '/assets/'
  app.locals.applicationName = 'Incident Reporting'
  app.locals.production = config.production
  app.locals.environment = config.environment

  app.locals.authUrl = config.apis.hmppsAuth.externalUrl
  app.locals.dpsUrl = config.dpsUrl
  app.locals.supportUrl = config.supportUrl

  let assetManifest: Record<string, string> = {}
  try {
    const assetMetadataPath = path.resolve(__dirname, '../../assets/manifest.json')
    assetManifest = JSON.parse(fs.readFileSync(assetMetadataPath, 'utf8'))
  } catch (e) {
    if (process.env.NODE_ENV !== 'test') {
      logger.error(`Could not read asset manifest file: ${e.message}`)
    }
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

  function callAsMacro(name: string) {
    const macro = this.ctx[name]

    if (!isFunction(macro)) {
      // eslint-disable-next-line no-console
      console.log(`'${name}' macro does not exist`)
      return () => ''
    }

    return macro
  }

  njkEnv.addFilter('assetMap', (url: string) => assetManifest[url] || url)

  // name formatting
  njkEnv.addFilter('convertToTitleCase', convertToTitleCase)
  njkEnv.addFilter('initialiseName', initialiseName)
  njkEnv.addFilter('nameOfPerson', nameOfPerson)
  njkEnv.addFilter('reversedNameOfPerson', reversedNameOfPerson)

  // form helpers
  njkEnv.addFilter('findFieldInErrorSummary', findFieldInErrorSummary)
  njkEnv.addFilter('govukSelectInsertDefault', govukSelectInsertDefault)
  njkEnv.addFilter('govukSelectSetSelected', govukSelectSetSelected)

  // date/datetime formatting
  njkEnv.addFilter('dateAndTime', format.dateAndTime)
  njkEnv.addFilter('date', format.date)
  njkEnv.addFilter('shortDate', format.shortDate)

  njkEnv.addGlobal('callAsMacro', callAsMacro)
}
