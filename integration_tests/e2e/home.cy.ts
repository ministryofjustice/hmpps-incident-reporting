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
    homePage.cards.spread((...cards: HTMLDivElement[]) => {
      const titles = cards.map(card => card.getElementsByClassName('dps-card__heading')[0].textContent.trim())
      expect(titles).to.deep.equal(['Create an incident report', 'Search incident reports', 'Management reporting'])
    })
  })
})
