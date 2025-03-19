import FormWizardPage from '../../../formWizard'
import type { PageElement } from '../../../page'

// eslint-disable-next-line import/prefer-default-export
export abstract class SearchPage extends FormWizardPage {
  showsNoTable(): Cypress.Chainable<void> {
    return cy.get<HTMLTableRowElement>('.app-involvement-search-results').should('not.exist').end()
  }

  get tableRows(): PageElement<HTMLTableRowElement> {
    return cy.get<HTMLTableRowElement>('table.app-involvement-search-results tbody tr.govuk-table__row')
  }
}
