import FormWizardPage from '../../../formWizard'
import type { PageElement } from '../../../page'

// eslint-disable-next-line import/prefer-default-export
export class ManualStaffEntryPage extends FormWizardPage {
  constructor() {
    super('Manually add a member of staff')
  }

  enterFirstName(firstName: string): PageElement<HTMLInputElement> {
    return this.textInput('firstName').clear().type(firstName)
  }

  enterLastName(lastName: string): PageElement<HTMLInputElement> {
    return this.textInput('lastName').clear().type(lastName)
  }

  protected saveAndContinueText = 'Add member of staff'
}
