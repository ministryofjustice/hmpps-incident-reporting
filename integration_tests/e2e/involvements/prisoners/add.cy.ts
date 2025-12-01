import { RelatedObjectUrlSlug } from '../../../../server/data/incidentReportingApi'
import { mockReport } from '../../../../server/data/testData/incidentReporting'
import { andrew, barry } from '../../../../server/data/testData/offenderSearch'
import { moorland } from '../../../../server/data/testData/prisonApi'
import { now } from '../../../../server/testutils/fakeClock'
import Page from '../../../pages/page'
import { AddPrisonerInvolvementsPage, PrisonerInvolvementsPage } from '../../../pages/reports/involvements/prisoners'

context('Add prisoner involvement page', () => {
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
      comment: '',
    },
  ]
  reportWithDetails.prisonerInvolvementDone = true
  reportWithDetails.staffInvolved = []
  reportWithDetails.staffInvolvementDone = false
  reportWithDetails.questions = []
  reportWithDetails.correctionRequests = []

  let addPrisonerInvolvementsPage: AddPrisonerInvolvementsPage

  beforeEach(() => {
    cy.resetBasicStubs()

    cy.signIn()
    cy.task('stubIncidentReportingApiGetReportWithDetailsById', { report: reportWithDetails })
    cy.task('stubOffenderSearchMockPrisoners')
    cy.task('stubPrisonApiMockPrison', moorland)
    cy.visit(`/reports/${reportWithDetails.id}/prisoners/add/${andrew.prisonerNumber}`)
    addPrisonerInvolvementsPage = Page.verifyOnPage(AddPrisonerInvolvementsPage, 'Andrew Arnold’s')
  })

  it('should have back link point to involvements page', () => {
    addPrisonerInvolvementsPage.checkBackLink(`/reports/${reportWithDetails.id}/prisoners`)
  })

  it('should list roles that are allowed for this incident type', () => {
    addPrisonerInvolvementsPage.roleChoices.then(choices => {
      expect(choices).to.deep.equal([
        {
          label: 'Perpetrator',
          value: 'PERPETRATOR',
          checked: false,
        },
        {
          label: 'Active involvement',
          value: 'ACTIVE_INVOLVEMENT',
          checked: false,
        },
        {
          label: 'Impeded staff',
          value: 'IMPEDED_STAFF',
          checked: false,
        },
        {
          label: 'Assisted staff',
          value: 'ASSISTED_STAFF',
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
    cy.task('stubIncidentReportingApiCreateRelatedObject', {
      urlSlug: RelatedObjectUrlSlug.prisonersInvolved,
      reportId: reportWithDetails.id,
      request: {
        prisonerNumber: 'A1111AA',
        firstName: 'ANDREW',
        lastName: 'ARNOLD',
        prisonerRole: 'ACTIVE_INVOLVEMENT',
        outcome: null,
        comment: 'Was there',
      },
      response: reportWithDetails.prisonersInvolved, // technically, missing new person
    })
    cy.task('stubIncidentReportingApiUpdateReport', {
      request: { title: 'Miscellaneous: Benjamin A2222BB (Moorland (HMP & YOI))' },
      report: reportWithDetails, // technically, missing title update
    })
    addPrisonerInvolvementsPage.selectRole('ACTIVE_INVOLVEMENT')
    addPrisonerInvolvementsPage.enterComment('Was there')
    addPrisonerInvolvementsPage.submit()

    Page.verifyOnPage(PrisonerInvolvementsPage)
  })

  it('should save selected role and empty comment', () => {
    cy.task('stubIncidentReportingApiCreateRelatedObject', {
      urlSlug: RelatedObjectUrlSlug.prisonersInvolved,
      reportId: reportWithDetails.id,
      request: {
        prisonerNumber: 'A1111AA',
        firstName: 'ANDREW',
        lastName: 'ARNOLD',
        prisonerRole: 'SUSPECTED_INVOLVED',
        outcome: null,
        comment: '',
      },
      response: reportWithDetails.prisonersInvolved, // technically, missing new person
    })
    cy.task('stubIncidentReportingApiUpdateReport', {
      request: { title: 'Miscellaneous: Benjamin A2222BB (Moorland (HMP & YOI))' },
      report: reportWithDetails, // technically, missing title update
    })
    addPrisonerInvolvementsPage.selectRole('SUSPECTED_INVOLVED')
    addPrisonerInvolvementsPage.submit()

    Page.verifyOnPage(PrisonerInvolvementsPage)
  })

  it('should show errors if information is missing', () => {
    addPrisonerInvolvementsPage.enterComment('Some comments')
    addPrisonerInvolvementsPage.submit()
    addPrisonerInvolvementsPage.errorSummary.should('contain.text', 'There is a problem')
    addPrisonerInvolvementsPage.errorSummary.should('contain.text', 'Select the prisoner’s role in the incident')
    Page.verifyOnPage(AddPrisonerInvolvementsPage, 'Andrew Arnold’s')
  })
})
