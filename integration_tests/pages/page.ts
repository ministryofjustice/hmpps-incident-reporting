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
    if (url) {
      this.breadcrumbs.last().find('a').should('have.attr', 'href', url)
    }
  }

  checkBackLink(url: string): PageElement<HTMLAnchorElement> {
    return cy.get<HTMLAnchorElement>('.govuk-back-link').should('have.attr', 'href', url)
  }

  get notificationBanner(): PageElement<HTMLDivElement> {
    return cy.get('.govuk-notification-banner')
  }

  get notificationBannerHeader(): PageElement<HTMLDivElement> {
    return this.notificationBanner.find('.govuk-notification-banner__header')
  }

  successBannerShows(): Cypress.Chainable<void> {
    return this.notificationBannerHeader.should('contain.text', 'Success').end()
  }

  get notificationBannerContent(): PageElement<HTMLDivElement> {
    return this.notificationBanner.find('.govuk-notification-banner__content')
  }

  checkNotificationBannerContent(content: string): PageElement<HTMLDivElement> {
    return this.notificationBannerContent.should('contain.text', content)
  }

  get errorSummary(): PageElement<HTMLDivElement> {
    return cy.get('.govuk-error-summary')
  }

  get footer(): PageElement {
    return cy.get('.govuk-footer')
  }
}
