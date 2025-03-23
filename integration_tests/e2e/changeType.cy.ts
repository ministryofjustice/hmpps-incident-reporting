import { mockReport } from '../../server/data/testData/incidentReporting'
import Page from '../pages/page'
import { ChangeTypeConfirmationPage, TypePage } from '../pages/reports/type'

context('Change incident type', () => {
  const now = new Date()
  const reportWithDetails = mockReport({
    type: 'DISORDER',
    reportReference: '6544',
    reportDateAndTime: now,
    withDetails: true, // needed when redirecting back to view page
  })
  reportWithDetails.prisonersInvolved = []
  reportWithDetails.prisonerInvolvementDone = false
  reportWithDetails.staffInvolved = []
  reportWithDetails.staffInvolvementDone = false
  reportWithDetails.questions = []
  reportWithDetails.correctionRequests = []

  beforeEach(() => {
    cy.resetBasicStubs()

    cy.signIn()
    cy.task('stubIncidentReportingApiGetReportById', { report: reportWithDetails })
    cy.visit(`/reports/${reportWithDetails.id}/change-type`)
  })

  it('should list available types', () => {
    const changeTypeConfirmationPage = Page.verifyOnPage(ChangeTypeConfirmationPage)
    changeTypeConfirmationPage.submit()

    const typePage = Page.verifyOnPage(TypePage)
    typePage.typeChoices.then(choices => {
      expect(choices).to.deep.equal([
        {
          label: 'Absconder',
          value: 'ABSCONDER',
          checked: false,
        },
        {
          label: 'Assault',
          value: 'ASSAULT',
          checked: false,
        },
        {
          label: 'Attempted escape from custody',
          value: 'ATTEMPTED_ESCAPE_FROM_CUSTODY',
          checked: false,
        },
        {
          label: 'Attempted escape from escort',
          value: 'ATTEMPTED_ESCAPE_FROM_ESCORT',
          checked: false,
        },
        {
          label: 'Bomb threat',
          value: 'BOMB_THREAT',
          checked: false,
        },
        {
          label: 'Breach of security',
          value: 'BREACH_OF_SECURITY',
          checked: false,
        },
        {
          label: 'Death in custody',
          value: 'DEATH_IN_CUSTODY',
          checked: false,
        },
        {
          label: 'Death (other)',
          value: 'DEATH_OTHER',
          checked: false,
        },
        {
          label: 'Drone sighting',
          value: 'DRONE_SIGHTING',
          checked: false,
        },
        {
          label: 'Escape from custody',
          value: 'ESCAPE_FROM_CUSTODY',
          checked: false,
        },
        {
          label: 'Escape from escort',
          value: 'ESCAPE_FROM_ESCORT',
          checked: false,
        },
        {
          label: 'Finds',
          value: 'FINDS',
          checked: false,
        },
        {
          label: 'Fire',
          value: 'FIRE',
          checked: false,
        },
        {
          label: 'Food refusal',
          value: 'FOOD_REFUSAL',
          checked: false,
        },
        {
          label: 'Full close down search',
          value: 'FULL_CLOSE_DOWN_SEARCH',
          checked: false,
        },
        {
          label: 'Key lock incident',
          value: 'KEY_LOCK_INCIDENT',
          checked: false,
        },
        {
          label: 'Radio compromise',
          value: 'RADIO_COMPROMISE',
          checked: false,
        },
        {
          label: 'Released in error',
          value: 'RELEASED_IN_ERROR',
          checked: false,
        },
        {
          label: 'Self harm',
          value: 'SELF_HARM',
          checked: false,
        },
        {
          label: 'Temporary release failure',
          value: 'TEMPORARY_RELEASE_FAILURE',
          checked: false,
        },
        {
          label: 'Tool loss',
          value: 'TOOL_LOSS',
          checked: false,
        },
        {
          label: 'Miscellaneous',
          value: 'MISCELLANEOUS',
          checked: false,
        },
      ])
    })
  })

  it('should show an error if not type is chosen', () => {
    const changeTypeConfirmationPage = Page.verifyOnPage(ChangeTypeConfirmationPage)
    changeTypeConfirmationPage.submit()

    const typePage = Page.verifyOnPage(TypePage)
    typePage.submit()
    typePage.errorSummary.contains('There is a problem')
  })

  it('should allow changing type', () => {
    const changeTypeConfirmationPage = Page.verifyOnPage(ChangeTypeConfirmationPage)
    changeTypeConfirmationPage.submit()

    const typePage = Page.verifyOnPage(TypePage)
    typePage.selectType('MISCELLANEOUS')

    cy.task('stubIncidentReportingApiChangeReportType', {
      request: { newType: 'MISCELLANEOUS' },
      report: reportWithDetails,
    })
    cy.task('stubIncidentReportingApiGetReportWithDetailsById', { report: reportWithDetails })
    cy.task('stubPrisonApiMockPrisons')
    cy.task('stubManageKnownUsers')

    typePage.submit()
  })
})
