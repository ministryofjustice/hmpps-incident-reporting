import { convertReportWithDetailsDates } from '../data/incidentReportingApiUtils'
import { mockReport } from '../data/testData/incidentReporting'
import { andrew } from '../data/testData/offenderSearch'
import { newReportTitle, regenerateTitleForReport } from './reportTitle'

describe('Report title generation', () => {
  it('should make a title for a new report from an incident type and location description', () => {
    let title = newReportTitle('FINDS', 'Moorland (HMP & YOI)')
    expect(title).toEqual('Finds (Moorland (HMP & YOI))')

    title = newReportTitle('MISCELLANEOUS', 'Leeds (HMP)')
    expect(title).toEqual('Miscellaneous (Leeds (HMP))')

    title = newReportTitle('ATTEMPTED_ESCAPE_FROM_CUSTODY', 'PECS South')
    expect(title).toEqual('Attempted escape from custody (PECS South)')
  })

  it('should make a title from an existing report without prisoner involvements', () => {
    const report = convertReportWithDetailsDates(
      mockReport({
        type: 'FINDS',
        reportReference: '6544',
        reportDateAndTime: new Date(),
        withDetails: true,
      }),
    )
    report.prisonersInvolved = []
    const title = regenerateTitleForReport(report, 'Moorland (HMP & YOI)')
    expect(title).toEqual('Finds (Moorland (HMP & YOI))')
  })

  it('should make a title from an existing report with prisoner involvements', () => {
    const report = convertReportWithDetailsDates(
      mockReport({
        type: 'MISCELLANEOUS',
        location: 'LEI',
        reportReference: '6544',
        reportDateAndTime: new Date(),
        withDetails: true,
      }),
    )
    report.prisonersInvolved = [
      {
        prisonerNumber: andrew.prisonerNumber,
        firstName: andrew.firstName,
        lastName: andrew.lastName,
        prisonerRole: 'IMPEDED_STAFF',
        outcome: 'LOCAL_INVESTIGATION',
        comment: 'Some comments',
      },
    ]
    const title = regenerateTitleForReport(report, 'Leeds (HMP)')
    expect(title).toEqual('Miscellaneous: Arnold A1111AA (Leeds (HMP))')
  })
})
