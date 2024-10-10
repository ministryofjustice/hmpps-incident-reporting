import express from 'express'
import wizard from 'hmpo-form-wizard'
import ASSAULT from '../../../reportConfiguration/types/ASSAULT'
import generateFieldsWithConditionals from '../../../data/incidentTypeConfiguration/wip/generateFieldsWithConditionals'
import generateStepsWithConditionals from '../../../data/incidentTypeConfiguration/wip/generateStepsWithConditionals'

const router = express.Router({ mergeParams: true })

router.use(
  wizard(generateStepsWithConditionals(ASSAULT), generateFieldsWithConditionals(ASSAULT), {
    name: 'genFields',
    templatePath: 'pages/wip/genFields',
    checkSession: false,
    csrf: false,
  }),
)

export default router
