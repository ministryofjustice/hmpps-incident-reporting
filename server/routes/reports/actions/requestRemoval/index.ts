import express from 'express'
import FormWizard from 'hmpo-form-wizard'

import { logoutUnless, hasPermissionTo } from '../../../../middleware/permissions'
import { populateReport } from '../../../../middleware/populateReport'

import { RequestRemovalController } from './controller'
import { fields } from './fields'
import { steps } from './steps'

const requestRemovalWizardRouter = FormWizard(steps, fields, {
  name: 'requestRemoval',
  journeyName: 'requestRemoval',
  template: 'pages/reports/actions/requestRemoval',
  checkSession: false,
  csrf: false,
  controller: RequestRemovalController,
})
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore because express types do not mention this property and form wizard does not allow you to pass in config for it's root router
requestRemovalWizardRouter.mergeParams = true
// eslint-disable-next-line import/prefer-default-export
export const requestRemovalRouter = express.Router({ mergeParams: true })
requestRemovalRouter.use(
  populateReport(false),
  logoutUnless(hasPermissionTo('REQUEST_REMOVAL')),
  requestRemovalWizardRouter,
)
