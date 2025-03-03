import FormWizard from 'hmpo-form-wizard'

import StaffSummary from './controller'
import { fields } from './fields'
import { steps } from './steps'

// eslint-disable-next-line import/prefer-default-export
export const summaryRouter = FormWizard(steps, fields, {
  name: 'staffSummary',
  checkSession: false,
  csrf: false,
  template: 'pages/staff/summary',
  controller: StaffSummary,
})
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore because express types do not mention this property and form wizard does not allow you to pass in config for it's root router
summaryRouter.mergeParams = true
