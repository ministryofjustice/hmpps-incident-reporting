export type PageElement<TElement = HTMLElement> = Cypress.Chainable<JQuery<TElement>>

export default abstract class Page {
  static verifyOnPage<T extends Page>(constructor: new (...args: unknown[]) => T, ...args: unknown[]): T {
    return new constructor(...args)
  }

  protected constructor(
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

  get breadcrumbs(): PageElement<HTMLDivElement> {
    return cy.get('.govuk-breadcrumbs__list-item')
  }

  checkLastBreadcrumb(label: string, url?: string): void {
    this.breadcrumbs.last().should('contain.text', label)
    this.breadcrumbs.last().find('a').should('have.attr', 'href', url)
  }

  checkBackLink(url: string): PageElement<HTMLAnchorElement> {
    return cy.get<HTMLAnchorElement>('.govuk-back-link').should('have.attr', 'href', url)
  }

  get errorSummary(): PageElement<HTMLDivElement> {
    return cy.get('.govuk-error-summary')
  }

  get footer(): PageElement {
    return cy.get('.govuk-footer')
  }
}
