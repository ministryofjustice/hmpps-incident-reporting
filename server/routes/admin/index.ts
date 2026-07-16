import { Router } from 'express'

import { logoutUnless } from '../../middleware/permissions'
import makeSyncNomisRouter from './syncNomis'

/**
 * Admin screens for developers/admins. Unlinked from the rest of the UI (no homepage card); a user
 * reaches them by knowing the URL. Gated on the admin role, which is held in addition to a base role.
 */
export default function makeAdminRouter(): Router {
  const router = Router()

  router.use(logoutUnless(permissions => permissions.isAdmin))
  router.use('/sync-nomis', makeSyncNomisRouter())

  return router
}
