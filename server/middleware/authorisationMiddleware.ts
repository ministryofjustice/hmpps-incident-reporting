import type { RequestHandler } from 'express'
import { jwtDecode } from 'jwt-decode'

import logger from '../../logger'
import type { Services } from '../services'

export default function authorisationMiddleware(services: Services, authorisedRoles: string[] = []): RequestHandler {
  return (req, res, next) => {
    /** Returns true if current user has given role (NB: remove ROLE_ prefix) */
    res.locals.userHasRole = (role: string) => {
      const userRoles = res.locals?.user?.roles || services.userService.getUserRoles(res.locals?.user?.token) || []
      return Boolean(userRoles.includes(role))
    }

    // authorities in the user token will always be prefixed by ROLE_.
    // Convert roles that are passed into this function without the prefix so that we match correctly.
    const authorisedAuthorities = authorisedRoles.map(role => (role.startsWith('ROLE_') ? role : `ROLE_${role}`))
    if (res.locals?.user?.token) {
      const { authorities: roles = [] } = jwtDecode(res.locals.user.token) as { authorities?: string[] }

      if (authorisedAuthorities.length && !roles.some(role => authorisedAuthorities.includes(role))) {
        logger.error('User is not authorised to access this')
        return res.redirect('/authError')
      }

      return next()
    }

    req.session.returnTo = req.originalUrl
    return res.redirect('/sign-in')
  }
}
