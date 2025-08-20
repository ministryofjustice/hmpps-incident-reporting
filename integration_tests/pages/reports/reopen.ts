import FormWizardPage from '../formWizard'

export class ReopenPage extends FormWizardPage {
  constructor() {
    super('Are you sure you want reopen this report?')
  }

  protected saveAndContinueText = 'Reopen report'
}
