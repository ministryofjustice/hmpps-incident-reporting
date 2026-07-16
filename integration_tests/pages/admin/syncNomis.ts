/* eslint-disable max-classes-per-file */
import Page, { type PageElement } from '../page'

/** Select-a-type screen at /admin/sync-nomis */
export class SyncNomisSelectPage extends Page {
  constructor() {
    super('Sync an incident type to NOMIS', 'Sync incident type to NOMIS')
  }

  get typeSelect(): PageElement<HTMLSelectElement> {
    return cy.get('#dpsCode')
  }

  selectType(dpsCode: string): void {
    this.typeSelect.select(dpsCode)
  }

  get continueButton(): PageElement<HTMLButtonElement> {
    return cy.get('button[type=submit]')
  }
}

/** Confirm screen at /admin/sync-nomis/:dpsCode when the type is not yet in NOMIS */
export class SyncNomisCreatePage extends Page {
  constructor() {
    super('Create in NOMIS', 'Confirm sync to NOMIS')
  }

  get submitButton(): PageElement<HTMLButtonElement> {
    return cy.get('button[type=submit]')
  }
}

/** Result screen at /admin/sync-nomis/:dpsCode after a successful write */
export class SyncNomisResultPage extends Page {
  constructor() {
    super('Sync complete', 'Sync result')
  }
}
