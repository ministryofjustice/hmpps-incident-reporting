import request from 'supertest'

import { PrisonApi } from '../../../../data/prisonApi'
import { appWithAllRoutes } from '../../../testutils/appSetup'
import { now } from '../../../../testutils/fakeClock'
import UserService from '../../../../services/userService'
import { type Status } from '../../../../reportConfiguration/constants'
import { IncidentReportingApi, ReportWithDetails } from '../../../../data/incidentReportingApi'
import { convertReportWithDetailsDates } from '../../../../data/incidentReportingApiUtils'
import { mockReport } from '../../../../data/testData/incidentReporting'

import { mockSharedUser } from '../../../../data/testData/manageUsers'
import { leeds, moorland } from '../../../../data/testData/prisonApi'
import { mockReportingOfficer } from '../../../../data/testData/users'
import { makeSimpleQuestion } from '../../../../data/testData/incidentReportingJest'

jest.mock('../../../../data/prisonApi')
jest.mock('../../../../data/incidentReportingApi')
jest.mock('../../../../services/userService')

let incidentReportingApi: jest.Mocked<IncidentReportingApi>
let userService: jest.Mocked<UserService>
let prisonApi: jest.Mocked<PrisonApi>

beforeEach(() => {
  userService = UserService.prototype as jest.Mocked<UserService>
  incidentReportingApi = IncidentReportingApi.prototype as jest.Mocked<IncidentReportingApi>
  prisonApi = PrisonApi.prototype as jest.Mocked<PrisonApi>

  userService.getUsers.mockResolvedValueOnce({
    [mockSharedUser.username]: mockSharedUser,
  })

  const prisons = {
    LEI: leeds,
    MDI: moorland,
  }
  prisonApi.getPrisons.mockResolvedValue(prisons)
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('RO reopening a closed report', () => {
  let mockedReport: ReportWithDetails
  let reopenReportUrl: string

  beforeEach(() => {
    mockedReport = convertReportWithDetailsDates(
      mockReport({
        reportReference: '6543',
        reportDateAndTime: now,
        type: 'ASSAULT_5',
        status: 'DRAFT',
        withDetails: true,
      }),
    )
    mockedReport.questions = [
      makeSimpleQuestion('61279', 'WHAT WAS THE MAIN MANAGEMENT OUTCOME OF THE INCIDENT', ['IEP REGRESSION', '213063']),
      makeSimpleQuestion('61280', 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES', ['NO', '213067']),
      makeSimpleQuestion('61281', 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT', ['NO', '213069']),
      makeSimpleQuestion('61282', 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED', ['NO', '213071']),
      makeSimpleQuestion('61283', 'IS THE LOCATION OF THE INCDENT KNOWN', ['NO', '213073']),
      makeSimpleQuestion('61285', 'WAS THIS A SEXUAL ASSAULT', ['NO', '213112']),
      makeSimpleQuestion('61286', 'DID THE ASSAULT OCCUR DURING A FIGHT', ['NO', '213114']),
      makeSimpleQuestion('61287', 'WHAT TYPE OF ASSAULT WAS IT', ['PRISONER ON STAFF', '213116']),
      makeSimpleQuestion('61289', 'DESCRIBE THE TYPE OF STAFF', ['OPERATIONAL STAFF - OTHER', '213122']),
      makeSimpleQuestion('61290', 'WAS SPITTING USED IN THIS INCIDENT', ['NO', '213125']),
      makeSimpleQuestion('61294', 'WERE ANY WEAPONS USED', ['NO', '213136']),
      makeSimpleQuestion('61296', 'WERE ANY INJURIES RECEIVED DURING THIS INCIDENT', ['NO', '213150']),
      makeSimpleQuestion('61306', 'ARE THERE ANY STAFF NOW OFF DUTY AS A RESULT OF THIS INCIDENT', ['NO', '213200']),
      makeSimpleQuestion('61307', 'ARE ANY STAFF ON SICK LEAVE AS A RESULT OF THIS INCIDENT', ['NO', '213202']),
      makeSimpleQuestion('61308', 'DID THE ASSAULT OCCUR IN PUBLIC VIEW', ['YES', '213203']),
      makeSimpleQuestion('61309', 'IS THERE ANY AUDIO OR VISUAL FOOTAGE OF THE ASSAULT', ['NO', '213205']),
      makeSimpleQuestion('61311', 'WAS THERE AN APPARENT REASON FOR THE ASSAULT', ['NO', '213213']),
    ]
    incidentReportingApi.getReportWithDetailsById.mockReset()
    incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(mockedReport)
    reopenReportUrl = `/reports/${mockedReport.id}/reopen`
  })

  it.each([
    { currentStatus: 'CLOSED', newStatus: 'REOPENED' },
    { currentStatus: 'DUPLICATE', newStatus: 'NEEDS_UPDATING' },
    { currentStatus: 'NOT_REPORTABLE', newStatus: 'NEEDS_UPDATING' },
  ])(
    'RO reopening a report with status: $currentStatus should change status to $newStatus',
    ({ currentStatus, newStatus }) => {
      mockedReport.status = currentStatus as Status

      incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(mockedReport)
      incidentReportingApi.changeReportStatus.mockResolvedValueOnce(mockedReport) // NB: response is ignored

      return request(appWithAllRoutes({ services: { userService }, userSupplier: () => mockReportingOfficer }))
        .post(reopenReportUrl)
        .send({ userAction: 'reopenReport' })
        .redirects(1)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('app-view-report')
          expect(incidentReportingApi.changeReportStatus).toHaveBeenCalledWith(mockedReport.id, { newStatus })
        })
    },
  )
})
