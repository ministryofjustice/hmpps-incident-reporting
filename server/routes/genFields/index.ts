import express from 'express'
import wizard from 'hmpo-form-wizard'
import steps from './steps'
import createIncidentFields from '../../reportConfiguration/generate_fields'
import ASSAULT from '../../reportConfiguration/types/ASSAULT'

const router = express.Router({ mergeParams: true })

router.use(
  wizard(steps, createIncidentFields(ASSAULT), {
    name: 'genFields',
    templatePath: 'pages/genFields',
    checkSession: false,
    csrf: false,
  }),
)

export default router
