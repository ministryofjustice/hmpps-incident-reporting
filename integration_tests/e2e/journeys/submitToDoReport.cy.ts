import { type ReportWithDetails } from '../../../server/data/incidentReportingApi'
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
          request: { title: 'Food or liquid refusal: Arnold A1111AA, Benjamin A2222BB (Moorland (HMP & YOI))' },
          report: {
            ...reportWithDetails,
            title: 'Food or liquid refusal: Arnold A1111AA, Benjamin A2222BB (Moorland (HMP & YOI))',
          },
        })
        cy.task('stubIncidentReportingApiChangeReportStatus', {
          request: {
            newStatus,
            correctionRequest: {
              userType: 'REPORTING_OFFICER',
              userAction: 'REQUEST_REVIEW',
              descriptionOfChange: '(Submitted for review)',
            },
          },
          report: {
            ...reportWithDetails,
            status: newStatus,
          },
        })
        cy.task('stubIncidentReportingApiGetReports') // for empty dashboard page

        reportPage.continueButton.click()

        const dashboardPage = Page.verifyOnPage(DashboardPage)
        dashboardPage.checkNotificationBannerContent(
          isDraft ? 'Incident report 6544 submitted for review' : 'Incident report 6544 resubmitted for review',
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
          cy.task('stubIncidentReportingApiChangeReportStatus', {
            request: {
              newStatus,
              correctionRequest: {
                userType: 'REPORTING_OFFICER',
                userAction: 'REQUEST_DUPLICATE',
                originalReportReference: '6543',
                descriptionOfChange: 'Looks the same to me',
              },
            },
            report: {
              ...reportWithDetails,
              status: newStatus,
            },
          })
          cy.task('stubIncidentReportingApiGetReports') // for empty dashboard page

          requestRemovalPage.submit()

          const dashboardPage = Page.verifyOnPage(DashboardPage)
          dashboardPage.checkNotificationBannerContent('Request to remove incident report 6544 sent')
        })

        it('should be able to request marking it as not reportable', () => {
          const requestRemovalPage = Page.verifyOnPage(RequestRemovalPage)
          requestRemovalPage.selectAction('It is not reportable')
          requestRemovalPage.enterNotReportableComment('Nobody was hurt')

          cy.task('stubIncidentReportingApiChangeReportStatus', {
            request: {
              newStatus,
              correctionRequest: {
                userType: 'REPORTING_OFFICER',
                userAction: 'REQUEST_NOT_REPORTABLE',
                descriptionOfChange: 'Nobody was hurt',
              },
            },
            report: {
              ...reportWithDetails,
              status: newStatus,
            },
          })
          cy.task('stubIncidentReportingApiGetReports') // for empty dashboard page

          requestRemovalPage.submit()

          const dashboardPage = Page.verifyOnPage(DashboardPage)
          dashboardPage.checkNotificationBannerContent('Request to remove incident report 6544 sent')
        })
      })
    })
  })
})
