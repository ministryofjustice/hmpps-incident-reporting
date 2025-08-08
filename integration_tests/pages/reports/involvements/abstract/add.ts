import FormWizardPage from '../../../formWizard'
import type { PageElement } from '../../../page'

export abstract class AddInvolvementsPage extends FormWizardPage {
  protected abstract roleFieldName: string

  get roleChoices() {
    return this.radioOrCheckboxChoices(this.roleFieldName)
  }

  protected selectRole(roleLabel: string): PageElement<HTMLLabelElement> {
    return this.radioOrCheckboxButton(this.roleFieldName, roleLabel).click()
  }

  get commentBox(): PageElement<HTMLTextAreaElement> {
    return this.textareaInput('comment')
  }

  enterComment(comment: string): PageElement<HTMLTextAreaElement> {
    return this.commentBox.clear().type(comment)
  }
}
