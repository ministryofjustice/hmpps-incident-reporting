import { mockReportingOfficer, mockUser } from '../../server/data/testData/users'
import { makeMockCaseload } from '../../server/data/testData/frontendComponents'
import { moorland } from '../../server/data/testData/prisonApi'
import { roleReadWrite, roleAdmin } from '../../server/data/constants'
import Page from '../pages/page'
import { SyncNomisCreatePage, SyncNomisResultPage, SyncNomisSelectPage } from '../pages/admin/syncNomis'

/** An admin user has the admin role in addition to a normal service role */
const adminUser = mockUser([makeMockCaseload(moorland)], [roleReadWrite, roleAdmin])

// ABSCOND_1 is always active and maps to NOMIS code ABSCOND
const dpsCode = 'ABSCOND_1'
const nomisCode = 'ABSCOND'

describe('Admin: sync an incident type to NOMIS', () => {
  it('is not accessible without the admin role', () => {
    cy.resetBasicStubs({ user: mockReportingOfficer })
    cy.signIn()

    cy.visit('/admin/sync-nomis', { failOnStatusCode: false })
    cy.contains('Sync an incident type to NOMIS').should('not.exist')
  })

  context('as an admin user', () => {
    beforeEach(() => {
      cy.resetBasicStubs({ user: adminUser })
      cy.signIn()
    })

    it('shows the select screen listing active incident types', () => {
      cy.visit('/admin/sync-nomis')

      const page = Page.verifyOnPage(SyncNomisSelectPage)
      page.typeSelect.find('option').should('contain.text', 'Abscond')
    })

    it('confirms a create then completes the sync', () => {
      cy.task('stubPrisonApiIncidentTypeConfigurationNotFound', nomisCode)
      cy.task('stubPrisonApiCreateIncidentTypeConfiguration', nomisCode)

      cy.visit('/admin/sync-nomis')
      const selectPage = Page.verifyOnPage(SyncNomisSelectPage)
      selectPage.selectType(dpsCode)
      selectPage.continueButton.click()

      // Not in NOMIS yet, so the confirm screen offers to create it
      const confirmPage = Page.verifyOnPage(SyncNomisCreatePage)
      confirmPage.submitButton.click()

      Page.verifyOnPage(SyncNomisResultPage)
      cy.contains('was created in NOMIS')
    })
  })
})
