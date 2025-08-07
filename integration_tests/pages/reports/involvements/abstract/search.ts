import FormWizardPage from '../../../formWizard'
import type { PageElement } from '../../../page'

export abstract class SearchPage extends FormWizardPage {
  enterQuery(query: string): PageElement<HTMLInputElement> {
    return this.textInput('q').clear().type(query)
  }

  protected saveAndContinueText = 'Search'

  showsNoTable(): Cypress.Chainable<void> {
    return cy.get<HTMLTableRowElement>('.app-involvement-search-results').should('not.exist').end()
  }

  get tableRows(): PageElement<HTMLTableRowElement> {
    return cy.get<HTMLTableRowElement>('table.app-involvement-search-results tbody tr.govuk-table__row')
  }

  selectLink(index: number): PageElement<HTMLAnchorElement> {
    return this.tableRows.eq(index).find('a').contains('Select')
  }
}
