import request from 'supertest'
import type { Express } from 'express'
import { convertReportWithDetailsDates } from '../../../../data/incidentReportingApiUtils'
import { mockReport } from '../../../../data/testData/incidentReporting'
import { now } from '../../../../testutils/fakeClock'
import {
  AddStaffInvolvementRequest,
  IncidentReportingApi,
  StaffInvolvement,
  RelatedObjects,
  UpdateStaffInvolvementRequest,
} from '../../../../data/incidentReportingApi'
import { appWithAllRoutes } from '../../../testutils/appSetup'

jest.mock('../../../../data/incidentReportingApi')

let app: Express
let incidentReportingApi: jest.Mocked<IncidentReportingApi>
let incidentReportingRelatedObjects: jest.Mocked<
  RelatedObjects<StaffInvolvement, AddStaffInvolvementRequest, UpdateStaffInvolvementRequest>
>

beforeEach(() => {
  app = appWithAllRoutes()
  incidentReportingApi = IncidentReportingApi.prototype as jest.Mocked<IncidentReportingApi>
  incidentReportingRelatedObjects = RelatedObjects.prototype as jest.Mocked<
    RelatedObjects<StaffInvolvement, AddStaffInvolvementRequest, UpdateStaffInvolvementRequest>
  >
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET remove staff confirmation page', () => {
  let deleteStaffUrl: string

  it('should render title question and options to confirm or deny removal', () => {
    const mockedReport = convertReportWithDetailsDates(
      mockReport({ reportReference: '6543', reportDateAndTime: now, withDetails: true }),
    )
    incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(mockedReport)
    deleteStaffUrl = `/reports/${mockedReport.id}/staff/remove/1`
    return request(app)
      .get(deleteStaffUrl)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Are you sure you want to remove Mary Johnson?')
        expect(res.text).toContain('Yes')
        expect(res.text).toContain('No')
        expect(res.text).toContain('Continue')
        expect(res.text).toContain('Save and exit')
        expect(incidentReportingApi.getReportWithDetailsById).toHaveBeenCalledTimes(1)
        expect(incidentReportingRelatedObjects.deleteFromReport).not.toHaveBeenCalled()
      })
  })
})

describe('staff remove form submission', () => {
  let deleteStaffUrl: string

  it('should submit the correct delete request when "yes" selected', () => {
    const mockedReport = convertReportWithDetailsDates(
      mockReport({ reportReference: '6543', reportDateAndTime: now, withDetails: true }),
    )
    incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(mockedReport)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore need to mock a getter method
    incidentReportingApi.staffInvolved = incidentReportingRelatedObjects

    deleteStaffUrl = `/reports/${mockedReport.id}/staff/remove/1`
    return request(app)
      .post(deleteStaffUrl)
      .send({ removeStaff: 'yes' })
      .expect(res => {
        expect(res.headers.location).toMatch(`/reports/${mockedReport.id}/staff`)
        expect(incidentReportingRelatedObjects.deleteFromReport).toHaveBeenCalledWith(mockedReport.id, 1)
      })
  })

  it('should not submit the delete request when "no" selected', () => {
    const mockedReport = convertReportWithDetailsDates(
      mockReport({ reportReference: '6543', reportDateAndTime: now, withDetails: true }),
    )
    incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(mockedReport)

    deleteStaffUrl = `/reports/${mockedReport.id}/staff/remove/1`
    return request(app)
      .post(deleteStaffUrl)
      .send({ removeStaff: 'no' })
      .expect(res => {
        expect(res.headers.location).toMatch(`/reports/${mockedReport.id}/staff`)
        expect(incidentReportingRelatedObjects.deleteFromReport).not.toHaveBeenCalledWith()
      })
  })
})
