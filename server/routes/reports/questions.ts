import express from 'express'
import wizard from 'hmpo-form-wizard'

import { logoutIf } from '../../middleware/permissions'
import { populateReport } from '../../middleware/populateReport'
import { populateReportConfiguration } from '../../middleware/populateReportConfiguration'
import { cannotEditReport } from './permissions'

// eslint-disable-next-line import/prefer-default-export
export const questionsRouter = express.Router({ mergeParams: true })
questionsRouter.use(populateReport(), logoutIf(cannotEditReport), populateReportConfiguration(), (req, res, next) => {
  const reportId = req.params.id

  const wizardRouter = wizard(res.locals.questionSteps, res.locals.questionFields, {
    name: `${reportId}-questions`,
    template: 'pages/reports/questions',
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
})
