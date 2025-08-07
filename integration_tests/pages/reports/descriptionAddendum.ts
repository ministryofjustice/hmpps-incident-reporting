import FormWizardPage from '../formWizard'
import type { PageElement } from '../page'

export class DescriptionAddendumPage extends FormWizardPage {
  constructor() {
    super('Incident description')
  }

  get descriptionChunks() {
    return cy.get<HTMLLIElement>('.app-description-chunks li').then(chunks =>
      chunks
        .map((_, chunk) => {
          const $chunk = Cypress.$(chunk)
          return {
            name: $chunk.find('strong').text().trim(),
            date: $chunk.find('small').text().trim(),
            text: $chunk.find('p').text().trim(),
          }
        })
        .toArray(),
    )
  }

  enterDescriptionAddendum(description: string): PageElement<HTMLTextAreaElement> {
    return this.textareaInput('descriptionAddendum').clear().type(description)
  }
}
