declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to signIn. Set failOnStatusCode to false if you expect and non 200 return code
     * @example cy.signIn({ failOnStatusCode: boolean })
     */
    signIn(options?: { failOnStatusCode: boolean }): Chainable<AUTWindow>

    /**
     * Set up stubs needed for all interactions
     */
    resetBasicStubs(options?: { roles?: string[] }): Chainable<AUTWindow>
  }
}
