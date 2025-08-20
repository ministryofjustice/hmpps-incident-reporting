import Page, { PageElement } from './page'

export class ManagementReportingSampleReportPage extends Page {
  constructor() {
    super('Incident report summary', 'View management report')
  }

  get title(): PageElement<HTMLSpanElement> {
    return cy.get('[class=govuk-heading-l]')
  }
}
