import FormWizard from 'hmpo-form-wizard'
import steps from './steps'
import fields from './fields'
import RemoveStaff from '../../../../controllers/removeStaff/removeStaff'

// eslint-disable-next-line import/prefer-default-export
export const removeStaffRouter = FormWizard(steps, fields, {
  name: 'removeStaff',
  templatePath: 'pages/removeStaff',
  checkSession: false,
  csrf: false,
  controller: RemoveStaff,
})
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore because express types do not mention this property and form wizard does not allow you to pass in config for it's root router
removeStaffRouter.mergeParams = true
