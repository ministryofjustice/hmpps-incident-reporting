import { RelatedObjectUrlSlug } from '../../../../server/data/incidentReportingApi'
import { mockReport } from '../../../../server/data/testData/incidentReporting'
import { staffBarry } from '../../../../server/data/testData/prisonApi'
import Page from '../../../pages/page'
import { EditStaffInvolvementPage, StaffInvolvementsPage } from '../../../pages/reports/involvements/staff'

context('Edit staff involvement page', () => {
  const now = new Date()
  const reportWithDetails = mockReport({
    type: 'MISCELLANEOUS',
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

  let editStaffInvolvementPage: EditStaffInvolvementPage

  beforeEach(() => {
    cy.resetBasicStubs()

    cy.signIn()
    cy.task('stubIncidentReportingApiGetReportWithDetailsById', { report: reportWithDetails })
    cy.visit(`/reports/${reportWithDetails.id}/staff`)
    Page.verifyOnPage(StaffInvolvementsPage).editLink(0).click()
    editStaffInvolvementPage = Page.verifyOnPage(EditStaffInvolvementPage, 'Barry Harrison', 'Barry Harrison’s')
  })

  it('should have back link point to involvements page', () => {
    editStaffInvolvementPage.checkBackLink(`/reports/${reportWithDetails.id}/staff`)
  })

  it('should list roles that are allowed for this incident type', () => {
    editStaffInvolvementPage.roleChoices.then(choices => {
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
          checked: true,
        },
      ])
    })
  })

  it('should prefill existing comments', () => {
    editStaffInvolvementPage.commentBox.should('contain.text', 'See duty log addendum')
  })

  it('should save selected role and comment', () => {
    cy.task('stubIncidentReportingApiUpdateRelatedObject', {
      urlSlug: RelatedObjectUrlSlug.staffInvolved,
      reportId: reportWithDetails.id,
      index: 1,
      request: {
        staffRole: 'PRESENT_AT_SCENE',
        comment: 'Was there',
      },
      response: reportWithDetails.staffInvolved, // technically, missing update
    })
    editStaffInvolvementPage.selectRole('PRESENT_AT_SCENE')
    editStaffInvolvementPage.enterComment('Was there')
    editStaffInvolvementPage.submit()

    Page.verifyOnPage(StaffInvolvementsPage)
  })

  it('should save selected role and empty comment', () => {
    cy.task('stubIncidentReportingApiUpdateRelatedObject', {
      urlSlug: RelatedObjectUrlSlug.staffInvolved,
      reportId: reportWithDetails.id,
      index: 1,
      request: {
        staffRole: 'NEGOTIATOR',
        comment: '',
      },
      response: reportWithDetails.staffInvolved, // technically, missing update
    })
    editStaffInvolvementPage.selectRole('NEGOTIATOR')
    editStaffInvolvementPage.commentBox.clear()
    editStaffInvolvementPage.submit()

    Page.verifyOnPage(StaffInvolvementsPage)
  })

  it('should show errors if information is missing', () => {
    editStaffInvolvementPage.enterComment('Some comments')
    editStaffInvolvementPage.submit()
    editStaffInvolvementPage.errorSummary.contains('There is a problem')
    Page.verifyOnPage(EditStaffInvolvementPage, 'Barry Harrison', 'Barry Harrison’s')
  })
})
