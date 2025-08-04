import { mockReport } from '../../server/data/testData/incidentReporting'
import { moorland } from '../../server/data/testData/prisonApi'
import Page from '../pages/page'
import { ChangeTypeConfirmationPage, TypePage } from '../pages/reports/type'
import { PrisonerInvolvementsPage } from '../pages/reports/involvements/prisoners'

context('Change incident type', () => {
  const now = new Date()
  const reportWithDetails = mockReport({
    type: 'DISORDER_2',
    reportReference: '6544',
    reportDateAndTime: now,
    withDetails: true,
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
    cy.task('stubIncidentReportingApiGetReportWithDetailsById', { report: reportWithDetails })
    cy.task('stubPrisonApiMockPrison', moorland)
    cy.visit(`/reports/${reportWithDetails.id}/change-type`)
  })

  it('should list available types', () => {
    const changeTypeConfirmationPage = Page.verifyOnPage(ChangeTypeConfirmationPage)
    changeTypeConfirmationPage.submit()

    const typePage = Page.verifyOnPage(TypePage)
    typePage.typeChoices.then(choices => {
      expect(choices).to.deep.equal([
        {
          label: 'Abscond',
          value: 'ABSCOND_1',
          checked: false,
        },
        {
          label: 'Assault',
          value: 'ASSAULT_5',
          checked: false,
        },
        {
          label: 'Attempted escape from escort',
          value: 'ATTEMPTED_ESCAPE_FROM_ESCORT_1',
          checked: false,
        },
        {
          label: 'Attempted escape from establishment',
          value: 'ATTEMPTED_ESCAPE_FROM_PRISON_1',
          checked: false,
        },
        {
          label: 'Bomb explosion or threat',
          value: 'BOMB_1',
          checked: false,
        },
        {
          label: 'Breach or attempted breach of security',
          value: 'BREACH_OF_SECURITY_1',
          checked: false,
        },
        {
          label: 'Close down search',
          value: 'CLOSE_DOWN_SEARCH_1',
          checked: false,
        },
        {
          label: 'Death of other person',
          value: 'DEATH_OTHER_1',
          checked: false,
        },
        {
          label: 'Death of prisoner',
          value: 'DEATH_PRISONER_1',
          checked: false,
        },
        {
          label: 'Drone sighting',
          value: 'DRONE_SIGHTING_3',
          checked: false,
        },
        {
          label: 'Escape from escort',
          value: 'ESCAPE_FROM_ESCORT_1',
          checked: false,
        },
        {
          label: 'Escape from establishment',
          value: 'ESCAPE_FROM_PRISON_1',
          checked: false,
        },
        {
          label: 'Find of illicit items',
          value: 'FIND_6',
          checked: false,
        },
        {
          label: 'Fire',
          value: 'FIRE_1',
          checked: false,
        },
        {
          label: 'Food or liquid refusual',
          value: 'FOOD_REFUSAL_1',
          checked: false,
        },
        {
          label: 'Key or lock compromise',
          value: 'KEY_OR_LOCK_2',
          checked: false,
        },
        {
          label: 'Radio compromise',
          value: 'RADIO_COMPROMISE_1',
          checked: false,
        },
        {
          label: 'Release in error',
          value: 'RELEASE_IN_ERROR_1',
          checked: false,
        },
        {
          label: 'Self harm',
          value: 'SELF_HARM_1',
          checked: false,
        },
        {
          label: 'Temporary release failure',
          value: 'TEMPORARY_RELEASE_FAILURE_4',
          checked: false,
        },
        {
          label: 'Tool or implement loss',
          value: 'TOOL_LOSS_1',
          checked: false,
        },
        {
          label: 'Miscellaneous',
          value: 'MISCELLANEOUS_1',
          checked: false,
        },
      ])
    })
  })

  it('should show an error if type is not chosen', () => {
    const changeTypeConfirmationPage = Page.verifyOnPage(ChangeTypeConfirmationPage)
    changeTypeConfirmationPage.submit()

    const typePage = Page.verifyOnPage(TypePage)
    typePage.submit()
    typePage.errorSummary.contains('There is a problem')
    typePage.errorSummary.contains('Select the incident type')
  })

  it('should allow changing type', () => {
    const changeTypeConfirmationPage = Page.verifyOnPage(ChangeTypeConfirmationPage)
    changeTypeConfirmationPage.submit()

    const typePage = Page.verifyOnPage(TypePage)
    typePage.selectType('MISCELLANEOUS_1')

    cy.task('stubIncidentReportingApiChangeReportType', {
      request: { newType: 'MISCELLANEOUS_1' },
      report: {
        ...reportWithDetails,
        type: 'MISCELLANEOUS_1',
      },
    })
    cy.task('stubIncidentReportingApiUpdateReport', {
      request: { title: 'Disorder (Moorland (HMP & YOI))' }, // NB: still using old type because wiremock stubs are not changed mid-request
      report: {
        ...reportWithDetails,
        type: 'MISCELLANEOUS_1',
        title: 'Disorder (Moorland (HMP & YOI))',
      },
    })
    cy.task('stubPrisonApiMockPrisons')
    cy.task('stubManageKnownUsers')

    typePage.submit()

    Page.verifyOnPage(PrisonerInvolvementsPage, false)
  })
})
