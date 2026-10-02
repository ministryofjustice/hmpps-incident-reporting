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
  cy.task('stubAuditSqs')
  return cy.end()
})

Cypress.Commands.add('verifyAuditEvents', (pageUrl: string, events: object[]) => {
  return cy.task('getSentAuditEvents', { pageUrl, expectedCount: events.length }).should('deep.equal', events)
})
