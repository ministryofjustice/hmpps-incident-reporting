import request from 'supertest'
import type { Express } from 'express'
import { convertReportWithDetailsDates } from '../../../../data/incidentReportingApiUtils'
import { mockReport } from '../../../../data/testData/incidentReporting'
import { now } from '../../../../testutils/fakeClock'
import {
  AddPrisonerInvolvementRequest,
  IncidentReportingApi,
  PrisonerInvolvement,
  RelatedObjects,
  UpdatePrisonerInvolvementRequest,
} from '../../../../data/incidentReportingApi'
import { appWithAllRoutes } from '../../../testutils/appSetup'

jest.mock('../../../../data/incidentReportingApi')

let app: Express
let incidentReportingApi: jest.Mocked<IncidentReportingApi>
let incidentReportingRelatedObjects: jest.Mocked<
  RelatedObjects<PrisonerInvolvement, AddPrisonerInvolvementRequest, UpdatePrisonerInvolvementRequest>
>

beforeEach(() => {
  app = appWithAllRoutes()
  incidentReportingApi = IncidentReportingApi.prototype as jest.Mocked<IncidentReportingApi>
  incidentReportingRelatedObjects = RelatedObjects.prototype as jest.Mocked<
    RelatedObjects<PrisonerInvolvement, AddPrisonerInvolvementRequest, UpdatePrisonerInvolvementRequest>
  >
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET remove prisoner confirmation page', () => {
  let deletePrisonerUrl: string

  it('should render title question and options to confirm or deny removal', () => {
    const mockedReport = convertReportWithDetailsDates(
      mockReport({ reportReference: '6543', reportDateAndTime: now, withDetails: true }),
    )
    incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(mockedReport)
    deletePrisonerUrl = `/reports/${mockedReport.id}/prisoners/remove/1`
    return request(app)
      .get(deletePrisonerUrl)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Are you sure you want to remove A1111AA: Andrew Arnold?')
        expect(res.text).toContain('Yes')
        expect(res.text).toContain('No')
        expect(res.text).toContain('Continue')
        expect(res.text).toContain('Save and exit')
        expect(incidentReportingApi.getReportWithDetailsById).toHaveBeenCalledTimes(1)
        expect(incidentReportingRelatedObjects.deleteFromReport).not.toHaveBeenCalled()
      })
  })
})

describe('form submission', () => {
  let deletePrisonerUrl: string

  it('should submit the correct delete request when "yes" selected', () => {
    const mockedReport = convertReportWithDetailsDates(
      mockReport({ reportReference: '6543', reportDateAndTime: now, withDetails: true }),
    )
    incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(mockedReport)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore need to mock a getter method
    incidentReportingApi.prisonersInvolved = incidentReportingRelatedObjects

    deletePrisonerUrl = `/reports/${mockedReport.id}/prisoners/remove/1`
    return request(app)
      .post(deletePrisonerUrl)
      .send({ removePrisoner: 'yes' })
      .expect(res => {
        expect(res.headers.location).toMatch(`/reports/${mockedReport.id}/prisoners`)
        expect(incidentReportingRelatedObjects.deleteFromReport).toHaveBeenCalledWith(mockedReport.id, 1)
      })
  })

  it('should not submit the delete request when "no" selected', () => {
    const mockedReport = convertReportWithDetailsDates(
      mockReport({ reportReference: '6543', reportDateAndTime: now, withDetails: true }),
    )
    incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(mockedReport)

    deletePrisonerUrl = `/reports/${mockedReport.id}/prisoners/remove/1`
    return request(app)
      .post(deletePrisonerUrl)
      .send({ removePrisoner: 'no' })
      .expect(res => {
        expect(res.headers.location).toMatch(`/reports/${mockedReport.id}/prisoners`)
        expect(incidentReportingRelatedObjects.deleteFromReport).not.toHaveBeenCalledWith()
      })
  })
})
