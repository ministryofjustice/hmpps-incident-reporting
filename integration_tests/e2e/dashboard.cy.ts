import type { Response as SuperAgentResponse } from 'superagent'

import type { GetReportsParams } from '../../server/data/incidentReportingApi'
import { mockReport } from '../../server/data/testData/incidentReporting'
import { moorland } from '../../server/data/testData/prisonApi'
import { mockDataWarden, mockReportingOfficer, mockHqViewer } from '../../server/data/testData/users'
import { now } from '../../server/testutils/fakeClock'
import Page from '../pages/page'
import { DashboardPage } from '../pages/dashboard'
import { HomePage } from '../pages/home'
import { ReportPage } from '../pages/reports/report'
import { PecsRegionPage } from '../pages/reports/pecsRegion'
import { TypePage } from '../pages/reports/type'

interface UserScenario {
  userType: string
  user: Express.User
  createReport?: 'prison' | 'pecs'
  dashboardUrl: '/reports?clearFilters=All' | '/reports?clearFilters=ToDo'
}

const userScenarios: UserScenario[] = [
  { userType: 'data wardens', user: mockDataWarden, createReport: 'pecs', dashboardUrl: '/reports?clearFilters=All' },
  {
    userType: 'reporting officers',
    user: mockReportingOfficer,
    createReport: 'prison',
    dashboardUrl: '/reports?clearFilters=ToDo',
  },
  { userType: 'HQ viewers', user: mockHqViewer, dashboardUrl: '/reports?clearFilters=All' },
]
userScenarios.forEach(({ userType, user, createReport, dashboardUrl }) => {
  context(`Dashboard for ${userType}`, () => {
    beforeEach(() => {
      cy.resetBasicStubs({ user })
      cy.signIn()
    })

    it('should be accessible from home page', () => {
      cy.task('stubIncidentReportingApiGetReports')
      const indexPage = Page.verifyOnPage(HomePage)
      indexPage.clickViewReportsCard()
      const dashboardPage = Page.verifyOnPage(DashboardPage)
      dashboardPage.checkLastBreadcrumb('Incident reporting', '/')
    })

    it('should say when nothing was found', () => {
      cy.task('stubIncidentReportingApiGetReports')
      cy.visit(dashboardUrl)
      const dashboardPage = Page.verifyOnPage(DashboardPage)
      dashboardPage.showsNoTable()
      cy.root().should('contain.text', 'No incident report found')
    })

    if (createReport === 'pecs') {
      it('should have a link to create a new PECS report', () => {
        cy.task('stubIncidentReportingApiGetReports')
        cy.visit(dashboardUrl)
        const dashboardPage = Page.verifyOnPage(DashboardPage)
        dashboardPage.createReportLink.should('not.exist')
        dashboardPage.createPecsReportLink.click()
        Page.verifyOnPage(PecsRegionPage)
      })
    } else if (createReport === 'prison') {
      it('should have a link to create a new prison report', () => {
        cy.task('stubIncidentReportingApiGetReports')
        cy.visit(dashboardUrl)
        const dashboardPage = Page.verifyOnPage(DashboardPage)
        dashboardPage.createPecsReportLink.should('not.exist')
        dashboardPage.createReportLink.click()
        Page.verifyOnPage(TypePage)
      })
    } else {
      it('should not see links to create a report', () => {
        cy.task('stubIncidentReportingApiGetReports')
        cy.visit(dashboardUrl)
        const dashboardPage = Page.verifyOnPage(DashboardPage)
        dashboardPage.createPecsReportLink.should('not.exist')
        dashboardPage.createReportLink.should('not.exist')
      })
    }

    context('should allow searching', () => {
      let getReportWithDetailsByIdStubId: string

      beforeEach(() => {
        cy.task('stubIncidentReportingApiGetReports').then((res: SuperAgentResponse) => {
          getReportWithDetailsByIdStubId = JSON.parse(res.text).id
          cy.visit(dashboardUrl)
        })
      })

      interface SearchScenario {
        scenario: string
        userInteraction: (dashboardPage: DashboardPage) => void
        expectedRequest: Partial<DatesAsStrings<GetReportsParams>>
        testPage: (dashboardPage: DashboardPage) => void
      }

      const searchScenarios: SearchScenario[] = [
        {
          scenario: 'for incident number',
          userInteraction: dashboardPage => {
            dashboardPage.query.type('6544')
          },
          expectedRequest: { reference: '6544' },
          testPage: dashboardPage => {
            dashboardPage.query.should('have.value', '6544')
          },
        },
        {
          scenario: 'since incident date',
          userInteraction: dashboardPage => {
            dashboardPage.fromDate.type('5/10/2024')
          },
          expectedRequest: { incidentDateFrom: '2024-10-05' },
          testPage: dashboardPage => {
            dashboardPage.fromDate.should('have.value', '5/10/2024')
          },
        },
        {
          scenario: 'until incident date',
          userInteraction: dashboardPage => {
            dashboardPage.toDate.type('15/1/2025')
          },
          expectedRequest: { incidentDateUntil: '2025-01-15' },
          testPage: dashboardPage => {
            dashboardPage.toDate.should('have.value', '15/1/2025')
          },
        },
        {
          scenario: 'by type',
          userInteraction: dashboardPage => {
            dashboardPage.type.type('Miscellaneous')
          },
          expectedRequest: { type: 'MISCELLANEOUS_1' },
          testPage: dashboardPage => {
            dashboardPage.type.should('have.value', 'Miscellaneous')
          },
        },
        ...(userType === 'reporting officers'
          ? <SearchScenario[]>[
              {
                scenario: 'by one work list',
                userInteraction: dashboardPage => {
                  dashboardPage.statusCheckbox('To do').click()
                  dashboardPage.statusCheckbox('Submitted').click()
                },
                expectedRequest: {
                  status: ['AWAITING_REVIEW', 'UPDATED'],
                },
                testPage: dashboardPage => {
                  dashboardPage.selectedStatuses.should('deep.equal', ['submitted'])
                },
              },
              {
                scenario: 'by several work lists',
                userInteraction: dashboardPage => {
                  dashboardPage.statusCheckbox('Submitted').click()
                },
                expectedRequest: {
                  status: ['DRAFT', 'NEEDS_UPDATING', 'AWAITING_REVIEW', 'UPDATED', 'ON_HOLD'],
                },
                testPage: dashboardPage => {
                  dashboardPage.selectedStatuses.should('deep.equal', ['toDo', 'submitted'])
                },
              },
            ]
          : <SearchScenario[]>[
              {
                scenario: 'by location',
                userInteraction: dashboardPage => {
                  dashboardPage.location.type('Moorland')
                },
                expectedRequest: { location: 'MDI' },
                testPage: dashboardPage => {
                  dashboardPage.location.should('have.value', 'Moorland (HMP & YOI)')
                },
              },
              {
                scenario: 'by one status',
                userInteraction: dashboardPage => {
                  dashboardPage.statusCheckbox('Updated').click()
                },
                expectedRequest: {
                  status: 'UPDATED',
                },
                testPage: dashboardPage => {
                  dashboardPage.selectedStatuses.should('deep.equal', ['UPDATED'])
                },
              },
              {
                scenario: 'by several statuses',
                userInteraction: dashboardPage => {
                  dashboardPage.statusCheckbox('Needs updating').click()
                  dashboardPage.statusCheckbox('Updated').click()
                },
                expectedRequest: {
                  status: ['NEEDS_UPDATING', 'UPDATED'],
                },
                testPage: dashboardPage => {
                  dashboardPage.selectedStatuses.should('deep.equal', ['NEEDS_UPDATING', 'UPDATED'])
                },
              },
              {
                scenario: 'by removal requests',
                userInteraction: dashboardPage => {
                  dashboardPage.removalRequestsCheckbox('Removal requests').click()
                },
                expectedRequest: {
                  userAction: ['REQUEST_NOT_REPORTABLE', 'REQUEST_DUPLICATE'],
                },
                testPage: dashboardPage => {
                  dashboardPage.selectedRemovalRequests.should('deep.equal', ['REQUEST_REMOVAL'])
                },
              },
            ]),
      ]
      for (const searchScenario of searchScenarios) {
        // eslint-disable-next-line no-loop-func
        it(searchScenario.scenario, () => {
          let dashboardPage = Page.verifyOnPage(DashboardPage)
          searchScenario.userInteraction(dashboardPage)

          cy.task('deleteStub', getReportWithDetailsByIdStubId)
          cy.task('stubIncidentReportingApiGetReports', { request: searchScenario.expectedRequest })
          dashboardPage.submit()

          dashboardPage = Page.verifyOnPage(DashboardPage)
          searchScenario.testPage(dashboardPage)
        })
      }
    })

    if (userType !== 'reporting officers') {
      it('should include location options to filter by', () => {
        cy.task('stubIncidentReportingApiGetReports')
        cy.visit(dashboardUrl)
        const dashboardPage = Page.verifyOnPage(DashboardPage)
        dashboardPage.locationOptions.then(locationOptions => {
          let expectedLocationOptions: { label: string; value: string }[]
          if (userType === 'data wardens') {
            expectedLocationOptions = [
              { label: 'All locations', value: '' },
              { label: 'All active locations in Digital Prison Services (DPS)', value: '.ACTIVE' },
              { label: 'All PECS regions', value: '.PECS' },
              { label: 'Moorland (HMP & YOI)', value: 'MDI' },
              { label: 'Leeds (HMP)', value: 'LEI' },
              { label: 'PECS North', value: 'NORTH' },
              { label: 'PECS South', value: 'SOUTH' },
            ]
          } else {
            expectedLocationOptions = [
              { label: 'All locations', value: '' },
              { label: 'All active locations in Digital Prison Services (DPS)', value: '.ACTIVE' },
              { label: 'Moorland (HMP & YOI)', value: 'MDI' },
              { label: 'Leeds (HMP)', value: 'LEI' },
            ]
          }
          expect(locationOptions).to.deep.equal(expectedLocationOptions)
        })
      })
    }

    it('should allow clearing filters', () => {
      cy.task('stubIncidentReportingApiGetReports')
      if (userType !== 'reporting officers') {
        cy.visit(
          '/reports?searchID=6544&fromDate=19%2F03%2F2025&toDate=20%2F3%2F2025&location=MDI&typeFamily=MISCELLANEOUS&incidentStatuses=submitted&latestUserActions=REQUEST_REMOVAL',
        )
      } else {
        cy.visit(
          '/reports?searchID=6544&fromDate=19%2F03%2F2025&toDate=20%2F3%2F2025&location=MDI&typeFamily=MISCELLANEOUS&incidentStatuses=submitted',
        )
      }
      let dashboardPage = Page.verifyOnPage(DashboardPage)
      dashboardPage.query.should('have.value', '6544')
      dashboardPage.fromDate.should('have.value', '19/03/2025') // leading zero
      dashboardPage.toDate.should('have.value', '20/3/2025') // no leading zero
      dashboardPage.type.should('have.value', 'Miscellaneous')
      dashboardPage.selectedStatuses.should('deep.equal', userType === 'reporting officers' ? ['submitted'] : [])
      if (userType !== 'reporting officers') {
        dashboardPage.selectedRemovalRequests.should('deep.equal', ['REQUEST_REMOVAL'])
      }

      dashboardPage.clearFilters()

      dashboardPage = Page.verifyOnPage(DashboardPage)
      dashboardPage.query.should('have.value', '')
      dashboardPage.fromDate.should('have.value', '')
      dashboardPage.toDate.should('have.value', '')
      dashboardPage.type.should('have.value', '')
      dashboardPage.selectedStatuses.should('deep.equal', [])
      if (userType !== 'reporting officers') {
        dashboardPage.selectedRemovalRequests.should('deep.equal', [])
      }
    })

    context('when there are results returned', () => {
      const reports = [
        mockReport({
          type: 'ATTEMPTED_ESCAPE_FROM_PRISON_1',
          reportReference: '6544',
          reportDateAndTime: now,
        }),
        mockReport({
          type: 'MISCELLANEOUS_1',
          status: 'AWAITING_REVIEW',
          reportReference: '6543',
          reportDateAndTime: now,
        }),
      ]

      let dashboardPage: DashboardPage

      beforeEach(() => {
        cy.task('stubIncidentReportingApiGetReports', {
          reports,
        })
        cy.task('stubManageKnownUsers')
        cy.visit(dashboardUrl)
        dashboardPage = Page.verifyOnPage(DashboardPage)
      })

      it('should show a table of reports', () => {
        dashboardPage.tableContents.then(rows => {
          expect(rows).to.have.lengthOf(2)
          const [row1, row2] = rows

          expect(row1.selectLink).to.contain('6544')
          expect(row1.selectLink).to.have.attr('href', `/reports/${reports[0].id}`)
          expect(row1).to.contain({
            type: 'Attempted escape from establishment',
            status: 'Draft',
            incidentDate: '5/12/2023 at 11:34',
            locationOrReporter: userType === 'reporting officers' ? 'John Smith' : 'Moorland (HMP & YOI)',
            description: 'A new incident created in the new service of type ATTEMPTED_ESCAPE_FROM_PRISON_1',
          })

          expect(row2.selectLink).to.contain('6543')
          expect(row2.selectLink).to.have.attr('href', `/reports/${reports[1].id}`)
          expect(row2).to.contain({
            type: 'Miscellaneous',
            status: 'Awaiting review',
            incidentDate: '5/12/2023 at 11:34',
            locationOrReporter: userType === 'reporting officers' ? 'John Smith' : 'Moorland (HMP & YOI)',
            description: 'A new incident created in the new service of type MISCELLANEOUS_1',
          })
        })
      })

      it('should allow clicking through to a report', () => {
        cy.task('stubIncidentReportingApiGetReportWithDetailsById', {
          report: {
            // make a with-details report to fill in the blanks of a basic report
            ...mockReport({
              type: 'ATTEMPTED_ESCAPE_FROM_PRISON_1',
              reportReference: '6544',
              reportDateAndTime: now,
              withDetails: true,
            }),
            // and override with basic report
            ...reports[0],
          },
        })
        cy.task('stubPrisonApiMockPrison', moorland)
        dashboardPage.tableContents.then(rows => {
          expect(rows).to.have.lengthOf(2)
          const [row1] = rows
          row1.selectLink.click()
          Page.verifyOnPage(ReportPage, '6544', userType === 'reporting officers')
        })
      })
    })
  })
})
