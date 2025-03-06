import express from 'express'

import { populateReport } from '../../middleware/populateReport'
import { logoutIf } from '../../middleware/permissions'
import { cannotEditReport } from './permissions'
import { prisonerInvolvementRouter } from './prisoners'
import { staffInvolvementRouter } from './staff'
import { questionsRouter } from './questions'

// eslint-disable-next-line import/prefer-default-export
export const editReportRouter = express.Router({ mergeParams: true })

// require report-editing permissions
editReportRouter.use(populateReport(true), logoutIf(cannotEditReport))

// mark nested routes as NOT being part of report creation journey
editReportRouter.use((_req, res, next) => {
  res.locals.creationJourney = false
  next()
})

editReportRouter.use('/prisoners', prisonerInvolvementRouter)
editReportRouter.use('/staff', staffInvolvementRouter)
editReportRouter.use('/questions', questionsRouter)
