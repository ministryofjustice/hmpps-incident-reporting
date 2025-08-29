import Page, { type PageElement } from './page'

export class HomePage extends Page {
  constructor() {
    super('Incident reporting')
  }

  get headerUserName(): PageElement<HTMLSpanElement> {
    return cy.get('[data-qa=header-user-name]')
  }

  get headerEnvironmentTag(): PageElement {
    return cy.get('[data-qa=header-environment-tag]')
  }

  get cards(): PageElement<HTMLDivElement> {
    return cy.get('.dps-card')
  }

  get cardDetails() {
    return this.cards.then($cards =>
      $cards
        .map((_, card) => {
          const $card = Cypress.$(card) as unknown as JQuery<HTMLDivElement>
          return {
            title: $card.find('.dps-card__heading').text().trim(),
            url: $card.find('.dps-card__link').attr('href'),
          }
        })
        .toArray(),
    )
  }

  clickCreatePrisonReportCard(): Cypress.Chainable {
    return this.cards.contains('Create an incident report').click()
  }

  clickCreatePecsReportCard(): Cypress.Chainable {
    return this.cards.contains('Create a PECS incident report').click()
  }

  clickViewReportsCard(): Cypress.Chainable {
    return this.cards.contains('Search incident reports').click()
  }

  clickManagementReportsCard(): Cypress.Chainable {
    return this.cards.contains('Management reporting').click()
  }
}
