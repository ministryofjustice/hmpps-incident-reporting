import config from '../../server/config'
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

  verifyDprSignpost() {
    const { dprUrl } = config
    return cy
      .get('.dpr-signpost')
      .should('contain.text', 'You can view Management and Operational reports in Digital Prison Reporting.')
      .within(() => {
        cy.get('a').should('have.attr', 'href', `${dprUrl}?dpr-reports-catalogue_search_input=incident+reports`)
      })
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
}
