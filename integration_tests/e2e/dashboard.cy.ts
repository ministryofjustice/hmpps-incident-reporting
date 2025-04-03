import type { Response as SuperAgentResponse } from 'superagent'
import type { GetReportsParams } from '../../server/data/incidentReportingApi'
import { DashboardPage } from '../pages/dashboard'
import HomePage from '../pages/home'
import Page from '../pages/page'
import ReportPage from '../pages/reports/report'
import { TypePage } from '../pages/reports/type'
import { mockReport } from '../../server/data/testData/incidentReporting'

context('Searching for a report', () => {
  beforeEach(() => {
    cy.resetBasicStubs()

    cy.signIn()

    // populate prisons filter
    cy.task('stubPrisonApiMockPrisons')
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
    cy.visit('/reports')
    const dashboardPage = Page.verifyOnPage(DashboardPage)
    dashboardPage.showsNoTable()
    cy.root().should('contain.text', 'No incident report found')
  })

  it('should have a link to create a new report', () => {
    cy.task('stubIncidentReportingApiGetReports')
    cy.visit('/reports')
    const dashboardPage = Page.verifyOnPage(DashboardPage)
    dashboardPage.createReportLink.click()
    Page.verifyOnPage(TypePage)
  })

  context('should allow searching', () => {
    let getReportWithDetailsByIdStubId: string

    beforeEach(() => {
      cy.task('stubIncidentReportingApiGetReports').then((res: SuperAgentResponse) => {
        getReportWithDetailsByIdStubId = JSON.parse(res.text).id
        return cy.visit('/reports')
      })
      cy.visit('/reports')
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
      // user has only 1 caseload
      // {
      //   scenario: 'by location',
      //   userInteraction: dashboardPage => {
      //     dashboardPage.location.type('Moorland')
      //   },
      //   expectedRequest: { location: 'MDI' },
      //   testPage: dashboardPage => {
      //     dashboardPage.location.should('have.value', 'Moorland')
      //   },
      // },
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
      {
        scenario: 'by one status',
        userInteraction: dashboardPage => {
          dashboardPage.statusCheckbox('To do').click()
          dashboardPage.statusCheckbox('Submitted').click()
        },
        expectedRequest: { status: ['AWAITING_ANALYSIS', 'INFORMATION_AMENDED'] },
        testPage: dashboardPage => {
          dashboardPage.selectedStatuses.should('deep.equal', ['submitted'])
        },
      },
      {
        scenario: 'by several statuses',
        userInteraction: dashboardPage => {
          dashboardPage.statusCheckbox('Submitted').click()
        },
        expectedRequest: {
          status: ['DRAFT', 'INFORMATION_REQUIRED', 'AWAITING_ANALYSIS', 'INFORMATION_AMENDED', 'IN_ANALYSIS'],
        },
        testPage: dashboardPage => {
          dashboardPage.selectedStatuses.should('deep.equal', ['toDo', 'submitted'])
        },
      },
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

  it('should allow clearing filters', () => {
    cy.task('stubIncidentReportingApiGetReports')
    cy.visit(
      '/reports?searchID=6544&fromDate=19%2F03%2F2025&toDate=20%2F03%2F2025&location=MDI&typeFamily=MISCELLANEOUS&incidentStatuses=submitted',
    )
    let dashboardPage = Page.verifyOnPage(DashboardPage)
    dashboardPage.query.should('have.value', '6544')
    dashboardPage.fromDate.should('have.value', '19/03/2025')
    dashboardPage.toDate.should('have.value', '20/03/2025')
    dashboardPage.type.should('have.value', 'Miscellaneous')
    dashboardPage.selectedStatuses.should('deep.equal', ['submitted'])

    dashboardPage.clearFilters()

    dashboardPage = Page.verifyOnPage(DashboardPage)
    dashboardPage.query.should('have.value', '')
    dashboardPage.fromDate.should('have.value', '')
    dashboardPage.toDate.should('have.value', '')
    dashboardPage.type.should('have.value', '')
    dashboardPage.selectedStatuses.should('deep.equal', [])
  })

  context('when there are results returned', () => {
    const reports = [
      mockReport({
        type: 'ATTEMPTED_ESCAPE_FROM_PRISON_1',
        reportReference: '6544',
        reportDateAndTime: new Date(),
      }),
      mockReport({
        type: 'MISCELLANEOUS_1',
        status: 'AWAITING_ANALYSIS',
        reportReference: '6543',
        reportDateAndTime: new Date(),
      }),
    ]

    let dashboardPage: DashboardPage

    beforeEach(() => {
      cy.task('stubIncidentReportingApiGetReports', {
        reports,
      })
      cy.task('stubManageKnownUsers')
      cy.visit('/reports')
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
          locationOrReporter: 'John Smith',
          description: 'A new incident created in the new service of type ATTEMPTED_ESCAPE_FROM_PRISON_1',
        })

        expect(row2.selectLink).to.contain('6543')
        expect(row2.selectLink).to.have.attr('href', `/reports/${reports[1].id}`)
        expect(row2).to.contain({
          type: 'Miscellaneous',
          status: 'Awaiting analysis',
          locationOrReporter: 'John Smith',
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
            reportDateAndTime: new Date(),
            withDetails: true,
          }),
          // and override with basic report
          ...reports[0],
        },
      })
      dashboardPage.tableContents.then(rows => {
        expect(rows).to.have.lengthOf(2)
        const [row1] = rows
        row1.selectLink.click()
        Page.verifyOnPage(ReportPage, '6544', true)
      })
    })
  })
})
