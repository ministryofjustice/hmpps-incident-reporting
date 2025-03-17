import IndexPage from '../pages'
import Page from '../pages/page'

context('Home page', () => {
  beforeEach(() => {
    cy.resetBasicStubs()
    cy.signIn()
  })

  it('should show tiles & breadcrumbs', () => {
    const homePage = Page.verifyOnPage(IndexPage)
    homePage.checkLastBreadcrumb('Digital Prison Services')
    homePage.cards.spread((...cards: HTMLDivElement[]) => {
      const titles = cards.map(card => card.getElementsByClassName('dps-card__heading')[0].textContent.trim())
      expect(titles).to.deep.equal(['Report an incident', 'View incidents', 'Management reporting'])
    })
  })
})
