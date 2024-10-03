import express from 'express'
import wizard from 'hmpo-form-wizard'

import { populatePrisoner } from '../../middleware/populatePrisoner'
import { populateReport } from '../../middleware/populateReport'
import steps from './steps'
import fields from './fields'

const router = express.Router({ mergeParams: true })

router.use(
  populateReport(),
  populatePrisoner(),
  wizard(steps, fields, {
    name: 'addPrisoner',
    templatePath: 'pages/addPrisoner',
    checkSession: false,
    csrf: false,
  }),
)

export default router
