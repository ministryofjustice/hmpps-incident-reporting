import FormWizardPage from '../../formWizard'

export default class RemoveStaffInvolvementsPage extends FormWizardPage {
  constructor(name: string) {
    super(`Are you sure you want to remove ${name}?`, 'Remove member of staff from report')
  }

  selectRadioButton(text: string) {
    this.radioOrCheckboxButton('confirmRemove', text).click()
  }
}
