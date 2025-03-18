import FormWizardPage from '../../formWizard'
import {
  getPrisonerInvolvementRoleDetails,
  PrisonerInvolvementRole,
} from '../../../../server/reportConfiguration/constants'

export default class AddPrisonerInvolvementsPage extends FormWizardPage {
  constructor(whose: string) {
    super(`${whose} involvement in the incident`)
  }

  get radioButtonChoices() {
    return this.radioOrCheckboxOptions('prisonerRole')
  }

  selectType(prisonerRole: PrisonerInvolvementRole) {
    this.radioOrCheckboxButton('prisonerRole', getPrisonerInvolvementRoleDetails(prisonerRole).description).click()
  }

  enterComment(comment: string): void {
    this.textareaInput('comment').clear().type(comment)
  }
}
