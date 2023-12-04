import Page, { PageElement } from './page'

export default class IndexPage extends Page {
  constructor() {
    super('This site is under construction...', 'Incident Reporting - Home')
  }

  get headerUserName(): PageElement<HTMLSpanElement> {
    return cy.get('[data-qa=header-user-name]')
  }

  get headerEnvironmentTag(): PageElement {
    return cy.get('[data-qa=header-environment-tag]')
  }
}
