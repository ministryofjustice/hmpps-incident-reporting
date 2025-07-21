import express from 'express'
import FormWizard from 'hmpo-form-wizard'

import { logoutUnless, hasPermissionTo } from '../../../../middleware/permissions'
import { populateReport } from '../../../../middleware/populateReport'

import { RemoveReport } from './controller'
import { fields } from './fields'
import { steps } from './steps'

const removeReport = FormWizard(steps, fields, {
  name: 'removeReport',
  journeyName: 'removeReport',
  template: 'pages/reports/actions/removeReport',
  checkSession: false,
  csrf: false,
  controller: RemoveReport,
})
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore because express types do not mention this property and form wizard does not allow you to pass in config for it's root router
removeReport.mergeParams = true
// eslint-disable-next-line import/prefer-default-export
export const removeReportRouter = express.Router({ mergeParams: true })
removeReportRouter.use(
  populateReport(true),
  // TODO: incorrect action check
  logoutUnless(hasPermissionTo('edit')),
  removeReport,
)
