import format from '../../../server/utils/format'
import FormWizardPage from '../formWizard'
import type { PageElement } from '../page'

export default class DetailsPage extends FormWizardPage {
  constructor() {
    super('Incident summary')
  }

  enterDate(date: Date | string): PageElement<HTMLInputElement> {
    const value = date instanceof Date ? format.shortDate(date) : date
    return this.dateInput('incidentDate').clear().type(value)
  }

  enterTime(hours: string, minutes: string): void {
    this.timeInput('incidentTime', 'hours').clear().type(hours)
    this.timeInput('incidentTime', 'minutes').clear().type(minutes)
  }

  enterDescription(description: string): PageElement<HTMLTextAreaElement> {
    return this.textareaInput('description').clear().type(description)
  }

  get dialogue(): PageElement<HTMLDialogElement> {
    return cy.get('dialog.app-dialogue')
  }

  get dialogueCloseButton(): PageElement<HTMLButtonElement> {
    return this.dialogue.find('button').contains('×')
  }

  get dialogueYesButton(): PageElement<HTMLButtonElement> {
    return this.dialogue.find('button').contains('Yes')
  }

  get dialogueNoButton(): PageElement<HTMLButtonElement> {
    return this.dialogue.find('button').contains('No')
  }
}
