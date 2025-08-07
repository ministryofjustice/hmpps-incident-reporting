import Page, { type PageElement } from './page'

export class DashboardPage extends Page {
  constructor() {
    super('Incident reports')
  }

  get createReportLink(): PageElement<HTMLAnchorElement> {
    return cy.get('a').contains('Create a report')
  }

  private get searchForm(): PageElement<HTMLFormElement> {
    return cy.get('form#app-dashboard__search-form')
  }

  get query(): PageElement<HTMLInputElement> {
    return this.searchForm.find('#searchID')
  }

  get fromDate(): PageElement<HTMLInputElement> {
    return this.searchForm.find('#fromDate')
  }

  get toDate(): PageElement<HTMLInputElement> {
    return this.searchForm.find('#toDate')
  }

  get location(): PageElement<HTMLInputElement> {
    return this.searchForm.find('#location')
  }

  get type(): PageElement<HTMLInputElement> {
    return this.searchForm.find('#typeFamily')
  }

  statusCheckbox(label: string): PageElement<HTMLLabelElement> {
    return this.searchForm.find('#incidentStatuses').find<HTMLLabelElement>('label').contains(label)
  }

  get selectedStatuses(): Cypress.Chainable<string[]> {
    return this.searchForm.then(form => {
      const formElement = form.get()[0]
      const formData = new FormData(formElement)
      return formData.getAll('incidentStatuses').filter(val => typeof val === 'string')
    })
  }

  submit(): void {
    this.searchForm.find('.govuk-button').contains('Apply filters').click()
  }

  clearFilters(): void {
    this.searchForm.find('a').contains('Clear filters').click()
  }

  showsNoTable(): Cypress.Chainable<void> {
    return cy.get<HTMLTableRowElement>('.app-report-table').should('not.exist').end()
  }

  get tableRows(): PageElement<HTMLTableRowElement> {
    return cy.get<HTMLTableRowElement>('table.app-report-table tbody tr.govuk-table__row')
  }

  get tableContents(): Cypress.Chainable<
    {
      selectLink: HTMLAnchorElement
      type: string
      incidentDate: string
      description: string
      locationOrReporter: string
      status: string
    }[]
  > {
    return this.tableRows.then(rows =>
      rows
        .map((_, row) => {
          const $cells = Cypress.$(row).find('.govuk-table__cell') as unknown as JQuery<HTMLTableCellElement>

          const selectLink = ($cells.eq(0).find('a') as unknown as JQuery<HTMLAnchorElement>).get()[0]
          const type = $cells.eq(1).text().trim()
          const incidentDate = $cells.eq(2).text().trim()
          const description = $cells.eq(3).text().trim()
          const locationOrReporter = $cells.eq(4).text().trim()
          const status = $cells.eq(5).text().trim()

          return { selectLink, type, incidentDate, description, locationOrReporter, status }
        })
        .toArray(),
    )
  }
}
