import FormWizardPage from '../../formWizard'

export default class StaffInvolvementsPage extends FormWizardPage {
  constructor(involvementsDone = true) {
    super(involvementsDone ? 'Staff involved' : 'Do you want to add a member of staff to the report?')
  }

  get radioButtonChoices() {
    return this.radioOrCheckboxOptions('confirmAdd')
  }

  selectRadioButton(text: string) {
    this.radioOrCheckboxButton('confirmAdd', text).click()
  }

  showsNoTable(): Cypress.Chainable<void> {
    return cy.get<HTMLTableRowElement>('.app-involvement-table').should('not.exist').end()
  }

  get tableContents(): Cypress.Chainable<
    { staff: string; role: string; details: string; actionLinks: HTMLAnchorElement[] }[]
  > {
    return cy.get<HTMLTableRowElement>('table.app-involvement-table tbody tr.govuk-table__row').then(rows =>
      rows
        .map((_, row) => {
          const $cells = Cypress.$(row).find('.govuk-table__cell') as unknown as JQuery<HTMLTableCellElement>
          const staff = $cells.eq(0).text().trim()
          const role = $cells.eq(1).text().trim()
          const details = $cells.eq(2).text().trim()
          const actionLinks = ($cells.last().find('a') as unknown as JQuery<HTMLAnchorElement>).toArray()
          return { staff, role, details, actionLinks }
        })
        .toArray(),
    )
  }
}
