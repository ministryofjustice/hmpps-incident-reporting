import express from 'express'
import wizard from 'hmpo-form-wizard'
import { NotFound } from 'http-errors'

import { populateReportConfiguration } from '../../../middleware/populateReportConfiguration'
import config from '../../../config'
import { missingLocalsError } from '../../../errors'

export const questionsRouter = express.Router({ mergeParams: true })
// NB: questionsRouter is unprotected with permissions checks

questionsRouter.use(populateReportConfiguration(), (req, res, next) => {
  const { reportId } = req.params
  const { reportConfig, questionSteps, questionFields } = res.locals

  if (!reportConfig) {
    next(missingLocalsError('questionsRouter()', 'res.locals.reportConfig'))
    return
  }
  if (!questionSteps) {
    next(missingLocalsError('questionsRouter()', 'res.locals.questionSteps'))
    return
  }
  if (!questionFields) {
    next(missingLocalsError('questionsRouter()', 'res.locals.questionFields'))
    return
  }

  if (!(reportConfig.active || config.incidentTypesOverride.has(reportConfig.incidentType))) {
    // Forbid editing questions only when the type's config itself is inactive (its questions or
    // response options have been deactivated, so steps cannot be generated properly). This is
    // independent of date-based retirement: a date-retired but still-active type (e.g.
    // FOOD_REFUSAL_1, CLOSE_DOWN_SEARCH_1) keeps a complete config and its existing reports
    // remain editable — only the new-report/change-type picker hides it (see typeFields.ts).
    next(new NotFound())
    return
  }

  const wizardRouter = wizard(questionSteps, questionFields, {
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
