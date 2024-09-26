import express from 'express'
import wizard from 'hmpo-form-wizard'
import steps from './steps'
import fields from './fields'
import populateIncident from '../../middleware/populateIncident'
import populatePrisoner from '../../middleware/populatePrisoner'

const router = express.Router({ mergeParams: true })

router.use(
  populateIncident(),
  populatePrisoner(),
  wizard(steps, fields, {
    name: 'addPrisoner',
    templatePath: 'pages/addPrisoner',
    checkSession: false,
    csrf: false,
  }),
)

export default router
