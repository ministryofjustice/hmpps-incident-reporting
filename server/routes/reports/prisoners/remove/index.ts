import FormWizard from 'hmpo-form-wizard'
import steps from './steps'
import fields from './fields'
import RemovePrisoner from '../../../../controllers/removePrisoner/removePrisoner'

// eslint-disable-next-line import/prefer-default-export
export const removePrisonerRouter = FormWizard(steps, fields, {
  name: 'removePrisoner',
  templatePath: 'pages/removePrisoner',
  checkSession: false,
  csrf: false,
  controller: RemovePrisoner,
})
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore because express types do not mention this property and form wizard does not allow you to pass in config for it's root router
removePrisonerRouter.mergeParams = true
