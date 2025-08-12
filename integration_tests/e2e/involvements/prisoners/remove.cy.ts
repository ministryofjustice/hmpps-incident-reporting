import { RelatedObjectUrlSlug } from '../../../../server/data/incidentReportingApi'
import { mockReport } from '../../../../server/data/testData/incidentReporting'
import { barry } from '../../../../server/data/testData/offenderSearch'
import { moorland } from '../../../../server/data/testData/prisonApi'
import { now } from '../../../../server/testutils/fakeClock'
import Page from '../../../pages/page'
import { PrisonerInvolvementsPage, RemovePrisonerInvolvementsPage } from '../../../pages/reports/involvements/prisoners'

context('Remove prisoner involvement page', () => {
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
      comment: 'Barry is a listener',
    },
  ]
  reportWithDetails.prisonerInvolvementDone = true
  reportWithDetails.staffInvolved = []
  reportWithDetails.staffInvolvementDone = false
  reportWithDetails.questions = []
  reportWithDetails.correctionRequests = []

  let removePrisonerInvolvementsPage: RemovePrisonerInvolvementsPage

  beforeEach(() => {
    cy.resetBasicStubs()

    cy.signIn()
    cy.task('stubIncidentReportingApiGetReportWithDetailsById', { report: reportWithDetails })
    cy.task('stubPrisonApiMockPrison', moorland)
    cy.visit(`/reports/${reportWithDetails.id}/prisoners`)
    Page.verifyOnPage(PrisonerInvolvementsPage).removeLink(0).click()
    removePrisonerInvolvementsPage = Page.verifyOnPage(RemovePrisonerInvolvementsPage, 'A2222BB', 'Barry Benjamin')
  })

  it('should have back link point to involvements page', () => {
    removePrisonerInvolvementsPage.checkBackLink(`/reports/${reportWithDetails.id}/prisoners`)
  })

  it('should show an error if not confirmed', () => {
    removePrisonerInvolvementsPage.submit()
    removePrisonerInvolvementsPage.errorSummary.contains('There is a problem')
    removePrisonerInvolvementsPage.errorSummary.contains('Select yes if you want to remove the prisoner')
    Page.verifyOnPage(RemovePrisonerInvolvementsPage, 'A2222BB', 'Barry Benjamin')
  })

  it('should return to involvements page if cancelled', () => {
    removePrisonerInvolvementsPage.selectRadioButton('No')
    removePrisonerInvolvementsPage.submit()

    const prisonerInvolvementsPage = Page.verifyOnPage(PrisonerInvolvementsPage)
    prisonerInvolvementsPage.noNotificationBannersShow()
  })

  it('should delete involvement if confirmed', () => {
    cy.task('stubIncidentReportingApiDeleteRelatedObject', {
      urlSlug: RelatedObjectUrlSlug.prisonersInvolved,
      reportId: reportWithDetails.id,
      index: 1,
      response: [],
    })
    cy.task('stubIncidentReportingApiUpdateReport', {
      request: { title: 'Miscellaneous: Benjamin A2222BB (Moorland (HMP & YOI))' },
      report: reportWithDetails, // technically, missing title update
    })

    removePrisonerInvolvementsPage.selectRadioButton('Yes')
    removePrisonerInvolvementsPage.submit()

    const prisonerInvolvementsPage = Page.verifyOnPage(PrisonerInvolvementsPage)
    prisonerInvolvementsPage.successBannerShows()
    prisonerInvolvementsPage.checkNotificationBannerContent('You have removed A2222BB: Barry Benjamin')
  })
})
