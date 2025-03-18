import FormWizardPage from '../../formWizard'

export default class PrisonerInvolvementsPage extends FormWizardPage {
  constructor(involvementsDone = true) {
    super(involvementsDone ? 'Prisoners involved' : 'Do you want to add a prisoner to the report?')
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
    { prisoner: string; role: string; outcome: string | null; details: string; actionLinks: HTMLAnchorElement[] }[]
  > {
    return cy.get<HTMLTableRowElement>('table.app-involvement-table tbody tr.govuk-table__row').then(rows =>
      rows
        .map((_, row) => {
          const $cells = Cypress.$(row).find('.govuk-table__cell') as unknown as JQuery<HTMLTableCellElement>
          const prisoner = $cells.eq(0).text()
          const role = $cells.eq(1).text()
          const outcome = $cells.length === 5 ? $cells.eq(2).text() : null
          const details = $cells.length === 5 ? $cells.eq(3).text() : $cells.eq(2).text()
          const actionLinks = ($cells.last().find('a') as unknown as JQuery<HTMLAnchorElement>).toArray()
          return { prisoner, role, outcome, details, actionLinks }
        })
        .toArray(),
    )
  }
}
