import express from 'express'

import { populateReport } from '../../middleware/populateReport'
import { logoutUnless, canCreateReportInActiveCaseload, canEditReport } from '../../middleware/permissions'
import { prisonerInvolvementRouter } from './prisoners'
import { staffInvolvementRouter } from './staff'
import { questionsRouter } from './questions'
import { createReportWizardRouter } from './details/createReport'

// eslint-disable-next-line import/prefer-default-export
export const createReportRouter = express.Router({ mergeParams: true })

// form wizard to save minimal report details
// and mark all routes as being part of report creation journey
createReportRouter.use(
  logoutUnless(canCreateReportInActiveCaseload),
  (_req, res, next) => {
    res.locals.creationJourney = true
    next()
  },
  createReportWizardRouter,
)

// router that handles collecting further details after report is saved
const nestedRouter = express.Router({ mergeParams: true })
createReportRouter.use('/:reportId', nestedRouter)

// require report-editing permissions
nestedRouter.use(populateReport(true), logoutUnless(canEditReport))

// set url prefix for nested routes
nestedRouter.use((req, res, next) => {
  const { reportId } = req.params

  res.locals.reportSubUrlPrefix = `/create-report/${reportId}`

  next()
})

nestedRouter.use('/prisoners', prisonerInvolvementRouter)
nestedRouter.use('/staff', staffInvolvementRouter)
nestedRouter.use('/questions', questionsRouter)

// summary page does not exist as part of creation journey so hitting this path redirects to normal summary page exiting the create journey
nestedRouter.get('/', (req, res) => {
  const { reportId } = req.params as Record<string, string> // type assertion needed since param comes from parent router
  res.redirect(`/reports/${reportId}`)
})
