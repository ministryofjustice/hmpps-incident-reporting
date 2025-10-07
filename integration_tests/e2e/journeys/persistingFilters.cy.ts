import { mockDataWarden, mockHqViewer, mockReportingOfficer } from '../../../server/data/testData/users'
import { DashboardPage } from '../../pages/dashboard'
import Page from '../../pages/page'
import { mockReport } from '../../../server/data/testData/incidentReporting'
import { now } from '../../../server/testutils/fakeClock'
import { moorland } from '../../../server/data/testData/prisonApi'
import { ReportPage } from '../../pages/reports/report'
import { HomePage } from '../../pages/home'

interface UserScenario {
  userType: string
  user: Express.User
  userActions: 'view report' | 'action report' | 'return from landing page'
  dashboardUrl: '/reports?clearFilters=All' | '/reports?clearFilters=ToDo'
  filterBehaviour: 'persists' | 'are cleared'
}

const userScenarios: UserScenario[] = [
  {
    userType: 'data wardens',
    user: mockDataWarden,
    userActions: 'view report',
    dashboardUrl: '/reports?clearFilters=All',
    filterBehaviour: 'persists',
  },
  {
    userType: 'data wardens',
    user: mockDataWarden,
    userActions: 'action report',
    dashboardUrl: '/reports?clearFilters=All',
    filterBehaviour: 'persists',
  },
  {
    userType: 'data wardens',
    user: mockDataWarden,
    userActions: 'return from landing page',
    dashboardUrl: '/reports?clearFilters=All',
    filterBehaviour: 'are cleared',
  },
  {
    userType: 'reporting officers',
    user: mockReportingOfficer,
    userActions: 'view report',
    dashboardUrl: '/reports?clearFilters=ToDo',
    filterBehaviour: 'persists',
  },
  {
    userType: 'reporting officers',
    user: mockReportingOfficer,
    userActions: 'return from landing page',
    dashboardUrl: '/reports?clearFilters=ToDo',
    filterBehaviour: 'are cleared',
  },
  {
    userType: 'hq viewers',
    user: mockHqViewer,
    userActions: 'view report',
    dashboardUrl: '/reports?clearFilters=All',
    filterBehaviour: 'persists',
  },
  {
    userType: 'hq viewers',
    user: mockHqViewer,
    userActions: 'return from landing page',
    dashboardUrl: '/reports?clearFilters=All',
    filterBehaviour: 'are cleared',
  },
]
userScenarios.forEach(({ userType, user, userActions, dashboardUrl, filterBehaviour }) => {
  context('filters in session', () => {
    context(`for ${userType}`, () => {
      context(`When leaving dashboard to ${userActions}`, () => {
        const reports = [
          mockReport({
            type: 'MISCELLANEOUS_1',
            status: 'AWAITING_REVIEW',
            reportReference: '6543',
            reportDateAndTime: now,
            withDetails: true,
          }),
        ]
        let dashboardPage: DashboardPage
        let reportPage: ReportPage

        beforeEach(() => {
          cy.resetBasicStubs({ user })
          cy.signIn()

          cy.task('stubIncidentReportingApiGetReports', {
            reports,
          })
          cy.task('stubManageKnownUsers')
          cy.task('stubIncidentReportingApiGetReportWithDetailsById', {
            report: {
              ...reports[0],
            },
          })
          cy.task('stubPrisonApiMockPrison', moorland)
          cy.visit(dashboardUrl)
          dashboardPage = Page.verifyOnPage(DashboardPage)
        })

        it(`${filterBehaviour}`, () => {
          // Select filters on dashboard page and submit
          dashboardPage.query.type('6543')
          dashboardPage.fromDate.type('5/10/2023')
          dashboardPage.toDate.type('15/1/2024')
          if (userType !== 'reporting officers') {
            dashboardPage.location.type('Moorland')
          }
          dashboardPage.type.type('Miscellaneous')
          dashboardPage.statusCheckbox(userType === 'reporting officers' ? 'Submitted' : 'Awaiting review').click()
          dashboardPage.submit()

          dashboardPage = Page.verifyOnPage(DashboardPage)

          if (userActions === 'return from landing page') {
            // Navigate out to landing page
            dashboardPage.breadcrumbs.last().click()
          } else {
            // Navigate away to 'view report' page
            dashboardPage.tableContents.then(rows => {
              const [row1] = rows
              row1.selectLink.click()
            })
          }

          if (userActions === 'view report') {
            // Return to dashboard from 'view report' page
            reportPage = Page.verifyOnPage(ReportPage, '6543')
            reportPage.returnLink.click()
          } else if (userActions === 'action report') {
            // Action a report on 'view report' page
            reportPage = Page.verifyOnPage(ReportPage, '6543')
            reportPage.selectAction('Send back')
            reportPage.enterComment('REQUEST_CORRECTION', 'Add prisoner number to description')
            cy.task('stubIncidentReportingApiChangeReportStatus', {
              request: {
                newStatus: 'NEEDS_UPDATING',
                correctionRequest: {
                  userType: 'DATA_WARDEN',
                  userAction: 'REQUEST_CORRECTION',
                  descriptionOfChange: 'Add prisoner number to description',
                },
              },
              report: {
                ...reports[0],
                status: 'NEEDS_UPDATING',
              },
            })
            reportPage.continueButton.click()
          } else if (userActions === 'return from landing page') {
            // Navigate back to dashboard from landing page
            const homePage = Page.verifyOnPage(HomePage)
            homePage.clickViewReportsCard()
          }

          // Check previously selected filters are active on return
          dashboardPage = Page.verifyOnPage(DashboardPage)

          // Filters should be clear or 'To do' if returning from landing page
          if (userActions === 'return from landing page') {
            dashboardPage.query.should('have.value', '')
            dashboardPage.fromDate.should('have.value', '')
            dashboardPage.toDate.should('have.value', '')
            if (userType !== 'reporting officers') {
              dashboardPage.location.should('have.value', '')
            }
            dashboardPage.type.should('have.value', '')
            dashboardPage.selectedStatuses.should('deep.equal', userType === 'reporting officers' ? ['toDo'] : [])
          } else {
            // Filters should be same as when user left dashboard
            dashboardPage.query.should('have.value', '6543')
            dashboardPage.fromDate.should('have.value', '5/10/2023')
            dashboardPage.toDate.should('have.value', '15/1/2024')
            if (userType !== 'reporting officers') {
              dashboardPage.location.should('have.value', 'Moorland (HMP & YOI)')
            }
            dashboardPage.type.should('have.value', 'Miscellaneous')
            dashboardPage.selectedStatuses.should(
              'deep.equal',
              userType === 'reporting officers' ? ['toDo', 'submitted'] : ['AWAITING_REVIEW'],
            )
          }
        })
      })
    })
  })
})
