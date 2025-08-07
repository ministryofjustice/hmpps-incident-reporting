import FormWizard from 'hmpo-form-wizard'

import { RemoveStaff } from './controller'
import { fields } from './fields'
import { steps } from './steps'

export const removeRouter = FormWizard(steps, fields, {
  name: 'removeStaff',
  journeyName: 'removeStaff',
  template: 'pages/staff/remove',
  checkSession: false,
  csrf: false,
  controller: RemoveStaff,
})
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore because express types do not mention this property and form wizard does not allow you to pass in config for it's root router
removeRouter.mergeParams = true
