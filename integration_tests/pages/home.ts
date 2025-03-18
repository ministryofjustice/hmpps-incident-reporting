import Page, { type PageElement } from './page'

export default class HomePage extends Page {
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

  clickCreateReportCard(): Cypress.Chainable {
    return cy.contains('Report an incident').click()
  }
}
