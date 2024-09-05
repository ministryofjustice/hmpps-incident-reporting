import { Router } from 'express'

import type { Services } from '../services'
import populateCurrentUser from './populateCurrentUser'

export default function setUpCurrentUser({ userService }: Services): Router {
  const router = Router({ mergeParams: true })
  router.use(populateCurrentUser(userService))
  return router
}
