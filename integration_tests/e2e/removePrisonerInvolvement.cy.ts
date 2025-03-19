import { RelatedObjectUrlSlug } from '../../server/data/incidentReportingApi'
import { mockReport } from '../../server/data/testData/incidentReporting'
import { barry } from '../../server/data/testData/offenderSearch'
import Page from '../pages/page'
import PrisonerInvolvementsPage from '../pages/reports/prisoners/involvements'
import RemovePrisonerInvolvementsPage from '../pages/reports/prisoners/remove'

context('Remove prisoner involvement page', () => {
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

    removePrisonerInvolvementsPage.selectRadioButton('Yes')
    removePrisonerInvolvementsPage.submit()

    const prisonerInvolvementsPage = Page.verifyOnPage(PrisonerInvolvementsPage)
    prisonerInvolvementsPage.successBannerShows()
    prisonerInvolvementsPage.checkNotificationBannerContent('You have removed A2222BB: Barry Benjamin')
  })
})
