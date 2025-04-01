import { RelatedObjectUrlSlug } from '../../../../server/data/incidentReportingApi'
import { mockReport } from '../../../../server/data/testData/incidentReporting'
import { barry } from '../../../../server/data/testData/offenderSearch'
import Page from '../../../pages/page'
import { EditPrisonerInvolvementPage, PrisonerInvolvementsPage } from '../../../pages/reports/involvements/prisoners'

context('Edit prisoner involvement page', () => {
  const now = new Date()
  const reportWithDetails = mockReport({
    type: 'MISCELLANEOUS_1',
    reportReference: '6544',
    reportDateAndTime: now,
    withDetails: true,
  })
  reportWithDetails.prisonersInvolved = [
    {
      prisonerNumber: barry.prisonerNumber,
      firstName: barry.firstName,
      lastName: barry.lastName,
      prisonerRole: 'ASSISTED_STAFF',
      outcome: null,
      comment: 'See IR781897613',
    },
  ]
  reportWithDetails.prisonerInvolvementDone = true
  reportWithDetails.staffInvolved = []
  reportWithDetails.staffInvolvementDone = false
  reportWithDetails.questions = []
  reportWithDetails.correctionRequests = []

  let editPrisonerInvolvementPage: EditPrisonerInvolvementPage

  beforeEach(() => {
    cy.resetBasicStubs()

    cy.signIn()
    cy.task('stubIncidentReportingApiGetReportWithDetailsById', { report: reportWithDetails })
    cy.visit(`/reports/${reportWithDetails.id}/prisoners`)
    Page.verifyOnPage(PrisonerInvolvementsPage).editLink(0).click()
    editPrisonerInvolvementPage = Page.verifyOnPage(EditPrisonerInvolvementPage, 'Barry Benjamin’s')
  })

  it('should have back link point to involvements page', () => {
    editPrisonerInvolvementPage.checkBackLink(`/reports/${reportWithDetails.id}/prisoners`)
  })

  it('should list roles that are allowed for this incident type', () => {
    editPrisonerInvolvementPage.roleChoices.then(choices => {
      expect(choices).to.deep.equal([
        {
          label: 'Active involvement',
          value: 'ACTIVE_INVOLVEMENT',
          checked: false,
        },
        {
          label: 'Assisted staff',
          value: 'ASSISTED_STAFF',
          checked: true,
        },
        {
          label: 'Impeded staff',
          value: 'IMPEDED_STAFF',
          checked: false,
        },
        {
          label: 'Perpetrator',
          value: 'PERPETRATOR',
          checked: false,
        },
        {
          label: 'Suspected involved',
          value: 'SUSPECTED_INVOLVED',
          checked: false,
        },
        {
          label: 'Victim',
          value: 'VICTIM',
          checked: false,
        },
      ])
    })
  })

  it('should prefill existing comments', () => {
    editPrisonerInvolvementPage.commentBox.should('contain.text', 'See IR781897613')
  })

  it('should save selected role and comment', () => {
    cy.task('stubIncidentReportingApiUpdateRelatedObject', {
      urlSlug: RelatedObjectUrlSlug.prisonersInvolved,
      reportId: reportWithDetails.id,
      index: 1,
      request: {
        prisonerRole: 'ACTIVE_INVOLVEMENT',
        outcome: null,
        comment: 'Was there',
      },
      response: reportWithDetails.prisonersInvolved, // technically, missing update
    })
    editPrisonerInvolvementPage.selectRole('ACTIVE_INVOLVEMENT')
    editPrisonerInvolvementPage.enterComment('Was there')
    editPrisonerInvolvementPage.submit()

    Page.verifyOnPage(PrisonerInvolvementsPage)
  })

  it('should save selected role and empty comment', () => {
    cy.task('stubIncidentReportingApiUpdateRelatedObject', {
      urlSlug: RelatedObjectUrlSlug.prisonersInvolved,
      reportId: reportWithDetails.id,
      index: 1,
      request: {
        prisonerRole: 'SUSPECTED_INVOLVED',
        outcome: null,
        comment: '',
      },
      response: reportWithDetails.prisonersInvolved, // technically, missing update
    })
    editPrisonerInvolvementPage.selectRole('SUSPECTED_INVOLVED')
    editPrisonerInvolvementPage.commentBox.clear()
    editPrisonerInvolvementPage.submit()

    Page.verifyOnPage(PrisonerInvolvementsPage)
  })

  it('should show errors if information is missing', () => {
    editPrisonerInvolvementPage.enterComment('Some comments')
    editPrisonerInvolvementPage.submit()
    editPrisonerInvolvementPage.errorSummary.contains('There is a problem')
    Page.verifyOnPage(EditPrisonerInvolvementPage, 'Barry Benjamin’s')
  })
})
