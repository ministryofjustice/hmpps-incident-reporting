import express from 'express'
import FormWizard from 'hmpo-form-wizard'

import { logoutUnless, hasPermissionTo } from '../../../../middleware/permissions'
import { populateReport } from '../../../../middleware/populateReport'

import { ReopenController } from './controller'
import { fields } from './fields'
import { steps } from './steps'

const reopenWizardRouter = FormWizard(steps, fields, {
  name: 'reopen',
  journeyName: 'reopen',
  template: 'pages/reports/actions/reopen',
  checkSession: false,
  csrf: false,
  controller: ReopenController,
})
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore because express types do not mention this property and form wizard does not allow you to pass in config for it's root router
reopenWizardRouter.mergeParams = true
// eslint-disable-next-line import/prefer-default-export
export const reopenRouter = express.Router({ mergeParams: true })
reopenRouter.use(populateReport(false), logoutUnless(hasPermissionTo('recall')), reopenWizardRouter)
