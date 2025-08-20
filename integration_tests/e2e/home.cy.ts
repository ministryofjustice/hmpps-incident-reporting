import Page from '../pages/page'
import { HomePage } from '../pages/home'

context('Home page', () => {
  beforeEach(() => {
    cy.resetBasicStubs()
    cy.signIn()
  })

  it('should show tiles & breadcrumbs', () => {
    const homePage = Page.verifyOnPage(HomePage)
    homePage.checkLastBreadcrumb('Digital Prison Services')
    homePage.cardDetails.then(cards => {
      expect(cards).to.deep.equal([
        { title: 'Create an incident report', url: '/create-report' },
        { title: 'Search incident reports', url: '/reports' },
        { title: 'Management reporting', url: '/management-reporting' },
      ])
    })
  })
})
