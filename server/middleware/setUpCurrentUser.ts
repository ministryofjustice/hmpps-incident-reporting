import { Router } from 'express'
import { DprUser } from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dprUser'

import logger from '../../logger'
import type { Services } from '../services'

export default function setUpCurrentUser({ userService }: Services): Router {
  const router = Router()

  router.use(async (_req, res, next) => {
    try {
      if (res.locals.user) {
        const user = await userService.getUser(res.locals.user.token)
        if (user) {
          res.locals.user = { ...user, ...res.locals.user }

          // DPR user locals
          const dprUser = new DprUser()
          // required
          dprUser.token = res.locals.user.token
          dprUser.id = user.uuid
          // optional
          dprUser.activeCaseLoadId = user.activeCaseLoadId
          dprUser.displayName = user.displayName
          dprUser.staffId = user.staffId

          res.locals.dprUser = dprUser
        } else {
          logger.info('No user available')
        }
      }
      next()
    } catch (error) {
      logger.error(error, `Failed to retrieve user for: ${res.locals.user && res.locals.user.username}`)
      next(error)
    }
  })

  return router
}
