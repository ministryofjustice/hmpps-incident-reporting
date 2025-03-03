import FormWizard from 'hmpo-form-wizard'

import RemovePrisoner from '../../../../controllers/removePrisoner/removePrisoner'
import { fields } from './fields'
import { steps } from './steps'

// eslint-disable-next-line import/prefer-default-export
export const removeRouter = FormWizard(steps, fields, {
  name: 'removePrisoner',
  templatePath: 'pages/removePrisoner',
  checkSession: false,
  csrf: false,
  controller: RemovePrisoner,
})
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore because express types do not mention this property and form wizard does not allow you to pass in config for it's root router
removeRouter.mergeParams = true
