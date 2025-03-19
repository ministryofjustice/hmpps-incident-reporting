import FormWizardPage from '../../../formWizard'

// eslint-disable-next-line import/prefer-default-export
export class ManualStaffEntryPage extends FormWizardPage {
  constructor() {
    super('Manually add a member of staff')
  }

  enterFirstName(firstName: string): void {
    this.textInput('firstName').clear().type(firstName)
  }

  enterLastName(lastName: string): void {
    this.textInput('lastName').clear().type(lastName)
  }

  submit(buttonText = 'Add member of staff'): void {
    super.submit(buttonText)
  }
}
