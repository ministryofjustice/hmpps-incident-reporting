Cypress.Commands.add('signIn', (options = { failOnStatusCode: true }) => {
  cy.request('/')
  return cy.task('getSignInUrl').then((url: string) => cy.visit(url, options))
})

Cypress.Commands.add('resetBasicStubs', ({ roles = [] }: { roles?: string[] } = {}) => {
  cy.task('resetStubs')
  cy.task('stubSignIn', roles)
  cy.task('stubManageUserMe')
  cy.task('stubFallbackHeaderAndFooter')
})
