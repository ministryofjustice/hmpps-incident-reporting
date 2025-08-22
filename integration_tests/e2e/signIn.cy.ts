import { roleReadWrite } from '../../server/data/constants'
import { mockUser } from '../../server/data/testData/manageUsers'
import Page from '../pages/page'
import { HomePage } from '../pages/home'
import { AuthSignInPage } from '../pages/authSignIn'
import { AuthManageDetailsPage } from '../pages/authManageDetails'

context('Sign in', () => {
  beforeEach(() => {
    cy.task('resetStubs')
    cy.task('stubSignIn', ['PRISON', roleReadWrite])
    cy.task('stubNomisUserCaseloads')
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
    const homePage = Page.verifyOnPage(HomePage)
    homePage.headerUserName.should('contain.text', 'J. Smith')
  })

  it('Environment tag visible in fallback header', () => {
    cy.signIn()
    const homePage = Page.verifyOnPage(HomePage)
    homePage.headerEnvironmentTag.should('contain.text', 'Local')
  })

  it('User can sign out', () => {
    cy.signIn()
    const homePage = Page.verifyOnPage(HomePage)
    homePage.signOut.click()
    Page.verifyOnPage(AuthSignInPage)
  })

  it('User can manage their details', () => {
    cy.signIn()
    cy.task('stubAuthManageDetails')
    const homePage = Page.verifyOnPage(HomePage)

    homePage.manageDetails.get('a').invoke('removeAttr', 'target')
    homePage.manageDetails.click()
    Page.verifyOnPage(AuthManageDetailsPage)
  })

  it('Official sensitive shows in fallback footer', () => {
    cy.signIn()
    const homePage = Page.verifyOnPage(HomePage)
    homePage.footer.should('include.text', 'Official sensitive')
  })

  it('Frontend components load', () => {
    cy.signIn()
    cy.task('stubFrontendComponentsHeaderAndFooter')
    cy.visit('/')
    Page.verifyOnPage(HomePage)
    cy.get('header').should('have.css', 'background-color', 'rgb(255, 0, 0)')
    cy.get('footer').should('have.css', 'background-color', 'rgb(255, 255, 0)')
    cy.window().its('FrontendComponentsHeaderDidLoad').should('be.true')
    cy.window().its('FrontendComponentsFooterDidLoad').should('be.true')
  })

  it('Token verification failure takes user to sign in page', () => {
    cy.signIn()
    Page.verifyOnPage(HomePage)
    cy.task('stubVerifyToken', false)

    cy.visit('/')
    Page.verifyOnPage(AuthSignInPage)
  })

  it('Token verification failure clears user session', () => {
    cy.signIn()
    const homePage = Page.verifyOnPage(HomePage)
    cy.task('stubVerifyToken', false)

    cy.visit('/')
    Page.verifyOnPage(AuthSignInPage)

    cy.task('stubVerifyToken', true)
    cy.task('stubManageUserMe', { user: mockUser('user1', 'bobby brown') })
    cy.signIn()

    homePage.headerUserName.should('contain.text', 'B. Brown')
  })
})
