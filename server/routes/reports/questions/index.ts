import express from 'express'
import wizard from 'hmpo-form-wizard'
import { NotFound } from 'http-errors'

import { populateReportConfiguration } from '../../../middleware/populateReportConfiguration'

export const questionsRouter = express.Router({ mergeParams: true })
// NB: questionsRouter is unprotected with permissions checks

questionsRouter.use(populateReportConfiguration(), (req, res, next) => {
  const { reportId } = req.params

  if (!res.locals.reportConfig.active) {
    // forbid editing questions for reports of inactive incident types
    next(new NotFound())
    return
  }

  const wizardRouter = wizard(res.locals.questionSteps, res.locals.questionFields, {
    name: `${reportId}-questions`,
    journeyName: `${reportId}-questions`,
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
