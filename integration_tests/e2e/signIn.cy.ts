import IndexPage from '../pages/index'
import AuthSignInPage from '../pages/authSignIn'
import Page from '../pages/page'
import AuthManageDetailsPage from '../pages/authManageDetails'

context('Sign In', () => {
  beforeEach(() => {
    cy.task('resetStubs')
    cy.task('stubSignIn')
    cy.task('stubFallbackHeaderAndFooter')
    cy.task('stubManageUserMe')
  })

  it('Unauthenticated user directed to auth', () => {
    cy.visit('/')
    Page.verifyOnPage(AuthSignInPage)
  })

  it('Unauthenticated user navigating to sign in page directed to auth', () => {
    cy.visit('/sign-in')
    Page.verifyOnPage(AuthSignInPage)
  })

  it('User name visible in fallback header', () => {
    cy.signIn()
    const indexPage = Page.verifyOnPage(IndexPage)
    indexPage.headerUserName.should('contain.text', 'J. Smith')
  })

  it('Environment tag visible in fallback header', () => {
    cy.signIn()
    const indexPage = Page.verifyOnPage(IndexPage)
    indexPage.headerEnvironmentTag.should('contain.text', 'Local')
  })

  it('User can sign out', () => {
    cy.signIn()
    const indexPage = Page.verifyOnPage(IndexPage)
    indexPage.signOut.click()
    Page.verifyOnPage(AuthSignInPage)
  })

  it('User can manage their details', () => {
    cy.signIn()
    cy.task('stubAuthManageDetails')
    const indexPage = Page.verifyOnPage(IndexPage)

    indexPage.manageDetails.get('a').invoke('removeAttr', 'target')
    indexPage.manageDetails.click()
    Page.verifyOnPage(AuthManageDetailsPage)
  })

  it('Official sensitive shows in fallback footer', () => {
    cy.signIn()
    const indexPage = Page.verifyOnPage(IndexPage)
    indexPage.footer.should('include.text', 'Official sensitive')
  })

  it('Frontend components load', () => {
    cy.signIn()
    cy.task('stubFrontendComponentsHeaderAndFooter')
    cy.visit('/')
    Page.verifyOnPage(IndexPage)
    cy.get('header').should('have.css', 'background-color', 'rgb(255, 0, 0)')
    cy.get('footer').should('have.css', 'background-color', 'rgb(255, 255, 0)')
    cy.window().its('FrontendComponentsHeaderDidLoad').should('be.true')
    cy.window().its('FrontendComponentsFooterDidLoad').should('be.true')
  })

  it('Token verification failure takes user to sign in page', () => {
    cy.signIn()
    Page.verifyOnPage(IndexPage)
    cy.task('stubVerifyToken', false)

    // can't do a visit here as cypress requires only one domain
    cy.request('/').its('body').should('contain', 'Sign in')
  })

  it('Token verification failure clears user session', () => {
    cy.signIn()
    const indexPage = Page.verifyOnPage(IndexPage)
    cy.task('stubVerifyToken', false)

    // can't do a visit here as cypress requires only one domain
    cy.request('/').its('body').should('contain', 'Sign in')

    cy.task('stubVerifyToken', true)
    cy.task('stubManageUserMe', 'bobby brown')
    cy.signIn()

    indexPage.headerUserName.contains('B. Brown')
  })
})
