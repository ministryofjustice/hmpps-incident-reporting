import express from 'express'
import wizard from 'hmpo-form-wizard'
import steps from './steps'
import fields from './fields'
import protectRoute from '../../middleware/protectRoute'

const router = express.Router({ mergeParams: true })

router.use(
  //protectRoute('test_new_incident'),
  wizard(steps, fields, {
    name: 'createIncident',
    templatePath: 'pages/createIncident',
    csrf: false,
  }),
)

export default router
