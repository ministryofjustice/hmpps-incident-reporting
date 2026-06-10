import type { ReportWithDetails } from '../../server/data/incidentReportingApi'
import { convertReportWithDetailsDates } from '../../server/data/incidentReportingApiUtils'
import { mockReport } from '../../server/data/testData/incidentReporting'
import { makeSimpleQuestion } from '../../server/data/testData/incidentReportingJest'
import { andrew } from '../../server/data/testData/offenderSearch'
import { mockReportingOfficer } from '../../server/data/testData/users'
import type { Type } from '../../server/reportConfiguration/constants'
import { now } from '../../server/testutils/fakeClock'

/** Build a closed report of the given type with crafted questions, all within the last 12 months. */
function reportOfType(reference: string, type: Type, questions: ReportWithDetails['questions']): ReportWithDetails {
  const report = convertReportWithDetailsDates(
    mockReport({
      reportReference: reference,
      reportDateAndTime: now,
      type,
      status: 'CLOSED',
      location: andrew.prisonId,
      withDetails: true,
    }),
  )
  report.questions = questions
  return report
}

describe('Prisoner incident summary', () => {
  it('shows the overall and per-family breakdowns', () => {
    const assaultA = reportOfType('6001', 'ASSAULT_5', [
      makeSimpleQuestion('61287', 'WHAT TYPE OF ASSAULT WAS IT', ['PRISONER ON PRISONER', '213115']),
      makeSimpleQuestion('61285', 'WAS THIS A SEXUAL ASSAULT', ['YES', '1']),
      makeSimpleQuestion('61290', 'WAS SPITTING USED IN THIS INCIDENT', ['YES', '2']),
    ])
    const assaultB = reportOfType('6002', 'ASSAULT_5', [
      makeSimpleQuestion('61287', 'WHAT TYPE OF ASSAULT WAS IT', ['PRISONER ON STAFF', '213116']),
      makeSimpleQuestion('61298', 'WAS A SERIOUS INJURY SUSTAINED', ['YES', '3']),
      makeSimpleQuestion('61305', 'WAS MEDICAL TREATMENT FOR CONCUSSION OR INTERNAL INJURIES REQUIRED', ['YES', '4']),
    ])
    const disorder = reportOfType('6003', 'DISORDER_2', [
      makeSimpleQuestion('63179', 'WHAT TYPE OF DISORDER INCIDENT WAS THIS?', ['HOSTAGE', '214686']),
    ])
    const selfHarm = reportOfType('6004', 'SELF_HARM_1', [
      makeSimpleQuestion('44753', 'DID SELF HARM METHOD INVOLVE CUTTING', ['YES', '5']),
      makeSimpleQuestion('45167', 'DID SELF HARM METHOD INVOLVE BURNING', ['YES', '6']),
    ])
    const find = reportOfType('6005', 'FIND_6', [
      makeSimpleQuestion('67187', 'PLEASE SELECT CATEGORY OF FIND', ['DRUG / DRUG EQUIPMENT', '218785']),
      makeSimpleQuestion('67190', 'DESCRIBE THE DRUG FOUND', ['CANNABIS', '7'], ['CRACK', '8']),
    ])
    const fire = reportOfType('6006', 'FIRE_1', [])
    const misc = reportOfType('6007', 'MISCELLANEOUS_1', [])

    const allReports = [assaultA, assaultB, disorder, selfHarm, find, fire, misc]
    const detailedReports = [assaultA, assaultB, disorder, selfHarm, find]

    cy.resetBasicStubs({ user: mockReportingOfficer })
    cy.signIn()
    cy.task('stubOffenderSearchMockPrisoners')
    cy.task('stubIncidentReportingApiGetReports', { reports: allReports })
    detailedReports.forEach(report => cy.task('stubIncidentReportingApiGetReportWithDetailsById', { report }))

    cy.visit(`/prisoner/${andrew.prisonerNumber}/incident-summary`)

    cy.get('h1').should('contain.text', 'Incident summary')
    cy.contains('Assault').should('exist')
    cy.contains('Prisoner on prisoner').should('exist')
    cy.contains('Hostage').should('exist')
    cy.contains('Cannabis').should('exist')

    cy.screenshot('prisoner-incident-summary', { capture: 'fullPage' })
  })
})
