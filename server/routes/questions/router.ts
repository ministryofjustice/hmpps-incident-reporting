import express from 'express'
import wizard from 'hmpo-form-wizard'

import { generateFields, generateSteps } from '../../data/incidentTypeConfiguration/formWizard'
import FINDS from '../../reportConfiguration/types/FINDS'

const router = express.Router({ mergeParams: true })

// TODO: Get type based on request/URL?
const config = FINDS
const steps = generateSteps(config)
const fields = generateFields(config)

router.use(
  wizard(steps, fields, {
    templatePath: 'pages/questions',
  }),
)

export default router
