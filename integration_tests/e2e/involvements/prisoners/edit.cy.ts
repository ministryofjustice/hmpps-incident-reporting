import { RelatedObjectUrlSlug } from '../../../../server/data/incidentReportingApi'
import { mockReport } from '../../../../server/data/testData/incidentReporting'
import { barry } from '../../../../server/data/testData/offenderSearch'
import Page from '../../../pages/page'
import { EditPrisonerInvolvementPage, PrisonerInvolvementsPage } from '../../../pages/reports/involvements/prisoners'

context('Edit prisoner involvement page', () => {
  const now = new Date()
  const reportWithDetails = mockReport({
    type: 'MISCELLANEOUS',
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
      comment: '',
    },
  ]
  reportWithDetails.prisonerInvolvementDone = true
  reportWithDetails.staffInvolved = []
  reportWithDetails.staffInvolvementDone = false
  reportWithDetails.questions = []
  reportWithDetails.correctionRequests = []

  let editPrisonerInvolvementsPage: EditPrisonerInvolvementPage

  beforeEach(() => {
    cy.resetBasicStubs()

    cy.signIn()
    cy.task('stubIncidentReportingApiGetReportWithDetailsById', { report: reportWithDetails })
    cy.task('stubOffenderSearchMockPrisoners')
    cy.visit(`/reports/${reportWithDetails.id}/prisoners`)
    Page.verifyOnPage(PrisonerInvolvementsPage).editLink(0).click()
    editPrisonerInvolvementsPage = Page.verifyOnPage(EditPrisonerInvolvementPage, 'Barry Benjamin’s')
  })

  it('should have back link point to involvements page', () => {
    editPrisonerInvolvementsPage.checkBackLink(`/reports/${reportWithDetails.id}/prisoners`)
  })

  it('should list roles that are allowed for this incident type', () => {
    editPrisonerInvolvementsPage.roleChoices.then(choices => {
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
      response: reportWithDetails.prisonersInvolved, // technically, missing new person
    })
    editPrisonerInvolvementsPage.selectRole('ACTIVE_INVOLVEMENT')
    editPrisonerInvolvementsPage.enterComment('Was there')
    editPrisonerInvolvementsPage.submit()

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
      response: reportWithDetails.prisonersInvolved, // technically, missing new person
    })
    editPrisonerInvolvementsPage.selectRole('SUSPECTED_INVOLVED')
    editPrisonerInvolvementsPage.submit()

    Page.verifyOnPage(PrisonerInvolvementsPage)
  })

  it('should show errors if information is missing', () => {
    editPrisonerInvolvementsPage.enterComment('Some comments')
    editPrisonerInvolvementsPage.submit()
    editPrisonerInvolvementsPage.errorSummary.contains('There is a problem')
    Page.verifyOnPage(EditPrisonerInvolvementPage, 'Barry Benjamin’s')
  })
})
