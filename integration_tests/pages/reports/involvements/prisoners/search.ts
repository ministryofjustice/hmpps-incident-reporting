import { SearchPage } from '../abstract'

// eslint-disable-next-line import/prefer-default-export
export class PrisonerSearchPage extends SearchPage {
  constructor() {
    super('Search for a prisoner')
  }

  get tableContents(): Cypress.Chainable<
    {
      photo: HTMLImageElement
      name: string
      prisonerNumber: string
      age: string
      establishment: string
      actionLink: HTMLAnchorElement
    }[]
  > {
    return this.tableRows.then(rows =>
      rows
        .map((_, row) => {
          const $cells = Cypress.$(row).find('.govuk-table__cell') as unknown as JQuery<HTMLTableCellElement>
          const photo = ($cells.eq(0).find('img') as unknown as JQuery<HTMLImageElement>).get()[0]
          const name = $cells.eq(1).text().trim()
          const prisonerNumber = $cells.eq(2).text().trim()
          const age = $cells.eq(3).text().trim()
          const establishment = $cells.eq(4).text().trim()
          const actionLink = ($cells.eq(5).find('a') as unknown as JQuery<HTMLAnchorElement>).get()[0]
          return { photo, name, prisonerNumber, age, establishment, actionLink }
        })
        .toArray(),
    )
  }
}
