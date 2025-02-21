/* eslint-disable no-param-reassign */
import fs from 'node:fs'
import path from 'node:path'

import express from 'express'
import nunjucks from 'nunjucks'
import setUpNunjucksFilters from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/setUpNunjucksFilters'

import logger from '../../logger'
import config from '../config'
import {
  convertToTitleCase,
  initialiseName,
  nameOfPerson,
  reversedNameOfPerson,
  possessive,
  prisonerLocation,
} from './utils'
import {
  findFieldInGovukErrorSummary,
  govukCheckedItems,
  govukMultipleCheckedItems,
  govukCheckedItemsConditional,
  govukCheckedItemsDivider,
  govukSelectInsertDefault,
  govukSelectSetSelected,
} from './govukFrontend'
import { isBeingTransferred, isOutside, isInPrison } from '../data/offenderSearchApi'
import format from './format'
import { isPrisonActiveInService } from '../middleware/permissions'

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
      path.resolve(__dirname, '../../server/views'),
      // GOV.UK Frontend
      'node_modules/govuk-frontend/dist/',
      // MoJ Frontend
      'node_modules/@ministryofjustice/frontend/',
      // Digital Prison Reporting
      'node_modules/@ministryofjustice/hmpps-digital-prison-reporting-frontend/',
      'node_modules/@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/components/',
    ],
    {
      autoescape: true,
      express: app,
    },
  )

  // Digital Prison Reporting configuration
  setUpNunjucksFilters(njkEnv)

  // misc utils
  njkEnv.addFilter('assetMap', (url: string) => assetManifest[url] || url)
  njkEnv.addGlobal('callAsMacro', callAsMacro)
  njkEnv.addGlobal('isPrisonActiveInService', isPrisonActiveInService)
  njkEnv.addGlobal('mergeObjects', (...objects: object[]) => {
    const merged = {}
    for (const o of objects) {
      Object.assign(merged, o)
    }
    return merged
  })
  njkEnv.addGlobal('now', () => new Date())
  njkEnv.addExtension('panic', new PanicExtension())

  // name formatting
  njkEnv.addFilter('convertToTitleCase', convertToTitleCase)
  njkEnv.addFilter('initialiseName', initialiseName)
  njkEnv.addFilter('nameOfPerson', nameOfPerson)
  njkEnv.addFilter('reversedNameOfPerson', reversedNameOfPerson)
  njkEnv.addFilter('possessive', possessive)

  // date/datetime formatting
  njkEnv.addFilter('dateAndTime', format.dateAndTime)
  njkEnv.addFilter('date', format.date)
  njkEnv.addFilter('shortDate', format.shortDate)
  njkEnv.addFilter('time', format.time)

  // prisoner utils
  njkEnv.addFilter('prisonerLocation', prisonerLocation)
  njkEnv.addFilter('isBeingTransferred', isBeingTransferred)
  njkEnv.addFilter('isOutside', isOutside)
  njkEnv.addFilter('isInPrison', isInPrison)

  // utils for GDS & MoJ components
  njkEnv.addFilter('findFieldInGovukErrorSummary', findFieldInGovukErrorSummary)
  njkEnv.addFilter('govukCheckedItems', govukCheckedItems)
  njkEnv.addFilter('govukMultipleCheckedItems', govukMultipleCheckedItems)
  njkEnv.addFilter('govukCheckedItemsConditional', govukCheckedItemsConditional)
  njkEnv.addFilter('govukCheckedItemsDivider', govukCheckedItemsDivider)
  njkEnv.addFilter('govukSelectInsertDefault', govukSelectInsertDefault)
  njkEnv.addFilter('govukSelectSetSelected', govukSelectSetSelected)
}

class PanicExtension implements nunjucks.Extension {
  tags = ['panic']

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parse(parser: any, nodes: any): any {
    const token = parser.nextToken()
    const args = parser.parseSignature(null, true)
    parser.advanceAfterBlockEnd(token.value)
    return new nodes.CallExtension(this, 'panic', args)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  panic(_context: any, message?: string): never {
    const error = new Error(message ?? 'Template rendering aborted')
    error.name = 'Panic'
    throw error
  }
}

function callAsMacro(name: string): (...args: unknown[]) => unknown {
  const macro = this.ctx[name]

  if (typeof macro !== 'function') {
    throw Error(`Macro ${name} not found`)
  }

  return macro
}
