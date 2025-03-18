import FormWizardPage from '../../formWizard'
import { getStaffInvolvementRoleDetails, StaffInvolvementRole } from '../../../../server/reportConfiguration/constants'

export default class AddStaffInvolvementsPage extends FormWizardPage {
  constructor(who: string, whose: string) {
    super(`How was ${who}`, `${whose} involvement in the incident`)
  }

  get roleChoices() {
    return this.radioOrCheckboxOptions('staffRole')
  }

  selectRole(staffRole: StaffInvolvementRole) {
    this.radioOrCheckboxButton('staffRole', getStaffInvolvementRoleDetails(staffRole).description).click()
  }

  enterComment(comment: string): void {
    this.textareaInput('comment').clear().type(comment)
  }
}
