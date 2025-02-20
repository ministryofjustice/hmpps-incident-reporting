import FormWizard from 'hmpo-form-wizard'

import PrisonerSummary from '../../../../controllers/prisonerSummary/prisonerSummary'
import { fields } from './fields'
import { steps } from './steps'

// eslint-disable-next-line import/prefer-default-export
export const summaryRouter = FormWizard(steps, fields, {
  name: 'prisonerSummary',
  checkSession: false,
  csrf: false,
  template: 'pages/prisoners/summary',
  controller: PrisonerSummary,
})
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore because express types do not mention this property and form wizard does not allow you to pass in config for it's root router
summaryRouter.mergeParams = true
