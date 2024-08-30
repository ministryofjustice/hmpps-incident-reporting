import express from 'express'
import wizard from 'hmpo-form-wizard'
import steps from './steps'
import fields from './fields'
import populateIncident from '../../middleware/populateIncident'

const router = express.Router({ mergeParams: true })

router.use(
  populateIncident(),
  wizard(steps, fields, {
    name: 'changeIncident',
    templatePath: 'pages/changeIncident',
    csrf: false,
  }),
)

export default router
