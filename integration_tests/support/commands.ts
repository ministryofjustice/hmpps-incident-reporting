import type { Express } from 'express'

import { mockReportingOfficer } from '../../server/data/testData/users'

Cypress.Commands.add('signIn', (options = { failOnStatusCode: true }) => {
  cy.request('/')
  return cy.task('getSignInUrl').then((url: string) => cy.visit(url, options))
})

Cypress.Commands.add('resetBasicStubs', ({ user = mockReportingOfficer }: { user?: Express.User } = {}) => {
  cy.task('resetStubs')
  cy.task('stubSignIn', user.roles)
  cy.task('stubManageUserMe', { user })
  cy.task('stubFallbackHeaderAndFooter', { user })
  cy.task('stubPrisonApiMockPecsRegions')
  cy.task('stubPrisonApiMockAgencySwitches')
  return cy.end()
})
