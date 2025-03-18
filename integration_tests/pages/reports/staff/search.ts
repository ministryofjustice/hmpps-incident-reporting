import FormWizardPage from '../../formWizard'

export default class StaffSearchPage extends FormWizardPage {
  constructor(results?: { found: true } | { notFound: string }) {
    let pageTitle: string
    if (!results) {
      pageTitle = 'Search for a member of staff involved in the incident'
    } else if ('found' in results) {
      pageTitle = 'Select the member of staff you want to add'
    } else if ('notFound' in results) {
      pageTitle = `‘${results.notFound}’ cannot be found`
    }
    super(pageTitle)
  }

  doesNotLinkToManualEntry(): Cypress.Chainable<void> {
    return cy
      .get<HTMLAnchorElement>('a')
      .contains('manually add the member of staff to the report')
      .should('not.exist')
      .end()
  }

  linksToManualEntry(): Cypress.Chainable<void> {
    return cy.get<HTMLAnchorElement>('a').contains('manually add the member of staff to the report').end()
  }

  showsNoTable(): Cypress.Chainable<void> {
    return cy.get<HTMLTableRowElement>('.app-involvement-search-results').should('not.exist').end()
  }

  get tableContents(): Cypress.Chainable<
    {
      name: string
      location: string
      username: string
      email: string
      actionLink: HTMLAnchorElement
    }[]
  > {
    return cy.get<HTMLTableRowElement>('table.app-involvement-search-results tbody tr.govuk-table__row').then(rows =>
      rows
        .map((_, row) => {
          const $cells = Cypress.$(row).find('.govuk-table__cell') as unknown as JQuery<HTMLTableCellElement>
          const name = $cells.eq(0).text().trim()
          const location = $cells.eq(1).text().trim()
          const username = $cells.eq(2).text().trim()
          const email = $cells.eq(3).text().trim()
          const actionLink = ($cells.eq(4).find('a') as unknown as JQuery<HTMLAnchorElement>).get()[0]
          return { name, location, username, email, actionLink }
        })
        .toArray(),
    )
  }
}
