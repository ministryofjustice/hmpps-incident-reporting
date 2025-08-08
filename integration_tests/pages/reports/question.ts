import format from '../../../server/utils/format'
import FormWizardPage from '../formWizard'
import type { PageElement } from '../page'

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

  selectResponses(questionCode: string, ...responseLabels: string[]): void {
    for (const responseLabel of responseLabels) {
      this.radioOrCheckboxButton(questionCode, responseLabel).click()
    }
  }

  enterComment(questionCode: string, responseCode: string, comment: string): PageElement<HTMLInputElement> {
    return this.textInput(`${questionCode}-${responseCode}-comment`).clear().type(comment)
  }

  enterDate(questionCode: string, responseCode: string, date: Date | string): PageElement<HTMLInputElement> {
    const value = date instanceof Date ? format.shortDate(date) : date
    return this.dateInput(`${questionCode}-${responseCode}-date`).clear().type(value)
  }
}
