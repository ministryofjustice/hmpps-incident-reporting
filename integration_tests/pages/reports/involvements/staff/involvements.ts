import { InvolvementsPage } from '../abstract'

// eslint-disable-next-line import/prefer-default-export
export class StaffInvolvementsPage extends InvolvementsPage {
  constructor(involvementsDone = true) {
    super(involvementsDone ? 'Staff involved' : 'Do you want to add a member of staff to the report?')
  }

  get tableContents(): Cypress.Chainable<
    {
      staff: string
      role: string
      details: string
      actionLinks: HTMLAnchorElement[]
    }[]
  > {
    return this.tableRows.then(rows =>
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
