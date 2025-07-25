import { RelatedObjectUrlSlug } from '../../server/data/incidentReportingApi'
import { mockReport } from '../../server/data/testData/incidentReporting'
import Page from '../pages/page'
import ReportPage from '../pages/reports/report'
import { DescriptionAddendumPage } from '../pages/reports/descriptionAddendum'

context('Add to a report’s description after it’s been reviewed', () => {
  const now = new Date()
  const reportWithDetails = mockReport({
    type: 'DISORDER_2',
    status: 'NEEDS_UPDATING',
    reportReference: '6544',
    reportDateAndTime: now,
    withDetails: true,
    withAddendums: true,
  })
  reportWithDetails.prisonersInvolved = []
  reportWithDetails.prisonerInvolvementDone = true
  reportWithDetails.staffInvolved = []
  reportWithDetails.staffInvolvementDone = true
  reportWithDetails.questions = []
  reportWithDetails.correctionRequests = []

  beforeEach(() => {
    cy.resetBasicStubs()

    cy.signIn()
    cy.task('stubIncidentReportingApiGetReportWithDetailsById', { report: reportWithDetails })
    cy.task('stubManageKnownUsers')
    cy.visit(`/reports/${reportWithDetails.id}/add-description`)
  })

  it('should show existing description chunks', () => {
    const descriptionAddendumPage = Page.verifyOnPage(DescriptionAddendumPage)

    descriptionAddendumPage.descriptionChunks.then(chunks => {
      expect(chunks).to.have.lengthOf(3)
      const [chunk1, chunk2, chunk3] = chunks
      expect(chunk1).to.have.property('name', 'John Smith')
      expect(chunk1).to.have.property('text', 'A new incident created in the new service of type DISORDER_2')
      expect(chunk2).to.have.property('name', 'John Smith')
      expect(chunk2).to.have.property('text', 'Addendum #1')
      expect(chunk3).to.have.property('name', 'Jane Doe')
      expect(chunk3).to.have.property('text', 'Addendum #2')
    })
  })

  it('should allow entering the basic information', () => {
    const descriptionAddendumPage = Page.verifyOnPage(DescriptionAddendumPage)

    descriptionAddendumPage.checkBackLink(`/reports/${reportWithDetails.id}`)
    descriptionAddendumPage.checkCancelLink(`/reports/${reportWithDetails.id}`)

    descriptionAddendumPage.enterDescriptionAddendum('Prisoner was released from healthcare')

    // stub report details update
    cy.task('stubIncidentReportingApiCreateRelatedObject', {
      urlSlug: RelatedObjectUrlSlug.descriptionAddendums,
      reportId: reportWithDetails.id,
      request: {
        firstName: 'John',
        lastName: 'Smith',
        text: 'Prisoner was released from healthcare',
      },
      response: reportWithDetails.descriptionAddendums, // technically, missing new addendum
    })
    // stub lookups from next page, the report view
    cy.task('stubPrisonApiMockPrisons')

    descriptionAddendumPage.submit()

    const reportPage = Page.verifyOnPage(ReportPage, reportWithDetails.reportReference, true)
    reportPage.checkNotificationBannerContent('You have added information to the description')
  })

  it('should show errors if information is missing', () => {
    const descriptionAddendumPage = Page.verifyOnPage(DescriptionAddendumPage)
    descriptionAddendumPage.enterDescriptionAddendum(' ')
    descriptionAddendumPage.submit()
    descriptionAddendumPage.errorSummary.contains('There is a problem')
    descriptionAddendumPage.errorSummary.contains('Enter some additional information')
    Page.verifyOnPage(DescriptionAddendumPage)
  })
})
