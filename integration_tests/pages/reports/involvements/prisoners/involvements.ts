import { InvolvementsPage } from '../abstract'

export class PrisonerInvolvementsPage extends InvolvementsPage {
  constructor(involvementsDone = true) {
    super(involvementsDone ? 'Prisoners involved' : 'Do you want to add a prisoner to the report?')
  }

  get tableContents(): Cypress.Chainable<
    {
      prisoner: string
      role: string
      outcome: string | null
      details: string
      actionLinks: HTMLAnchorElement[]
    }[]
  > {
    return this.tableRows.then(rows =>
      rows
        .map((_, row) => {
          const $cells = Cypress.$(row).find('.govuk-table__cell') as unknown as JQuery<HTMLTableCellElement>
          const prisoner = $cells.eq(0).text().trim()
          const role = $cells.eq(1).text().trim()
          const outcome = $cells.length === 5 ? $cells.eq(2).text().trim() : null
          const details = $cells.length === 5 ? $cells.eq(3).text().trim() : $cells.eq(2).text().trim()
          const actionLinks = ($cells.last().find('a') as unknown as JQuery<HTMLAnchorElement>).toArray()
          return { prisoner, role, outcome, details, actionLinks }
        })
        .toArray(),
    )
  }
}
