import { RelatedObjectUrlSlug } from '../../server/data/incidentReportingApi'
import { mockReport } from '../../server/data/testData/incidentReporting'
import { staffBarry } from '../../server/data/testData/prisonApi'
import Page from '../pages/page'
import StaffInvolvementsPage from '../pages/reports/staff/involvements'
import RemoveStaffInvolvementsPage from '../pages/reports/staff/remove'

context('Remove staff involvement page', () => {
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

  let removeStaffInvolvementsPage: RemoveStaffInvolvementsPage

  beforeEach(() => {
    cy.resetBasicStubs()

    cy.signIn()
    cy.task('stubIncidentReportingApiGetReportWithDetailsById', { report: reportWithDetails })
    cy.visit(`/reports/${reportWithDetails.id}/staff`)
    Page.verifyOnPage(StaffInvolvementsPage).removeLink(0).click()
    removeStaffInvolvementsPage = Page.verifyOnPage(RemoveStaffInvolvementsPage, 'Barry Harrison')
  })

  it('should have back link point to involvements page', () => {
    removeStaffInvolvementsPage.checkBackLink(`/reports/${reportWithDetails.id}/staff`)
  })

  it('should show an error if not confirmed', () => {
    removeStaffInvolvementsPage.submit()
    removeStaffInvolvementsPage.errorSummary.contains('There is a problem')
    Page.verifyOnPage(RemoveStaffInvolvementsPage, 'Barry Harrison')
  })

  it('should return to involvements page if cancelled', () => {
    removeStaffInvolvementsPage.selectRadioButton('No')
    removeStaffInvolvementsPage.submit()

    const staffInvolvementsPage = Page.verifyOnPage(StaffInvolvementsPage)
    staffInvolvementsPage.noNotificationBannersShow()
  })

  it('should delete involvement if confirmed', () => {
    cy.task('stubIncidentReportingApiDeleteRelatedObject', {
      urlSlug: RelatedObjectUrlSlug.staffInvolved,
      reportId: reportWithDetails.id,
      index: 1,
      response: [],
    })

    removeStaffInvolvementsPage.selectRadioButton('Yes')
    removeStaffInvolvementsPage.submit()

    const staffInvolvementsPage = Page.verifyOnPage(StaffInvolvementsPage)
    staffInvolvementsPage.successBannerShows()
    staffInvolvementsPage.checkNotificationBannerContent('You have removed Barry Harrison')
  })
})
