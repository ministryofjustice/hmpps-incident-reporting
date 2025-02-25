import FormWizard from 'hmpo-form-wizard'

import { fields } from './fields'
import { steps } from './steps'

// eslint-disable-next-line import/prefer-default-export
export const manualAddRouter = FormWizard(steps, fields, {
  name: 'addManualStaffInvolvement',
  checkSession: false,
  csrf: false,
})
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore because express types do not mention this property and form wizard does not allow you to pass in config for it's root router
manualAddRouter.mergeParams = true
