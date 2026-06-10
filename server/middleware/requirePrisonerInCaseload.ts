import type { RequestHandler } from 'express'
import { NotFound } from 'http-errors'

import logger from '../../logger'
import { missingLocalsError } from '../errors'

/**
 * Guards a route so that it can only be accessed when the loaded prisoner is held in one of the
 * current user's caseloads (caseloadId === prisonId). Must run after populatePrisoner().
 *
 * This naturally denies prisoners who are out or in transit, as their prisonId ("OUT" / "TRN")
 * will not match any caseload.
 *
 * A denied prisoner is treated as Not Found rather than Forbidden: the user is legitimately
 * signed in (so the app's 403-triggers-sign-out behaviour would be wrong), and we avoid
 * confirming that a prisoner outside their caseload exists.
 */
export function requirePrisonerInCaseload(): RequestHandler {
  return (_req, res, next): void => {
    const { prisoner, user } = res.locals
    if (!prisoner) {
      next(missingLocalsError('requirePrisonerInCaseload()', 'res.locals.prisoner'))
      return
    }

    const caseloadIds = new Set(user?.caseLoads?.map(caseLoad => caseLoad.caseLoadId) ?? [])
    if (!caseloadIds.has(prisoner.prisonId)) {
      logger.warn(`User denied access to prisoner ${prisoner.prisonerNumber}: not in caseload`)
      next(new NotFound('Prisoner is not in your caseload'))
      return
    }

    next()
  }
}
