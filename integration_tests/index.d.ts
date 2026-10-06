declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to signIn. Set failOnStatusCode to false if you expect and non 200 return code
     * @example cy.signIn({ failOnStatusCode: boolean })
     */
    signIn(options?: { failOnStatusCode: boolean }): Chainable<AUTWindow>

    /**
     * Set up stubs needed for all interactions.
     * By default, the user acts like a reporting officer with access to Moorland only.
     */
    resetBasicStubs(options?: { user?: Express.User }): Chainable<AUTWindow>

    /**
     * Asserts on the audit events sent to HMPPS Audit so far for a page
     */
    verifyAuditEvents(pageUrl: string, events: object[]): Chainable<unknown>
  }
}
