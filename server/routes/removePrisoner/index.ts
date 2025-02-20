import express from 'express'
import wizard from 'hmpo-form-wizard'

import steps from './steps'
import fields from './fields'
import { logoutIf } from '../../middleware/permissions'
import { cannotEditReport } from '../reports/permissions'
import { populatePrisonerToRemove } from '../../middleware/populatePrisonerToRemove'

const router = express.Router({ mergeParams: true })

router.use(
  populatePrisonerToRemove(),
  logoutIf(cannotEditReport),
  wizard(steps, fields, {
    name: 'removePrisoner',
    templatePath: 'pages/removePrisoner',
    checkSession: false,
    csrf: false,
  }),
)

export default router
