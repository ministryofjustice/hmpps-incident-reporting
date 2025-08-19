import Page, { PageElement } from './page'

export class ManagementReportingPage extends Page {
  constructor() {
    super('Management reporting', 'Management reporting')
  }

  get title(): PageElement<HTMLSpanElement> {
    return cy.get('[class=govuk-heading-l]')
  }

  get reportLink(): PageElement<HTMLAnchorElement> {
    return cy.get(`#incident-report-summary`)
  }
}
