import FormWizardPage from '../formWizard'
import type { PageElement } from '../page'

// eslint-disable-next-line import/prefer-default-export
export class DescriptionAddendumPage extends FormWizardPage {
  constructor() {
    super('Incident description')
  }

  get descriptionChunks(): PageElement<HTMLDivElement> {
    return cy.get('.app-description-chunks')
  }

  enterDescriptionAddendum(description: string): PageElement<HTMLTextAreaElement> {
    return this.textareaInput('descriptionAddendum').clear().type(description)
  }
}
