import { mockDataWarden, mockReportingOfficer, mockHqViewer } from '../../server/data/testData/users'
import Page from '../pages/page'
import { HomePage } from '../pages/home'

const scenarios: Scenario[] = [
  { userType: 'reporting officers', user: mockReportingOfficer },
  { userType: 'data wardens', user: mockDataWarden },
  { userType: 'HQ viewers', user: mockHqViewer },
]
for (const { userType, user } of scenarios) {
  context(`Home page for ${userType}`, () => {
    beforeEach(() => {
      cy.resetBasicStubs({ user })
      cy.signIn()
    })

    it('should show tiles & breadcrumbs', () => {
      const homePage = Page.verifyOnPage(HomePage)
      homePage.checkLastBreadcrumb('Digital Prison Services')
      homePage.cardDetails.then(cards => {
        const expectedTiles = [
          { title: 'Search incident reports', url: '/reports?clearFilters=true' },
          { title: 'Management reporting', url: '/management-reporting' },
        ]
        if (userType === 'reporting officers') {
          expectedTiles.unshift({ title: 'Create an incident report', url: '/create-report' })
        } else if (userType === 'data wardens') {
          expectedTiles.unshift({ title: 'Create a PECS incident report', url: '/create-report/pecs' })
        }
        expect(cards).to.deep.equal(expectedTiles)
      })
    })
  })
}

interface Scenario {
  userType: string
  user: Express.User
}
