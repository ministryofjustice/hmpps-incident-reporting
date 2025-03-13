import Page, { PageElement } from './page'

export default class ManagementReportingSampleReportPage extends Page {
  constructor() {
    super('summary', 'View management report')
  }

  get title(): PageElement<HTMLSpanElement> {
    return cy.get('[class=govuk-heading-l]')
  }
}
