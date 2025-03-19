import FormWizardPage from '../formWizard'
import type { PageElement } from '../page'

// eslint-disable-next-line import/prefer-default-export
export class QuestionPage extends FormWizardPage {
  constructor(questionRange: [number, number]) {
    // TODO: title will need to become type-specific once content is ready
    let pageTitle: string
    if (questionRange[0] === questionRange[1]) {
      pageTitle = `About the incident – question ${questionRange[0]}`
    } else {
      pageTitle = `About the incident – questions ${questionRange[0]} to ${questionRange[1]}`
    }
    super(pageTitle)
  }

  get questionBlocks(): PageElement<HTMLDivElement> {
    return cy.get('.app-question-block')
  }

  get questionTitles(): Cypress.Chainable<string[]> {
    return this.questionBlocks.then(divs => {
      return divs
        .map((_, div) => {
          const $div = Cypress.$(div)
          // TODO: might need to limit selector so dependent fields are excluded if visible
          return $div.find('.govuk-fieldset__legend').text().trim()
        })
        .toArray()
    })
  }
}
