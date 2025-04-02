import format from '../../../server/utils/format'
import FormWizardPage from '../formWizard'
import type { PageElement } from '../page'

// eslint-disable-next-line import/prefer-default-export
export class QuestionPage extends FormWizardPage {
  constructor(questionRange: [number, number], incidentName: string = 'incident') {
    let pageTitle: string
    if (questionRange[0] === questionRange[1]) {
      pageTitle = `About the ${incidentName} – question ${questionRange[0]}`
    } else {
      pageTitle = `About the ${incidentName} – questions ${questionRange[0]} to ${questionRange[1]}`
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

  selectResponses(questionId: string, ...responseLabels: string[]): void {
    for (const responseLabel of responseLabels) {
      this.radioOrCheckboxButton(questionId, responseLabel).click()
    }
  }

  enterComment(questionId: string, responseId: string, comment: string): PageElement<HTMLInputElement> {
    return this.textInput(`${questionId}-${responseId}-comment`).clear().type(comment)
  }

  enterDate(questionId: string, responseId: string, date: Date | string): PageElement<HTMLInputElement> {
    const value = date instanceof Date ? format.shortDate(date) : date
    return this.dateInput(`${questionId}-${responseId}-date`).clear().type(value)
  }
}
