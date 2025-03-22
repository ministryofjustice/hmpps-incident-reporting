import FormWizardPage from '../formWizard'
import type { PageElement } from '../page'

export default class ReportPage extends FormWizardPage {
  constructor(reference: string, unsubmitted = false) {
    super(
      unsubmitted ? `Check your answers – incident reference ${reference}` : `Incident reference ${reference}`,
      `Incident reference ${reference}`,
    )
  }

  get location(): PageElement<HTMLSpanElement> {
    return cy.get('[data-qa=report-location]')
  }

  get reportedBy(): PageElement<HTMLSpanElement> {
    return cy.get('[data-qa=report-reported-by]')
  }

  get status(): PageElement<HTMLSpanElement> {
    return cy.get('[data-qa=report-status]')
  }

  private checkSummaryCard(title: string) {
    const getCard = () => cy.get('.govuk-summary-card__title').contains(title).parent().parent()

    return {
      shouldHaveActionLink(text: string, url: string): Cypress.Chainable<void> {
        return getCard()
          .find('.govuk-summary-card__actions')
          .find('a')
          .should('contain.text', text)
          .and('have.attr', 'href', url)
          .end()
      },

      shouldNotHaveActionLinks(): Cypress.Chainable<void> {
        return getCard().find('.govuk-summary-card__actions').should('not.exist').end()
      },

      get cardContents(): Cypress.Chainable<{ key: string; value: string; actionLinks: HTMLAnchorElement[] }[]> {
        return getCard()
          .find('.govuk-summary-list')
          .then($contentDiv => {
            return $contentDiv
              .find('.govuk-summary-list__row')
              .map((_, rowDiv: HTMLDivElement) => {
                const $rowDiv = Cypress.$(rowDiv)
                const key = $rowDiv.find('.govuk-summary-list__key').text().trim()
                const value = $rowDiv.find('.govuk-summary-list__value').text().trim()
                const actionLinks = (
                  $rowDiv.find('.govuk-summary-list__actions a') as unknown as JQuery<HTMLAnchorElement>
                ).toArray()
                return { key, value, actionLinks }
              })
              .toArray()
          })
      },
    }
  }

  get summary() {
    return this.checkSummaryCard('Incident summary')
  }

  get prisonerInvolvements() {
    return this.checkSummaryCard('Prisoners involved')
  }

  get staffInvolvements() {
    return this.checkSummaryCard('Staff involved')
  }

  get questions() {
    // TODO: title will need to become type-specific once content is ready
    return this.checkSummaryCard('About the incident')
  }

  clickThroughToQuestionPage(index: number, expectedLabel: string): Cypress.Chainable<void> {
    return this.questions.cardContents
      .then(rows => {
        expect(rows.length).is.greaterThan(index)
        const row = rows[index]
        const link = row.actionLinks[0]
        expect(link.textContent).to.contain(expectedLabel)
        link.click()
      })
      .end()
  }
}
