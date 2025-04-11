import FormWizard from 'hmpo-form-wizard'

import { PrisonerSearchController } from './controller'
import { fields } from './fields'
import { steps } from './steps'

// eslint-disable-next-line import/prefer-default-export
export const searchRouter = FormWizard(steps, fields, {
  name: 'prisonerInvolvementSearch',
  journeyName: 'prisonerInvolvementSearch',
  checkSession: false,
  csrf: false,
  template: 'pages/prisoners/search',
  controller: PrisonerSearchController,
})
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore because express types do not mention this property and form wizard does not allow you to pass in config for it's root router
searchRouter.mergeParams = true
