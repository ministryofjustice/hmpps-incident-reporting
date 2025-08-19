import FormWizardPage from '../formWizard'
import type { PageElement } from '../page'

export class RequestRemovalPage extends FormWizardPage {
  constructor() {
    super('Why do you want to remove this report?')
  }

  get actionChoices() {
    return this.radioOrCheckboxChoices('userAction')
  }

  selectAction(label: string): PageElement<HTMLLabelElement> {
    return this.radioOrCheckboxButton('userAction', label).click()
  }

  enterOriginalReportReference(comment: string): PageElement<HTMLInputElement> {
    return this.textInput('originalReportReference').clear().type(comment)
  }

  enterDuplicateComment(comment: string): PageElement<HTMLTextAreaElement> {
    return this.textareaInput('duplicateComment').clear().type(comment)
  }

  enterNotReportableComment(comment: string): PageElement<HTMLTextAreaElement> {
    return this.textareaInput('notReportableComment').clear().type(comment)
  }

  protected saveAndContinueText = 'Request to remove report'
}
