import { RelatedObjectUrlSlug } from '../../../../server/data/incidentReportingApi'
import type { UsersSearchResult } from '../../../../server/data/manageUsersApiClient'
import { mockReport } from '../../../../server/data/testData/incidentReporting'
import { moorland, staffBarry, staffMary } from '../../../../server/data/testData/prisonApi'
import { now } from '../../../../server/testutils/fakeClock'
import Page from '../../../pages/page'
import {
  AddStaffInvolvementsPage,
  ManualStaffEntryPage,
  StaffInvolvementsPage,
} from '../../../pages/reports/involvements/staff'

context('Add staff involvement page', () => {
  const reportWithDetails = mockReport({
    type: 'MISCELLANEOUS_1',
    reportReference: '6544',
    reportDateAndTime: now,
    withDetails: true,
  })
  reportWithDetails.prisonersInvolved = []
  reportWithDetails.prisonerInvolvementDone = false
  reportWithDetails.staffInvolved = [
    {
      staffUsername: staffBarry.username,
      firstName: staffBarry.firstName,
      lastName: staffBarry.lastName,
      staffRole: 'WITNESS',
      comment: 'See duty log addendum',
    },
  ]
  reportWithDetails.staffInvolvementDone = true
  reportWithDetails.questions = []
  reportWithDetails.correctionRequests = []

  let addStaffInvolvementsPage: AddStaffInvolvementsPage

  beforeEach(() => {
    cy.resetBasicStubs()

    cy.signIn()
    cy.task('stubIncidentReportingApiGetReportWithDetailsById', { report: reportWithDetails })
  })

  const checkBackLink = () => {
    addStaffInvolvementsPage.checkBackLink(`/reports/${reportWithDetails.id}/staff`)
  }

  const checkRoleChoices = () => {
    // TODO: for now, all types allow all roles
    addStaffInvolvementsPage.roleChoices.then(choices => {
      expect(choices).to.deep.equal([
        {
          label: 'Actively involved',
          value: 'ACTIVELY_INVOLVED',
          checked: false,
        },
        {
          label: 'Authorising officer',
          value: 'AUTHORISING_OFFICER',
          checked: false,
        },
        {
          label: 'Control and restraint - head',
          value: 'CR_HEAD',
          checked: false,
        },
        {
          label: 'Control and restraint - left arm',
          value: 'CR_LEFT_ARM',
          checked: false,
        },
        {
          label: 'Control and restraint - legs',
          value: 'CR_LEGS',
          checked: false,
        },
        {
          label: 'Control and restraint - right arm',
          value: 'CR_RIGHT_ARM',
          checked: false,
        },
        {
          label: 'Control and restraint - supervisor',
          value: 'CR_SUPERVISOR',
          checked: false,
        },
        {
          label: 'Deceased',
          value: 'DECEASED',
          checked: false,
        },
        {
          label: 'First on scene',
          value: 'FIRST_ON_SCENE',
          checked: false,
        },
        {
          label: 'Healthcare',
          value: 'HEALTHCARE',
          checked: false,
        },
        {
          label: 'Hostage',
          value: 'HOSTAGE',
          checked: false,
        },
        {
          label: 'In possession',
          value: 'IN_POSSESSION',
          checked: false,
        },
        {
          label: 'Negotiator',
          value: 'NEGOTIATOR',
          checked: false,
        },
        {
          label: 'Present at scene',
          value: 'PRESENT_AT_SCENE',
          checked: false,
        },
        {
          label: 'Suspected involvement',
          value: 'SUSPECTED_INVOLVEMENT',
          checked: false,
        },
        {
          label: 'Victim',
          value: 'VICTIM',
          checked: false,
        },
        {
          label: 'Witness',
          value: 'WITNESS',
          checked: false,
        },
      ])
    })
  }

  context('when they are a DPS/NOMIS user', () => {
    beforeEach(() => {
      cy.task('stubManageKnownPrisonUser', {
        username: staffMary.username,
        firstName: staffMary.firstName,
        lastName: staffMary.lastName,
        email: 'mary@dps.local',
        activeCaseload: { id: 'MDI', name: moorland.description },
      } satisfies UsersSearchResult)
      cy.visit(`/reports/${reportWithDetails.id}/staff/add/username/${staffMary.username}`)
      addStaffInvolvementsPage = Page.verifyOnPage(AddStaffInvolvementsPage, 'Mary Johnson', 'Mary Johnson’s')
    })

    it('should have back link point to involvements page', checkBackLink)

    it('should list roles that are allowed for this incident type', checkRoleChoices)

    it('should save selected role and comment', () => {
      cy.task('stubIncidentReportingApiCreateRelatedObject', {
        urlSlug: RelatedObjectUrlSlug.staffInvolved,
        reportId: reportWithDetails.id,
        request: {
          staffUsername: 'abc12a',
          firstName: 'MARY',
          lastName: 'JOHNSON',
          staffRole: 'PRESENT_AT_SCENE',
          comment: 'Was there',
        },
        response: reportWithDetails.staffInvolved, // technically, missing new person
      })
      addStaffInvolvementsPage.selectRole('PRESENT_AT_SCENE')
      addStaffInvolvementsPage.enterComment('Was there')
      addStaffInvolvementsPage.submit()

      Page.verifyOnPage(StaffInvolvementsPage)
    })

    it('should save selected role and empty comment', () => {
      cy.task('stubIncidentReportingApiCreateRelatedObject', {
        urlSlug: RelatedObjectUrlSlug.staffInvolved,
        reportId: reportWithDetails.id,
        request: {
          staffUsername: 'abc12a',
          firstName: 'MARY',
          lastName: 'JOHNSON',
          staffRole: 'NEGOTIATOR',
          comment: '',
        },
        response: reportWithDetails.staffInvolved, // technically, missing new person
      })
      addStaffInvolvementsPage.selectRole('NEGOTIATOR')
      addStaffInvolvementsPage.submit()

      Page.verifyOnPage(StaffInvolvementsPage)
    })

    it('should show errors if information is missing', () => {
      addStaffInvolvementsPage.enterComment('Some comments')
      addStaffInvolvementsPage.submit()
      addStaffInvolvementsPage.errorSummary.should('contain.text', 'There is a problem')
      addStaffInvolvementsPage.errorSummary.should(
        'contain.text',
        'Select how the member of staff was involved in the incident',
      )
      Page.verifyOnPage(AddStaffInvolvementsPage, 'Mary Johnson', 'Mary Johnson’s')
    })
  })

  context('when they are not a DPS/NOMIS user', () => {
    let manualStaffEntryPage: ManualStaffEntryPage

    beforeEach(() => {
      cy.visit(`/reports/${reportWithDetails.id}/staff/add/manual`)
      manualStaffEntryPage = Page.verifyOnPage(ManualStaffEntryPage)
    })

    it('should have back link point to involvements page', () => {
      manualStaffEntryPage.checkBackLink(`/reports/${reportWithDetails.id}/staff`)
    })

    it('should show errors if information is missing', () => {
      manualStaffEntryPage.enterLastName('Johnson')
      manualStaffEntryPage.submit()
      manualStaffEntryPage.errorSummary.should('contain.text', 'There is a problem')
      manualStaffEntryPage.errorSummary.should('contain.text', 'Enter their first name')
      Page.verifyOnPage(ManualStaffEntryPage)
    })

    it('should allow manually entering first and last name', () => {
      manualStaffEntryPage.enterFirstName('Mary')
      manualStaffEntryPage.enterLastName('Johnson')
      manualStaffEntryPage.submit()

      addStaffInvolvementsPage = Page.verifyOnPage(AddStaffInvolvementsPage, 'Mary Johnson', 'Mary Johnson’s')
      cy.url().should('contain', `/reports/${reportWithDetails.id}/staff/add/manual/details`)

      checkBackLink()
      checkRoleChoices()

      cy.task('stubIncidentReportingApiCreateRelatedObject', {
        urlSlug: RelatedObjectUrlSlug.staffInvolved,
        reportId: reportWithDetails.id,
        request: {
          staffUsername: null,
          firstName: 'Mary',
          lastName: 'Johnson',
          staffRole: 'PRESENT_AT_SCENE',
          comment: 'Was there',
        },
        response: reportWithDetails.staffInvolved, // technically, missing new person
      })
      addStaffInvolvementsPage.selectRole('PRESENT_AT_SCENE')
      addStaffInvolvementsPage.enterComment('Was there')
      addStaffInvolvementsPage.submit()

      Page.verifyOnPage(StaffInvolvementsPage)
    })
  })
})
