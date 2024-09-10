import type { RequestHandler } from 'express'
import { Forbidden } from 'http-errors'

// TODO: why use this in place of the standard authorisationMiddleware?

/**
 * Request handler that requires current user to have given role
 * NB: remove ROLE_ prefix
 */
export default function protectRoute(role: string): RequestHandler {
  return (_req, res, next) => {
    if (res.locals?.userHasRole(role)) {
      return next()
    }

    return next(new Forbidden(`Forbidden. Missing role '${role}'`))
  }
}
