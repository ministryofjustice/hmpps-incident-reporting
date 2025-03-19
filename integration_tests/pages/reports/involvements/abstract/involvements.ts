import FormWizardPage from '../../../formWizard'
import type { PageElement } from '../../../page'

// eslint-disable-next-line import/prefer-default-export
export abstract class InvolvementsPage extends FormWizardPage {
  get radioButtonChoices() {
    return this.radioOrCheckboxOptions('confirmAdd')
  }

  selectRadioButton(text: string) {
    this.radioOrCheckboxButton('confirmAdd', text).click()
  }

  showsNoTable(): Cypress.Chainable<void> {
    return cy.get<HTMLTableRowElement>('.app-involvement-table').should('not.exist').end()
  }

  get tableRows(): PageElement<HTMLTableRowElement> {
    return cy.get<HTMLTableRowElement>('table.app-involvement-table tbody tr.govuk-table__row')
  }

  removeLink(index: number): PageElement<HTMLAnchorElement> {
    return cy
      .get<HTMLTableRowElement>('table.app-involvement-table tbody tr.govuk-table__row')
      .eq(index)
      .find('a')
      .contains('Remove')
  }
}
