import type { Express } from 'express'
import request from 'supertest'

import {
  IncidentReportingApi,
  RelatedObjects,
  type ReportWithDetails,
  type AddPrisonerInvolvementRequest,
  type PrisonerInvolvement,
  type UpdatePrisonerInvolvementRequest,
} from '../../../../data/incidentReportingApi'
import { convertReportWithDetailsDates } from '../../../../data/incidentReportingApiUtils'
import { mockErrorResponse, mockReport } from '../../../../data/testData/incidentReporting'
import { andrew } from '../../../../data/testData/offenderSearch'
import { mockThrownError } from '../../../../data/testData/thrownErrors'
import { approverUser, hqUser, reportingUser, unauthorisedUser } from '../../../../data/testData/users'
import { appWithAllRoutes } from '../../../testutils/appSetup'
import { now } from '../../../../testutils/fakeClock'

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

describe('Remove prisoner involvement', () => {
  let mockedReport: ReportWithDetails

  beforeEach(() => {
    mockedReport = convertReportWithDetailsDates(
      mockReport({ reportReference: '6543', reportDateAndTime: now, withDetails: true }),
    )
    mockedReport.prisonersInvolved = [
      {
        prisonerNumber: andrew.prisonerNumber,
        firstName: andrew.firstName,
        lastName: andrew.lastName,
        prisonerRole: 'IMPEDED_STAFF',
        outcome: 'LOCAL_INVESTIGATION',
        comment: 'Some comments',
      },
    ]
    incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(mockedReport)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore need to mock a getter method
    incidentReportingApi.prisonersInvolved = incidentReportingRelatedObjects
  })

  function removePrisonerUrl(index: number): string {
    return `/reports/${mockedReport.id}/prisoners/remove/${index}`
  }

  it('should 404 if report is not found', () => {
    const error = mockThrownError(mockErrorResponse({ status: 404, message: 'Report not found' }), 404)
    incidentReportingApi.getReportWithDetailsById.mockReset()
    incidentReportingApi.getReportWithDetailsById.mockRejectedValueOnce(error)

    return request(app)
      .get(removePrisonerUrl(1))
      .expect(404)
      .expect(res => {
        expect(res.text).toContain('Page not found')
      })
  })

  it('should 404 if prisoner involvement is invalid', () => {
    return request(app)
      .get(removePrisonerUrl(0))
      .expect(404)
      .expect(res => {
        expect(res.text).toContain('Page not found')
      })
  })

  it('should 404 if prisoner involvement is not found', () => {
    mockedReport.prisonersInvolved = []

    return request(app)
      .get(removePrisonerUrl(1))
      .expect(404)
      .expect(res => {
        expect(res.text).toContain('Page not found')
      })
  })

  it('should render title question and options to confirm or deny removal', () => {
    return request(app)
      .get(removePrisonerUrl(1))
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('app-remove-prisoner')

        expect(res.text).toContain('Are you sure you want to remove A1111AA: Andrew Arnold?')
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
      .post(removePrisonerUrl(1))
      .send({ confirmRemove: 'yes' })
      .redirects(1)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('app-prisoner-summary')

        expect(res.text).not.toContain('There is a problem')
        expect(res.text).toContain('You have removed A1111AA: Andrew Arnold')

        expect(incidentReportingRelatedObjects.deleteFromReport).toHaveBeenCalledWith(mockedReport.id, 1)
      })
  })

  it('should not submit the delete request when "no" selected', () => {
    incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(mockedReport)

    return request
      .agent(app)
      .post(removePrisonerUrl(1))
      .send({ confirmRemove: 'no' })
      .redirects(1)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('app-prisoner-summary')

        expect(res.text).not.toContain('There is a problem')
        expect(res.text).not.toContain('You have removed')

        expect(incidentReportingRelatedObjects.deleteFromReport).not.toHaveBeenCalled()
      })
  })

  it('should show an error if user does not choose an option', () => {
    incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(mockedReport)

    return request
      .agent(app)
      .post(removePrisonerUrl(1))
      .send({})
      .redirects(1)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('app-remove-prisoner')

        expect(res.text).toContain('There is a problem')
        expect(res.text).toContain('Select if you would like to remove this prisoner to continue')

        expect(incidentReportingRelatedObjects.deleteFromReport).not.toHaveBeenCalled()
      })
  })

  describe('Permissions', () => {
    // NB: these test cases are simplified because the permissions class methods are thoroughly tested elsewhere

    const granted = 'granted' as const
    const denied = 'denied' as const
    it.each([
      { userType: 'reporting officer', user: reportingUser, action: granted },
      { userType: 'data warden', user: approverUser, action: granted },
      { userType: 'HQ view-only user', user: hqUser, action: denied },
      { userType: 'unauthorised user', user: unauthorisedUser, action: denied },
    ])('should be $action to $userType', ({ user, action }) => {
      const testRequest = request(appWithAllRoutes({ userSupplier: () => user }))
        .get(removePrisonerUrl(1))
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
