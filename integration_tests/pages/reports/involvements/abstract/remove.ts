import FormWizardPage from '../../../formWizard'

// eslint-disable-next-line import/prefer-default-export
export abstract class RemoveInvolvementsPage extends FormWizardPage {
  selectRadioButton(text: string) {
    this.radioOrCheckboxButton('confirmRemove', text).click()
  }
}
