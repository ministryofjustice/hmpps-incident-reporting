import Page from '../pages/page'
import { ManagementReportingPage } from '../pages/managementReporting'
import { ManagementReportingSampleReportPage } from '../pages/managementReportingSampleReport'

context('View management reports', () => {
  beforeEach(() => {
    cy.resetBasicStubs()
    cy.signIn()

    cy.task('stubIncidentReportingDefinitions')

    cy.visit(`/management-reporting`)
  })

  it('should display management reporting page', () => {
    const managementReportingPage = Page.verifyOnPage(ManagementReportingPage)

    managementReportingPage.title.should('contain.text', 'Management reporting')
    managementReportingPage.reportLink.should('contain.text', 'Incident report summary')
    managementReportingPage.checkLastBreadcrumb('Incident reporting', '/')
  })

  it('should being able to view a report', () => {
    cy.task('stubIncidentReportSummaryDefinition')
    cy.task('stubIncidentReportingData')
    cy.task('stubIncidentReportingDataCount')

    const managementReportingPage = Page.verifyOnPage(ManagementReportingPage)
    managementReportingPage.reportLink.click()
    const managementReportingSampleReportPage = Page.verifyOnPage(ManagementReportingSampleReportPage)
    managementReportingSampleReportPage.title.should('contain.text', 'Incident report summary')
    managementReportingPage.checkLastBreadcrumb('Management reporting', '/management-reporting')
  })
})
