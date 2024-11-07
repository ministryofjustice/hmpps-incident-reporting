import express from 'express'
import wizard from 'hmpo-form-wizard'
import { BadRequest } from 'http-errors'

import { generateFields, generateSteps } from '../../data/incidentTypeConfiguration/formWizard'
import { getTypeDetails } from '../../reportConfiguration/constants'
import { getIncidentTypeConfiguration } from '../../reportConfiguration/types'
import asyncMiddleware from '../../middleware/asyncMiddleware'

const router = express.Router({ mergeParams: true })

router.use(
  asyncMiddleware(async (req, res, next) => {
    const { incidentReportingApi } = res.locals.apis
    const reportId = req.params.id

    const report = await incidentReportingApi.getReportById(reportId)

    const reportTypeFound = getTypeDetails(report.type)
    if (!reportTypeFound) {
      throw new BadRequest(`Invalid report type '${report.type}' for report ${reportId}`)
    }

    const config = await getIncidentTypeConfiguration(report.type)

    const steps = generateSteps(config)
    const fields = generateFields(config)

    const wizardRouter = wizard(steps, fields, {
      name: `${reportId}-questions`,
      templatePath: 'pages/wip/questions',
      // Needs to be false, session already handled by application
      checkSession: false,
      // Needs to be false, CSRF already handled by application
      csrf: false,
    })
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore because express types do not mention this property
    // and form wizard does not allow you to pass in config for it's
    // root router
    wizardRouter.mergeParams = true
    wizardRouter(req, res, next)
  }),
)

export default router
