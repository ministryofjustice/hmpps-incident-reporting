import express from 'express'
import wizard from 'hmpo-form-wizard'
import { BadRequest } from 'http-errors'

import { generateFields, generateSteps } from '../../data/incidentTypeConfiguration/formWizard'
import { types } from '../../reportConfiguration/constants'
import { getIncidentTypeConfiguration } from '../../reportConfiguration/types'
import asyncMiddleware from '../../middleware/asyncMiddleware'

const router = express.Router({ mergeParams: true })

router.use(
  asyncMiddleware(async (req, res) => {
    const { reportType } = req.params

    const found = types.find(type => type.code === reportType)
    if (found === undefined) {
      throw new BadRequest('Invalid report type')
    }

    const config = await getIncidentTypeConfiguration(reportType)

    const steps = generateSteps(config)
    const fields = generateFields(config)

    return wizard(steps, fields, {
      templatePath: 'pages/questions',
    })(req, res)
  }),
)

export default router
