import FormWizardPage from '../../formWizard'

export default class RemovePrisonerInvolvementsPage extends FormWizardPage {
  constructor(prisonerNumber: string, name: string) {
    super(`Are you sure you want to remove ${prisonerNumber}: ${name}?`, 'Remove prisoner from report')
  }

  selectRadioButton(text: string) {
    this.radioOrCheckboxButton('confirmRemove', text).click()
  }
}
