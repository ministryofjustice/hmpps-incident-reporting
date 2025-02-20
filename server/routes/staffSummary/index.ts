import express from 'express'
import wizard from 'hmpo-form-wizard'

import { populateReport } from '../../middleware/populateReport'
import steps from './steps'
import fields from './fields'
import { logoutIf } from '../../middleware/permissions'
import { cannotEditReport } from '../reports/permissions'

const router = express.Router({ mergeParams: true })

router.use(
  populateReport(true),
  logoutIf(cannotEditReport),
  wizard(steps, fields, {
    name: 'staffSummary',
    templatePath: 'pages/staffSummary',
    checkSession: false,
    csrf: false,
  }),
)

export default router
