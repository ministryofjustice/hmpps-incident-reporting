import FormWizardPage from '../../../formWizard'

export abstract class RemoveInvolvementsPage extends FormWizardPage {
  selectRadioButton(text: string) {
    this.radioOrCheckboxButton('confirmRemove', text).click()
  }
}
