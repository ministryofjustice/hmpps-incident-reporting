export type PageElement<TElement = HTMLElement> = Cypress.Chainable<JQuery<TElement>>

export default abstract class Page {
  static verifyOnPage<T extends Page>(constructor: new (...args: unknown[]) => T, ...args: unknown[]): T {
    return new constructor(...args)
  }

  constructor(
    protected readonly h1: string,
    protected readonly pageTitle?: string,
  ) {
    this.checkOnPage()
  }

  checkOnPage(): void {
    cy.get('h1').contains(this.h1)
    cy.title().should('eq', `${this.pageTitle ?? this.h1} – Digital Prison Services`)
  }

  get signOut(): PageElement<HTMLAnchorElement> {
    return cy.get('[data-qa=signOut]')
  }

  get manageDetails(): PageElement<HTMLAnchorElement> {
    return cy.get('[data-qa=manageDetails]')
  }
}
