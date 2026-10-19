import FormWizardPage from '../../../formWizard'
import type { PageElement } from '../../../page'

export abstract class InvolvementsPage extends FormWizardPage {
  get radioButtonChoices() {
    return this.radioOrCheckboxChoices('confirmAdd')
  }

  selectRadioButton(text: string) {
    this.radioOrCheckboxButton('confirmAdd', text).click()
  }

  showsNoTable(): Cypress.Chainable<JQuery<HTMLTableRowElement>> {
    return cy.get<HTMLTableRowElement>('.app-involvement-table').should('not.exist')
  }

  showsNoRadio(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('#confirmAdd').should('not.exist')
  }

  get tableRows(): PageElement<HTMLTableRowElement> {
    return cy.get<HTMLTableRowElement>('table.app-involvement-table tbody tr.govuk-table__row')
  }

  removeLink(index: number): PageElement<HTMLAnchorElement> {
    return this.tableRows.eq(index).find('a').contains('Remove')
  }

  editLink(index: number): PageElement<HTMLAnchorElement> {
    return this.tableRows.eq(index).find('a').contains('Edit')
  }
}
