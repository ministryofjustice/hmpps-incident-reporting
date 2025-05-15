context('Healthcheck', () => {
  context('All healthy', () => {
    beforeEach(() => {
      cy.task('resetStubs')
      cy.task('stubIncidentReportingApiPing')
      cy.task('stubAuthPing')
      cy.task('stubFrontendComponentsApiPing')
      cy.task('stubPrisonApiPing')
      cy.task('stubManageUsersPing')
      cy.task('stubNomisUserRolesApiPing')
      cy.task('stubOffenderSearchApiPing')
      cy.task('stubTokenVerificationPing')
    })

    it('Health check page is visible and UP', () => {
      cy.request('/health').its('body.status').should('equal', 'UP')
    })

    it('Ping is visible and UP', () => {
      cy.request('/ping').its('body.status').should('equal', 'UP')
    })

    it('Info is visible and active agencies', () => {
      cy.request('/info').its('body.activeAgencies').should('deep.equal', ['MDI', 'LEI'])
    })
  })

  context('Some unhealthy', () => {
    beforeEach(() => {
      cy.task('resetStubs')
      cy.task('stubIncidentReportingApiPing')
      cy.task('stubAuthPing')
      cy.task('stubPrisonApiPing')
      cy.task('stubManageUsersPing')
      cy.task('stubOffenderSearchApiPing')
      cy.task('stubTokenVerificationPing', 500)
    })

    it('Reports correctly when token verification down', () => {
      cy.request({ url: '/health', method: 'GET', failOnStatusCode: false }).then(response => {
        expect(response.body.components.hmppsIncidentReportingApi.status).to.equal('UP')
        expect(response.body.components.hmppsAuth.status).to.equal('UP')
        expect(response.body.components.hmppsPrisonApi.status).to.equal('UP')
        expect(response.body.components.manageUsersApi.status).to.equal('UP')
        expect(response.body.components.offenderSearchApi.status).to.equal('UP')
        expect(response.body.components.tokenVerification.status).to.equal('DOWN')
        expect(response.body.components.tokenVerification.details).to.contain({ status: 500, attempts: 3 })
      })
    })

    it('Health check page is visible and DOWN', () => {
      cy.request({ url: '/health', method: 'GET', failOnStatusCode: false }).its('body.status').should('equal', 'DOWN')
    })
  })
})
