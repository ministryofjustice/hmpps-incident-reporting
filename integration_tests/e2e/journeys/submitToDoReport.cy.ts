import { RelatedObjectUrlSlug, type ReportWithDetails } from '../../../server/data/incidentReportingApi'
import { moorland } from '../../../server/data/testData/prisonApi'
import { mockReportingOfficer } from '../../../server/data/testData/users'
import { now } from '../../../server/testutils/fakeClock'
import Page from '../../pages/page'
import { DashboardPage } from '../../pages/dashboard'
import { ReportPage } from '../../pages/reports/report'
import { RequestRemovalPage } from '../../pages/reports/requestRemoval'
import { validReport } from './validReport'

describe('Submitting “to do” reports', () => {
  beforeEach(() => {
    cy.clock(now)
  })

  const scenarios = [
    { currentStatus: 'DRAFT', newStatus: 'AWAITING_REVIEW' },
    { currentStatus: 'NEEDS_UPDATING', newStatus: 'UPDATED' },
    { currentStatus: 'REOPENED', newStatus: 'WAS_CLOSED' },
  ] as const
  scenarios.forEach(({ currentStatus, newStatus }) => {
    context(`a reporting officer viewing a report with status ${currentStatus}`, () => {
      const reportWithDetails: DatesAsStrings<ReportWithDetails> = {
        ...validReport,
        status: currentStatus,
      }

      beforeEach(() => {
        cy.resetBasicStubs({ user: mockReportingOfficer })
        cy.task('stubPrisonApiMockPrison', moorland)
        cy.task('stubManageKnownUsers')
        cy.signIn()

        cy.task('stubIncidentReportingApiGetReportWithDetailsById', { report: reportWithDetails })
        cy.visit(`/reports/${reportWithDetails.id}`)
      })

      const isDraft = currentStatus === 'DRAFT'

      it('should see a list of actions', () => {
        const reportPage = Page.verifyOnPage(ReportPage, reportWithDetails.reportReference, true)
        reportPage.userActionsChoices.then(choices => {
          const expectedChoices: typeof choices = [
            {
              label: isDraft ? 'Submit' : 'Resubmit it with updated information',
              value: 'REQUEST_REVIEW',
              checked: false,
            },
            { label: 'Remove it as it’s a duplicate or not reportable', value: 'REQUEST_REMOVAL', checked: false },
          ]
          expect(choices).to.deep.equal(expectedChoices)
        })
      })

      it('should be able to submit report for review', () => {
        const reportPage = Page.verifyOnPage(ReportPage, reportWithDetails.reportReference, true)
        reportPage.selectAction(isDraft ? 'Submit' : 'Resubmit it with updated information')
        if (!isDraft) {
          reportPage.enterComment('REQUEST_REVIEW', 'Updated description')
        }

        cy.task('stubIncidentReportingApiUpdateReport', {
          request: { title: 'Food or liquid refusual: Arnold A1111AA, Benjamin A2222BB (Moorland (HMP & YOI))' },
          report: {
            ...reportWithDetails,
            title: 'Food or liquid refusual: Arnold A1111AA, Benjamin A2222BB (Moorland (HMP & YOI))',
          },
        })
        if (!isDraft) {
          cy.task('stubIncidentReportingApiCreateRelatedObject', {
            urlSlug: RelatedObjectUrlSlug.correctionRequests,
            reportId: reportWithDetails.id,
            request: {
              userType: 'REPORTING_OFFICER',
              userAction: 'REQUEST_REVIEW',
              descriptionOfChange: 'Updated description',
            },
            response: [], // technically, missing new comment
          })
        }
        cy.task('stubIncidentReportingApiChangeReportStatus', {
          request: { newStatus },
          report: {
            ...reportWithDetails,
            status: newStatus,
          },
        })
        cy.task('stubIncidentReportingApiGetReports') // for empty dashboard page

        reportPage.continueButton.click()

        const dashboardPage = Page.verifyOnPage(DashboardPage)
        dashboardPage.checkNotificationBannerContent(
          isDraft ? 'You have submitted incident report 6544' : 'You have resubmitted incident report 6544',
        )
      })

      context('choosing to remove a report', () => {
        beforeEach(() => {
          const reportPage = Page.verifyOnPage(ReportPage, reportWithDetails.reportReference, true)
          reportPage.selectAction('Remove it as it’s a duplicate or not reportable')

          cy.task('stubIncidentReportingApiGetReportById', { report: reportWithDetails })

          reportPage.continueButton.click()
        })

        it('should be able to request marking it as a duplicate', () => {
          const requestRemovalPage = Page.verifyOnPage(RequestRemovalPage)

          requestRemovalPage.actionChoices.then(choices => {
            expect(choices).to.deep.equal([
              { label: 'It is a duplicate', value: 'REQUEST_DUPLICATE', checked: false },
              { label: 'It is not reportable', value: 'REQUEST_NOT_REPORTABLE', checked: false },
            ])
          })

          requestRemovalPage.selectAction('It is a duplicate')
          requestRemovalPage.enterOriginalReportReference('6543')
          requestRemovalPage.enterDuplicateComment('Looks the same to me')

          const duplicatedReportId = '0198a59c-1111-2222-3333-444444444444'
          cy.task('stubIncidentReportingApiGetReportByReference', {
            report: {
              ...reportWithDetails,
              id: duplicatedReportId,
              reportReference: '6543',
            },
          })
          cy.task('stubIncidentReportingApiCreateRelatedObject', {
            urlSlug: RelatedObjectUrlSlug.correctionRequests,
            reportId: reportWithDetails.id,
            request: {
              userType: 'REPORTING_OFFICER',
              userAction: 'REQUEST_DUPLICATE',
              originalReportReference: '6543',
              descriptionOfChange: 'Looks the same to me',
            },
            response: [], // technically, missing new comment
          })
          cy.task('stubIncidentReportingApiChangeReportStatus', {
            request: { newStatus },
            report: {
              ...reportWithDetails,
              status: newStatus,
            },
          })
          cy.task('stubIncidentReportingApiGetReports') // for empty dashboard page

          requestRemovalPage.submit()

          const dashboardPage = Page.verifyOnPage(DashboardPage)
          dashboardPage.checkNotificationBannerContent('Request to remove report 6544 sent')
        })

        it('should be able to request marking it as not reportable', () => {
          const requestRemovalPage = Page.verifyOnPage(RequestRemovalPage)
          requestRemovalPage.selectAction('It is not reportable')
          requestRemovalPage.enterNotReportableComment('Nobody was hurt')

          cy.task('stubIncidentReportingApiCreateRelatedObject', {
            urlSlug: RelatedObjectUrlSlug.correctionRequests,
            reportId: reportWithDetails.id,
            request: {
              userType: 'REPORTING_OFFICER',
              userAction: 'REQUEST_NOT_REPORTABLE',
              descriptionOfChange: 'Nobody was hurt',
            },
            response: [], // technically, missing new comment
          })
          cy.task('stubIncidentReportingApiChangeReportStatus', {
            request: { newStatus },
            report: {
              ...reportWithDetails,
              status: newStatus,
            },
          })
          cy.task('stubIncidentReportingApiGetReports') // for empty dashboard page

          requestRemovalPage.submit()

          const dashboardPage = Page.verifyOnPage(DashboardPage)
          dashboardPage.checkNotificationBannerContent('Request to remove report 6544 sent')
        })
      })
    })
  })
})
