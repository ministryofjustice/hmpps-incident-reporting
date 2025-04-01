import type { Express } from 'express'
import request from 'supertest'

import {
  IncidentReportingApi,
  RelatedObjects,
  type ReportWithDetails,
  type AddStaffInvolvementRequest,
  type StaffInvolvement,
  type UpdateStaffInvolvementRequest,
} from '../../../../data/incidentReportingApi'
import { convertReportWithDetailsDates } from '../../../../data/incidentReportingApiUtils'
import { mockErrorResponse, mockReport } from '../../../../data/testData/incidentReporting'
import { mockThrownError } from '../../../../data/testData/thrownErrors'
import { approverUser, hqUser, reportingUser, unauthorisedUser } from '../../../../data/testData/users'
import { appWithAllRoutes } from '../../../testutils/appSetup'
import { now } from '../../../../testutils/fakeClock'

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

describe('Remove staff involvement', () => {
  let mockedReport: ReportWithDetails

  beforeEach(() => {
    mockedReport = convertReportWithDetailsDates(
      mockReport({ reportReference: '6543', reportDateAndTime: now, withDetails: true }),
    )
    mockedReport.staffInvolved = [
      {
        staffUsername: 'abc12a',
        firstName: 'MARY',
        lastName: 'JOHNSON',
        staffRole: 'NEGOTIATOR',
        comment: 'See duty log',
      },
    ]
    incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(mockedReport)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore need to mock a getter method
    incidentReportingApi.staffInvolved = incidentReportingRelatedObjects
  })

  function removeStaffUrl(index: number): string {
    return `/reports/${mockedReport.id}/staff/remove/${index}`
  }

  it('should 404 if report is not found', () => {
    const error = mockThrownError(mockErrorResponse({ status: 404, message: 'Report not found' }), 404)
    incidentReportingApi.getReportWithDetailsById.mockReset()
    incidentReportingApi.getReportWithDetailsById.mockRejectedValueOnce(error)

    return request(app)
      .get(removeStaffUrl(1))
      .expect(404)
      .expect(res => {
        expect(res.text).toContain('Page not found')
      })
  })

  it('should 404 if staff involvement is invalid', () => {
    return request(app)
      .get(removeStaffUrl(0))
      .expect(404)
      .expect(res => {
        expect(res.text).toContain('Page not found')
      })
  })

  it('should 404 if staff involvement is not found', () => {
    mockedReport.staffInvolved = []

    return request(app)
      .get(removeStaffUrl(1))
      .expect(404)
      .expect(res => {
        expect(res.text).toContain('Page not found')
      })
  })

  it('should render title question and options to confirm or deny removal', () => {
    return request(app)
      .get(removeStaffUrl(1))
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('app-remove-staff')

        expect(res.text).toContain('Are you sure you want to remove Mary Johnson?')
        expect(res.text).toContain('Yes')
        expect(res.text).toContain('No')
        expect(res.text).toContain('Continue')
        expect(res.text).toContain('Save and exit')

        expect(res.text).not.toContain('There is a problem')

        expect(incidentReportingApi.getReportWithDetailsById).toHaveBeenCalledTimes(1)
        expect(incidentReportingRelatedObjects.deleteFromReport).not.toHaveBeenCalled()
      })
  })

  it('should submit the correct delete request when "yes" selected', () => {
    incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(mockedReport)

    return request
      .agent(app)
      .post(removeStaffUrl(1))
      .send({ confirmRemove: 'yes' })
      .redirects(1)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('app-staff-summary')

        expect(res.text).not.toContain('There is a problem')
        expect(res.text).toContain('You have removed Mary Johnson')

        expect(incidentReportingRelatedObjects.deleteFromReport).toHaveBeenCalledWith(mockedReport.id, 1)
      })
  })

  it('should not submit the delete request when "no" selected', () => {
    incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(mockedReport)

    return request
      .agent(app)
      .post(removeStaffUrl(1))
      .redirects(1)
      .expect(200)
      .send({ confirmRemove: 'no' })
      .expect(res => {
        expect(res.text).toContain('app-staff-summary')

        expect(res.text).not.toContain('There is a problem')
        expect(res.text).not.toContain('You have removed')

        expect(incidentReportingRelatedObjects.deleteFromReport).not.toHaveBeenCalled()
      })
  })

  it('should show an error if user does not choose an option', () => {
    incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(mockedReport)

    return request
      .agent(app)
      .post(removeStaffUrl(1))
      .send({})
      .redirects(1)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('app-remove-staff')

        expect(res.text).toContain('There is a problem')
        expect(res.text).toContain('Select yes if you want to remove the member of staff')

        expect(incidentReportingRelatedObjects.deleteFromReport).not.toHaveBeenCalled()
      })
  })

  it('should show an error if API rejects request', () => {
    incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(mockedReport)
    const error = mockThrownError(mockErrorResponse({ message: 'Missing comment' }))
    incidentReportingRelatedObjects.deleteFromReport.mockRejectedValueOnce(error)

    return request
      .agent(app)
      .post(removeStaffUrl(1))
      .send({ confirmRemove: 'yes' })
      .redirects(1)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('There is a problem')
        expect(res.text).toContain('Sorry, there was a problem with your request')
        expect(res.text).not.toContain('Bad Request')
        expect(res.text).not.toContain('Missing comment')
      })
  })

  describe('Permissions', () => {
    // NB: these test cases are simplified because the permissions class methods are thoroughly tested elsewhere

    const granted = 'granted' as const
    const denied = 'denied' as const
    it.each([
      { userType: 'reporting officer', user: reportingUser, action: granted },
      { userType: 'data warden', user: approverUser, action: denied },
      { userType: 'HQ view-only user', user: hqUser, action: denied },
      { userType: 'unauthorised user', user: unauthorisedUser, action: denied },
    ])('should be $action to $userType', ({ user, action }) => {
      const testRequest = request(appWithAllRoutes({ userSupplier: () => user }))
        .get(removeStaffUrl(1))
        .redirects(1)
      if (action === 'granted') {
        return testRequest.expect(200)
      }
      return testRequest.expect(res => {
        expect(res.redirects[0]).toContain('/sign-out')
      })
    })
  })
})
