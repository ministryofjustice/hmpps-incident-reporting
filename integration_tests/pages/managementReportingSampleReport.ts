import Page, { PageElement } from './page'

export default class ManagementReportingSampleReportPage extends Page {
  constructor() {
    super('Incident Report Summary', 'View management report')
  }

  get title(): PageElement<HTMLSpanElement> {
    return cy.get('[class=govuk-heading-l]')
  }
}
