import express from 'express'
import wizard from 'hmpo-form-wizard'

import asyncMiddleware from '../../middleware/asyncMiddleware'
import { populateReport } from '../../middleware/populateReport'

const router = express.Router({ mergeParams: true })

router.use(
  populateReport(),
  asyncMiddleware(async (req, res, next) => {
    const reportId = req.params.id

    const wizardRouter = wizard(res.locals.reportSteps, res.locals.reportFields, {
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
