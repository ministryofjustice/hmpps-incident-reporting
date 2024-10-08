import express from 'express'
import wizard from 'hmpo-form-wizard'

import { populateReport } from '../../middleware/populateReport'
import steps from './steps'
import fields from './fields'

const router = express.Router({ mergeParams: true })

router.use(
  populateReport(),
  wizard(steps, fields, {
    name: 'changeIncident',
    templatePath: 'pages/changeIncident',
    checkSession: false,
    csrf: false,
  }),
)

export default router
