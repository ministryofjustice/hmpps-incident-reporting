import type { RequestHandler } from 'express'

import { PrisonApi } from '../data/prisonApi'
import { type Services } from '../services'

/**
 * Middleware to update the prisons where service is active
 *
 * Gets a fresh copy of the active prisons, using `prisonApi.getServicePrisonIds()`
 * Sets `res.locals.activePrisons` but also the `applicationInfo` (which is a
 * singleton with `the additionalFields.activeAgencies` being updated when
 * `activePrisons` change)
 */
export default function updateActivePrisons({ hmppsAuthClient, applicationInfo }: Services): RequestHandler {
  return async (_req, res, next) => {
    const systemToken = await hmppsAuthClient.getToken()
    const prisonApi = new PrisonApi(systemToken)

    const activePrisons = await prisonApi.getServicePrisonIds()
    res.locals.activePrisons = activePrisons
    // eslint-disable-next-line no-param-reassign
    applicationInfo.additionalFields.activeAgencies = activePrisons

    next()
  }
}
