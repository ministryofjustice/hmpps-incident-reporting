import type { Request, Response, NextFunction, RequestHandler } from 'express'

import { PrisonApi } from '../data/prisonApi'
import { type Services } from '../services'
import { SERVICE_ALL_AGENCIES, setActiveAgencies } from '../data/activeAgencies'

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
    applicationInfo.additionalFields.activeAgencies = replaceStarAllForDps(newActiveAgencies)

    next()
  }
}

/**
 * In DPS the `'***'` string in `applicationInfo.additionalFields.activeAgencies`
 * means "all agencies". This function returns ['***'] when `activeAgencies` contains
 * the Prison API special signifier `'*ALL*'` (which has the same meaning)
 */
function replaceStarAllForDps(activeAgencies: string[]): string[] {
  if (activeAgencies.includes(SERVICE_ALL_AGENCIES)) {
    return ['***']
  }

  return activeAgencies
}
