/* eslint-disable no-param-reassign */
import fs from 'node:fs'
import path from 'node:path'

import express from 'express'
import nunjucks from 'nunjucks'

import logger from '../../logger'
import config from '../config'
import { convertToTitleCase, initialiseName, nameOfPerson, reversedNameOfPerson, prisonerLocation } from './utils'
import {
  findFieldInGovukErrorSummary,
  govukCheckedItems,
  govukMultipleCheckedItems,
  govukSelectInsertDefault,
  govukSelectSetSelected,
} from './govukFrontend'
import { isBeingTransferred, isOutside, isInPrison } from '../data/offenderSearchApi'
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

  // misc utils
  njkEnv.addFilter('assetMap', (url: string) => assetManifest[url] || url)
  njkEnv.addGlobal('callAsMacro', callAsMacro)
  njkEnv.addGlobal('getFromContext', getFromContext)

  // name formatting
  njkEnv.addFilter('convertToTitleCase', convertToTitleCase)
  njkEnv.addFilter('initialiseName', initialiseName)
  njkEnv.addFilter('nameOfPerson', nameOfPerson)
  njkEnv.addFilter('reversedNameOfPerson', reversedNameOfPerson)

  // date/datetime formatting
  njkEnv.addFilter('dateAndTime', format.dateAndTime)
  njkEnv.addFilter('date', format.date)
  njkEnv.addFilter('shortDate', format.shortDate)

  // prisoner utils
  njkEnv.addFilter('prisonerLocation', prisonerLocation)
  njkEnv.addFilter('isBeingTransferred', isBeingTransferred)
  njkEnv.addFilter('isOutside', isOutside)
  njkEnv.addFilter('isInPrison', isInPrison)

  // utils for GDS & MoJ components
  njkEnv.addFilter('findFieldInGovukErrorSummary', findFieldInGovukErrorSummary)
  njkEnv.addFilter('govukCheckedItems', govukCheckedItems)
  njkEnv.addFilter('govukMultipleCheckedItems', govukMultipleCheckedItems)
  njkEnv.addFilter('govukSelectInsertDefault', govukSelectInsertDefault)
  njkEnv.addFilter('govukSelectSetSelected', govukSelectSetSelected)
}

function callAsMacro(name: string): (...args: unknown[]) => unknown {
  const macro = this.ctx[name]

  if (typeof macro !== 'function') {
    throw Error(`Macro ${name} not found`)
  }

  return macro
}

/**
 * Install function to look up values from the context by .-separated key path.
 * Inspired by `ctx` from
 * https://github.com/HMPO/hmpo-components/blob/01473508284e1d06ebc72585f970f25f17fba49d/lib/locals.js#L59
 * but has access to the whole context, not just res.locals
 */
function getFromContext(keyPath: string): unknown {
  return keyPath.split('.').reduce((context, key) => context && context[key], this.ctx)
}
