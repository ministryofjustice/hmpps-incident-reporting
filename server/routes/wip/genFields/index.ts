import express from 'express'
import wizard from 'hmpo-form-wizard'
import createIncidentFields from '../../../reportConfiguration/generate_fields'
import ASSAULT from '../../../reportConfiguration/types/ASSAULT'
import createIncidentSteps from '../../../reportConfiguration/generate_steps'

const router = express.Router({ mergeParams: true })

router.use(
  wizard(createIncidentSteps(ASSAULT), createIncidentFields(ASSAULT), {
    name: 'genFields',
    templatePath: 'pages/wip/genFields',
    checkSession: false,
    csrf: false,
  }),
)

export default router
