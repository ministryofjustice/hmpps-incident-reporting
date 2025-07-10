import type { Request, Response, NextFunction, RequestHandler } from 'express'

import { PrisonApi } from '../data/prisonApi'
import { type Services } from '../services'
import { setActiveAgencies } from '../data/activeAgencies'

/**
 * Middleware to update the agencies where service is active
 *
 * Gets a fresh copy of the active agencies, using `prisonApi.getAgenciesSwitchedOn()`
 * Sets `activeAgencies` but also the `applicationInfo` (which is a
 * singleton with `the additionalFields.activeAgencies` being updated when
 * `activeAgencies` changes)
 */
export default function updateActiveAgencies({ hmppsAuthClient, applicationInfo }: Services): RequestHandler {
  return async (_req: Request, _res: Response, next: NextFunction) => {
    const systemToken = await hmppsAuthClient.getToken()
    const prisonApi = new PrisonApi(systemToken)

    const newActiveAgencies = await prisonApi.getAgenciesSwitchedOn()
    setActiveAgencies(newActiveAgencies)
    // eslint-disable-next-line no-param-reassign
    applicationInfo.additionalFields.activeAgencies = newActiveAgencies

    next()
  }
}
